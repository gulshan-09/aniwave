const mongoose = require('mongoose');

// Ensure the environment variable is properly set
const mongoURI = process.env.DATABASE;

// Connect to MongoDB using the URI
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log("MongoDB connected successfully");
})
.catch((err) => {
  console.error("Error connecting to MongoDB:", err);
});
