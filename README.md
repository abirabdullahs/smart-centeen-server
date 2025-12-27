# 🔧 Smart Canteen Server - Backend API

The backend server for Smart Canteen digital food ordering system. Built with Node.js and Express, this RESTful API handles all server-side operations including user authentication, order management, payment processing, and database operations.

## 🌟 Features

### API Endpoints
- **User Management**
  - User registration and authentication
  - Profile management
  - Password reset functionality
  
- **Food Management**
  - Get all food items
  - Get food by ID
  - Add new food items (Admin)
  - Update food details (Admin)
  - Delete food items (Admin)
  
- **Order Management**
  - Create new orders
  - Get user orders
  - Get all orders (Admin)
  - Update order status (Admin)
  - Order history tracking
  
- **Cart Operations**
  - Cart data synchronization
  - Real-time cart updates
  
- **Payment Processing**
  - Stripe payment intent creation
  - Payment confirmation
  - Transaction history
  
- **Admin Operations**
  - Admin authentication
  - Dashboard statistics
  - User management
  - Order analytics

### Technical Features
- **RESTful API Architecture**
- **JWT Authentication** - Secure token-based auth
- **Role-Based Access Control** - User and Admin roles
- **Input Validation** - Request data validation
- **Error Handling** - Comprehensive error responses
- **CORS Enabled** - Cross-origin resource sharing
- **Security** - Helmet, rate limiting, sanitization
- **Payment Integration** - Stripe webhook support

## 🛠️ Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB (assumed)
- **Authentication:** JWT (JSON Web Tokens)
- **Payment:** Stripe API
- **Security:** 
  - Helmet (HTTP headers)
  - CORS
  - Express Rate Limit
  - Express Validator
- **Environment:** dotenv

## 📁 Project Structure

```
smart-canteen-server/
├── index.js              # Main server file & entry point
├── package.json          # Dependencies & scripts
└── README.md            # Documentation

# Recommended expanded structure:
├── config/
│   ├── db.js            # Database connection
│   └── stripe.js        # Stripe configuration
├── controllers/
│   ├── authController.js
│   ├── foodController.js
│   ├── orderController.js
│   └── paymentController.js
├── middleware/
│   ├── auth.js          # JWT verification
│   ├── adminAuth.js     # Admin role check
│   └── errorHandler.js  # Global error handler
├── models/
│   ├── User.js
│   ├── Food.js
│   └── Order.js
├── routes/
│   ├── auth.js
│   ├── food.js
│   ├── order.js
│   └── payment.js
└── utils/
    ├── generateToken.js
    └── validators.js
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- MongoDB database (local or MongoDB Atlas)
- Stripe account

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/smart-canteen-server.git
   cd smart-canteen-server
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create .env file**
   ```bash
   touch .env
   ```

4. **Configure environment variables**
   ```env
   # Server Configuration
   PORT=5000
   NODE_ENV=development
   
   # Database
   MONGO_URI=mongodb://localhost:27017/smart-canteen
   # Or MongoDB Atlas:
   # MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/smart-canteen
   
   # JWT Secret
   JWT_SECRET=your_super_secret_jwt_key_here
   JWT_EXPIRE=7d
   
   # Stripe
   STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
   STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
   
   # Admin Credentials (for initial setup)
   ADMIN_EMAIL=admin@smartcanteen.com
   ADMIN_PASSWORD=secure_admin_password
   
   # Client URL (for CORS)
   CLIENT_URL=http://localhost:5173
   ```

5. **Run the server**
   
   **Development mode:**
   ```bash
   npm run dev
   ```
   
   **Production mode:**
   ```bash
   npm start
   ```

6. **Verify server is running**
   ```
   Server should be running on http://localhost:5000
   ```

## 📡 API Endpoints

### Authentication Routes (`/api/auth`)

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword123"
}
```

#### Login User
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securepassword123"
}
```

#### Get Current User
```http
GET /api/auth/me
Authorization: Bearer <token>
```

#### Forgot Password
```http
POST /api/auth/forgot-password
Content-Type: application/json

{
  "email": "john@example.com"
}
```

### Food Routes (`/api/food`)

#### Get All Food Items
```http
GET /api/food
```

#### Get Single Food Item
```http
GET /api/food/:id
```

#### Add Food Item (Admin Only)
```http
POST /api/food
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "name": "Chicken Burger",
  "description": "Delicious grilled chicken burger",
  "price": 250,
  "category": "Fast Food",
  "image": "image_url",
  "available": true
}
```

#### Update Food Item (Admin Only)
```http
PUT /api/food/:id
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "price": 280,
  "available": false
}
```

#### Delete Food Item (Admin Only)
```http
DELETE /api/food/:id
Authorization: Bearer <admin_token>
```

### Order Routes (`/api/orders`)

#### Create Order
```http
POST /api/orders
Authorization: Bearer <token>
Content-Type: application/json

{
  "items": [
    {
      "foodId": "food_id_1",
      "quantity": 2,
      "price": 250
    }
  ],
  "totalAmount": 500,
  "paymentIntentId": "pi_stripe_payment_id"
}
```

#### Get User Orders
```http
GET /api/orders/my-orders
Authorization: Bearer <token>
```

#### Get All Orders (Admin Only)
```http
GET /api/orders
Authorization: Bearer <admin_token>
```

#### Update Order Status (Admin Only)
```http
PUT /api/orders/:id/status
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "status": "preparing" | "ready" | "completed" | "cancelled"
}
```

### Payment Routes (`/api/payment`)

#### Create Payment Intent
```http
POST /api/payment/create-payment-intent
Authorization: Bearer <token>
Content-Type: application/json

{
  "amount": 500
}
```

#### Stripe Webhook
```http
POST /api/payment/webhook
Stripe-Signature: <signature>
```

### Admin Routes (`/api/admin`)

#### Admin Login
```http
POST /api/admin/login
Content-Type: application/json

{
  "email": "admin@smartcanteen.com",
  "password": "admin_password"
}
```

#### Dashboard Statistics
```http
GET /api/admin/dashboard
Authorization: Bearer <admin_token>
```

## 🔐 Authentication & Authorization

### JWT Token Structure
```javascript
{
  "userId": "user_id_here",
  "email": "user@example.com",
  "role": "user" | "admin",
  "iat": 1234567890,
  "exp": 1234567890
}
```

### Protected Routes
Routes require valid JWT token in Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

### Admin Routes
Additional role check for admin-only operations

## 💳 Stripe Integration

### Setup Webhook
1. Go to Stripe Dashboard → Developers → Webhooks
2. Add endpoint: `https://your-domain.com/api/payment/webhook`
3. Select events: `payment_intent.succeeded`, `payment_intent.payment_failed`
4. Copy webhook signing secret to `.env`

### Testing Payments
Use Stripe test cards:
- Success: `4242 4242 4242 4242`
- Decline: `4000 0000 0000 0002`

## 🗄️ Database Schema

### User Model
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: String (enum: ['user', 'admin']),
  createdAt: Date,
  updatedAt: Date
}
```

### Food Model
```javascript
{
  name: String,
  description: String,
  price: Number,
  category: String,
  image: String,
  available: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Order Model
```javascript
{
  userId: ObjectId (ref: User),
  items: [{
    foodId: ObjectId (ref: Food),
    quantity: Number,
    price: Number
  }],
  totalAmount: Number,
  status: String (enum: ['pending', 'preparing', 'ready', 'completed', 'cancelled']),
  paymentIntentId: String,
  paymentStatus: String,
  createdAt: Date,
  updatedAt: Date
}
```

## 🔧 Available Scripts

```bash
npm start              # Start production server
npm run dev            # Start development server with nodemon
npm run seed           # Seed database with sample data (if implemented)
npm test               # Run tests (if implemented)
```

## 🛡️ Security Features

- **Password Hashing:** bcrypt with salt rounds
- **JWT Authentication:** Secure token-based auth
- **Input Validation:** Express validator
- **SQL Injection Prevention:** MongoDB parameterized queries
- **XSS Protection:** Sanitized inputs
- **CORS:** Configured for specific origins
- **Rate Limiting:** Prevent brute force attacks
- **Helmet:** Secure HTTP headers
- **Environment Variables:** Sensitive data protection

## 📊 Error Handling

### Standard Error Response
```json
{
  "success": false,
  "error": "Error message here",
  "statusCode": 400
}
```

### Success Response
```json
{
  "success": true,
  "data": { ... },
  "message": "Operation successful"
}
```

## 🚀 Deployment

### Environment Setup
Ensure all environment variables are set in production

### Deploy to Heroku
```bash
heroku create smart-canteen-api
heroku config:set NODE_ENV=production
heroku config:set MONGO_URI=your_mongodb_uri
heroku config:set JWT_SECRET=your_jwt_secret
heroku config:set STRIPE_SECRET_KEY=your_stripe_key
git push heroku main
```

### Deploy to Railway/Render
1. Connect GitHub repository
2. Set environment variables
3. Deploy automatically

### Deploy to VPS (Ubuntu)
```bash
# Install Node.js and PM2
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
sudo npm install pm2 -g

# Clone and setup
git clone https://github.com/yourusername/smart-canteen-server.git
cd smart-canteen-server
npm install
cp .env.example .env
# Edit .env with production values

# Start with PM2
pm2 start index.js --name smart-canteen-api
pm2 save
pm2 startup
```

## 📈 Performance Optimization

- **Database Indexing:** Indexed frequently queried fields
- **Caching:** Redis for session management (can be added)
- **Compression:** Gzip compression for responses
- **Load Balancing:** PM2 cluster mode for multiple instances

## 🧪 Testing

```bash
# Install testing dependencies
npm install --save-dev jest supertest

# Run tests
npm test

# Run with coverage
npm run test:coverage
```

## 📝 API Documentation

For detailed API documentation, you can integrate:
- **Swagger/OpenAPI:** Auto-generated API docs
- **Postman Collection:** Import and test endpoints

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📋 TODO / Future Enhancements

- [ ] Real-time notifications with Socket.io
- [ ] Advanced search and filtering
- [ ] Analytics and reporting
- [ ] Email notifications for orders
- [ ] SMS notifications
- [ ] Multi-language support
- [ ] File upload for food images
- [ ] Reviews and ratings system
- [ ] Discount coupon system
- [ ] Inventory management
- [ ] Automated testing suite
- [ ] API rate limiting per user
- [ ] Logging with Winston
- [ ] Health check endpoint

## 📄 License

This project is licensed under the MIT License

## 🙏 Acknowledgments

- Express.js community
- MongoDB documentation
- Stripe API documentation
- Node.js best practices

---

⭐ Star this repo if you find it helpful!

## 📞 Support

For issues and questions:
- Open an issue on GitHub
