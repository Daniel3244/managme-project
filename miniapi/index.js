const express = require("express");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const app = express();
app.use(cors());
app.use(express.json());

const users = [
  { id: 1, login: "user1", password: "pass1", firstName: "Jan", lastName: "Kowalski", email: "jan@example.com" }
];

const JWT_SECRET = "JWTkey";

app.post("/api/login", (req, res) => {
  const { login, password } = req.body;
  const user = users.find(u => u.login === login && u.password === password);
  if (!user) return res.status(401).json({ message: "Nieprawidłowy login lub hasło" });

  const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: "15m" });
  const refreshToken = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: "7d" });

  res.json({
    token,
    refreshToken
  });
});

app.post("/api/refresh-token", (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) return res.status(400).json({ message: "Brak refreshToken" });

  try {
    const payload = jwt.verify(refreshToken, JWT_SECRET);
    const user = users.find(u => u.id === payload.id);
    if (!user) return res.status(404).json({ message: "Nie znaleziono użytkownika" });

    const newToken = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: "15m" });
    res.json({ token: newToken });
  } catch {
    res.status(401).json({ message: "Nieprawidłowy refreshToken" });
  }
});

app.get("/api/me", (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: "Brak tokena" });

  const token = authHeader.split(" ")[1];
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    const user = users.find(u => u.id === payload.id);
    if (!user) return res.status(404).json({ message: "Nie znaleziono użytkownika" });

    const { password, ...userData } = user;
    res.json(userData);
  } catch {
    res.status(401).json({ message: "Nieprawidłowy token" });
  }
});

app.listen(4000, () => console.log("API działa na porcie 4000"));
