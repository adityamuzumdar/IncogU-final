const express = require('express');
const router = express.Router();

// Example route
router.get('/', (req, res) => {
  res.send('Answers route working');
});

module.exports = router;