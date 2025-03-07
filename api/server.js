require("dotenv").config();
const express = require('express');
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const path = require('path');
const app = express();
const serverless = require("serverless-http");
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname,'public')));
app.use(express.json());
app.use(cors());
app.get('/', (req, res)=>{
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

require("dotenv").config();
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
    throw new Error("Missing JWT_SECRET in environment variables");
}


mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("✅ MongoDB connected successfully"))
    .catch(err => console.error("❌ MongoDB connection error:", err));

const UserSchema = new mongoose.Schema({
    username: String,
    email: { type: String, unique: true },
    password: String
});

const User = mongoose.model("User", UserSchema);

// Signup Route
app.post("/signup", async (req, res) => {
    try {
        const { username, email, password } = req.body;

        if (!password) {
            return res.status(400).json({ error: "Password is required" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({ username, email, password: hashedPassword });
        await newUser.save();

        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Login Route
app.post("/login", async (req, res) => {
    const {email, password} = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "User not found"});

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({msg: "Invalid credentials"});

    const token = jwt.sign({id: user.id}, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.json({ token, user: { id: user._id, username: user.username, email: user.email } });
});

app.listen(PORT, ()=>{
    console.log(`Server running at http://localhost:${PORT}`);
});

app.get("/api/message", (req, res) => {
    res.json({ message: "Hello from Vercel backend!" });
});

module.exports = app;
module.exports.handler = serverless(app);


