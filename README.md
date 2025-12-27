# Smart Canteen — Server

Overview
--------
This is the backend for the Smart Canteen app. The entry point is `index.js` which starts the server and connects to the database.

Quick start
-----------
Prerequisites:
- Node.js (14+)
- npm

Install and run locally:

```bash
cd "F:\web projects\smart-centeen\smart-canteen-server"
npm install
node index.js
```

If a `start` script exists in `package.json` you can run:

```bash
npm start
```

Environment / configuration
---------------------------
- Typical env variables the server expects:
  - `PORT` — server port (default 3000 or as set in `index.js`)
  - `MONGO_URI` — MongoDB connection string
  - `JWT_SECRET` — secret for signing tokens (if used)
- See the server entry [smart-canteen-server/index.js](smart-canteen-server/index.js#L1) to confirm required env variables and connection details.

Troubleshooting
---------------
- If the server exits immediately, check logs for missing env variables or failing DB connection.
- Ensure MongoDB is reachable from your machine or provide the correct hosted MongoDB URI.
