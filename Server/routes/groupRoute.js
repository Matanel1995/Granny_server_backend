const express = require('express');
const router = express.Router();

// Define your route handlers for the group routes
router.get('/', (req, res) => {
  res.send("working");
    // Your code here
});

// Export the router instance
module.exports = router;
