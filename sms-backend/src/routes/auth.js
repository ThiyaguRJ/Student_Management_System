const router = require("express").Router();
const { User } = require("../models");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role, name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: "8h" }
    );

    const { passwordHash, ...userData } = user.toJSON();

    res.json({
      token,
      user: userData,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/register", async (req, res) => {
  const { name, email, password, role } = req.body;
  if (!name || !email || !password || !role) {
    return res.status(400).json({ message: "All fields are required" });
  }
  const existing = await User.findOne({ where: { email } });
  if (existing)
    return res.status(400).json({ message: "Email already exists" });

  const bcrypt = require("bcryptjs");
  const hash = await bcrypt.hash(password, 10);

  const user = await User.create({ name, email, passwordHash: hash, role });
  res
    .status(201)
    .json({
      message: "User registered",
      user: { id: user.id, email: user.email, role: user.role },
    });
});

module.exports = router;
