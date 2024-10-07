const express = require("express");
const axios = require("axios");
const path = require("path");
const app = express();
const PORT = process.env.PORT || 8080;
const bodyParser = require("body-parser");

const API_KEY = process.env.GOOGLE_API_KEY;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/api/lounges", async (req, res) => {
  const airportName = req.query.airport;

  if (!airportName) {
    return res.status(400).json({ error: "Airport name is required" });
  }

  try {
    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(
        airportName
      )}+Lounges&key=${API_KEY}`
    );

    if (response.data.status !== "OK") {
      return res
        .status(500)
        .json({
          error: response.data.error_message || "Error fetching data from API",
        });
    }

    res.json(response.data);
  } catch (error) {
    console.error("Error fetching lounge data:", error.message);
    res.status(500).json({ error: "Error fetching lounge data" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
