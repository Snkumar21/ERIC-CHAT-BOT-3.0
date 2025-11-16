const express = require("express");
const router = express.Router();
const { searchDataset, addDataset } = require("../controllers/datasetController");

// Search dataset
router.post("/search", searchDataset);

// Add new Q/A (teaching mode)
router.post("/add", addDataset);

module.exports = router;