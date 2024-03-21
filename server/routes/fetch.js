const express = require("express");
const router = express.Router();
const axios = require("axios");

router.get("/:taskId", async function (req, res, next) {
  const taskId = req.params.taskId;
  try {
    const response = await axios.get(`http://localhost:8000/search/${taskId}`);
    res.json(response.data);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "Failed to fetch data" });
  }
});

module.exports = router;
