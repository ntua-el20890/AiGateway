// index.js
const app = require('./app');
const connectDB = require('./config/db');

// Connect to the database
connectDB();

// Start the server
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});