const express = require("express");
const fs = require("fs");

const app = express();
app.use(express.json());

const FILE = "./ranks.json";

function load() {
  if (!fs.existsSync(FILE)) return {};
  return JSON.parse(fs.readFileSync(FILE));
}

function save(data) {
  fs.writeFileSync(FILE, JSON.stringify(data, null, 2));
}

app.post("/api/promote", (req, res) => {
  const { username, rank } = req.body;

  if (!username || !rank) {
    return res.status(400).json({ error: "missing data" });
  }

  const data = load();
  data[username.toLowerCase()] = rank;
  save(data);

  res.json({ success: true });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("API running on port", PORT);
});
