const express = require("express");
const cors = require("cors");
const fs = require("fs");

const app = express();
app.use(cors());
app.use(express.json());

let queue = [];

/* ===== Root (اختبار) ===== */
app.get("/", (req, res) => {
  res.json({ status: "API ONLINE" });
});

/* ===== Login ===== */
app.post("/api/login", (req, res) => {
  const { username, password } = req.body;

  const data = JSON.parse(fs.readFileSync("staff.json", "utf8"));

  const user = data.staff.find(
    s => s.username.toLowerCase() === username.toLowerCase()
  );

  if (!user || user.password !== password) {
    return res.status(401).json({ error: "Invalid login" });
  }

  res.json({
    user: {
      username: user.username,
      rank: user.rank
    }
  });
});

/* ===== Actions ===== */
app.post("/api/action/:type", (req, res) => {
  queue.push({
    type: req.params.type.toUpperCase(),
    ...req.body,
    time: Date.now()
  });

  res.json({ success: true });
});

/* ===== Roblox ===== */
app.get("/api/roblox/queue", (req, res) => {
  res.json(queue);
  queue = [];
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("API Online on port", PORT);
});
