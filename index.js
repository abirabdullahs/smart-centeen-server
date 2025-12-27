require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

// Initialize Stripe only if secret key exists
let stripe = null;
if (process.env.STRIPE_SECRET_KEY) {
  stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
} else {
  console.warn("⚠️ STRIPE_SECRET_KEY not found in .env file");
}

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = process.env.MONGO_URI;
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.connect();
    await client.db("admin").command({ ping: 1 });

    console.log("MongoDB Atlas connected successfully");

    const db = client.db("canteen");
    const foodsCollection = db.collection("foods");
    const productsCollection = db.collection("products");
    const ordersCollection = db.collection("orders");
    const reviewsCollection = db.collection("reviews");
    const paymentsCollection = db.collection("payments");

    // ============ FOODS ENDPOINTS ============
    app.get("/", (req, res) => {
      res.send("Express + MongoDB Atlas is running 🚀");
    });

    app.get("/foods", async (req, res) => {
      try {
        const foods = await foodsCollection.find().toArray();
        res.json(foods);
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    });

    app.post("/foods", async (req, res) => {
      try {
        const food = req.body;
        const result = await foodsCollection.insertOne(food);
        res.json(result);
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    });


    // UPDATE FOOD
    app.put("/foods/:id", async (req, res) => {
      try {
        const id = req.params.id;
        const data = req.body;

        const result = await foodsCollection.updateOne(
          { _id: new ObjectId(id) },
          { $set: data }
        );

        if (!result.matchedCount) return res.status(404).json({ error: "Food not found" });

        res.json({ message: "Food updated successfully" });
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    });


    // DELETE FOOD
    app.delete("/foods/:id", async (req, res) => {
      try {
        const id = req.params.id;

        const result = await foodsCollection.deleteOne({ _id: new ObjectId(id) });

        if (!result.deletedCount) return res.status(404).json({ error: "Food not found" });

        res.json({ message: "Food deleted successfully" });
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    });

    // ============ FOOD DETAILS ENDPOINT ============
    app.get("/api/food/:id", async (req, res) => {
      try {
        const id = req.params.id;
        const food = await foodsCollection.findOne({ _id: new ObjectId(id) });
        
        if (!food) {
          return res.status(404).json({ error: "Food not found" });
        }
        
        res.json(food);
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    });

    // ============ PAYMENT ENDPOINTS ============
    app.post("/api/create-payment-intent", async (req, res) => {
      try {
        if (!stripe) {
          return res.status(500).json({ error: "Stripe is not configured. Please set STRIPE_SECRET_KEY in .env" });
        }

        const { amount, userId, items, shippingAddress } = req.body;

        // Create a payment intent with Stripe
        const paymentIntent = await stripe.paymentIntents.create({
          amount: amount, // amount in cents
          currency: "bdt",
          metadata: {
            userId,
            itemCount: items.length,
          },
        });

        // Save payment record to database
        await paymentsCollection.insertOne({
          userId,
          paymentIntentId: paymentIntent.id,
          amount,
          currency: "bdt",
          status: "pending",
          items,
          shippingAddress,
          createdAt: new Date(),
        });

        res.json({ clientSecret: paymentIntent.client_secret });
      } catch (err) {
        console.error("Payment error:", err);
        res.status(500).json({ error: err.message });
      }
    });

    // ============ ORDERS ENDPOINTS ============
    app.post("/api/orders", async (req, res) => {
      try {
        const order = {
          ...req.body,
          createdAt: new Date(),
        };

        const result = await ordersCollection.insertOne(order);
        res.json({ _id: result.insertedId, ...order });
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    });

    app.get("/api/orders/:userId", async (req, res) => {
      try {
        const userId = req.params.userId;
        const orders = await ordersCollection
          .find({ userId })
          .sort({ createdAt: -1 })
          .toArray();

        res.json(orders);
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    });

    app.get("/api/orders/detail/:orderId", async (req, res) => {
      try {
        const orderId = req.params.orderId;
        const order = await ordersCollection.findOne({ _id: new ObjectId(orderId) });

        if (!order) {
          return res.status(404).json({ error: "Order not found" });
        }

        res.json(order);
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    });

    app.put("/api/orders/:orderId", async (req, res) => {
      try {
        const orderId = req.params.orderId;
        const updateData = req.body;

        const result = await ordersCollection.updateOne(
          { _id: new ObjectId(orderId) },
          { $set: updateData }
        );

        if (!result.matchedCount) {
          return res.status(404).json({ error: "Order not found" });
        }

        res.json({ message: "Order updated successfully" });
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    });

    // ============ REVIEWS ENDPOINTS ============
    app.post("/api/reviews", async (req, res) => {
      try {
        const review = {
          ...req.body,
          createdAt: new Date(),
        };

        const result = await reviewsCollection.insertOne(review);
        res.json({ _id: result.insertedId, ...review });
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    });

    app.get("/api/reviews/:foodId", async (req, res) => {
      try {
        const foodId = req.params.foodId;
        const reviews = await reviewsCollection
          .find({ foodId })
          .sort({ createdAt: -1 })
          .toArray();

        res.json(reviews);
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    });

    app.delete("/api/reviews/:reviewId", async (req, res) => {
      try {
        const reviewId = req.params.reviewId;
        const result = await reviewsCollection.deleteOne({
          _id: new ObjectId(reviewId),
        });

        if (!result.deletedCount) {
          return res.status(404).json({ error: "Review not found" });
        }

        res.json({ message: "Review deleted successfully" });
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    });


  } catch (err) {
    console.error("MongoDB Error:", err.message);
  }
}

run();

app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});
