require("dotenv").config();
const express = require('express');
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const path = require('path');
const app = express();

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


mongoose.connect(process.env.MONGO_URI, {
    serverSelectionTimeoutMS: 10000, // 10 seconds timeout
})
    .then(() => console.log("MongoDB connected successfully"))
    .catch(err => console.error("MongoDB connection error:", err));


const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true }
});
    
const User = mongoose.model("User", UserSchema);
    
// Signup Route
app.post("/signup", async (req, res) => {
    try {
        let { username, email, password } = req.body;
    
        // Validate input fields
        if (!username || !email || !password) {
            return res.status(400).json({ msg: "All fields are required" });
        }
        email = email.toLowerCase();
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ msg: "User already exists" });
        }
        // Hash password before saving
        const hashedPassword = await bcrypt.hash(password, 10);
        // Create and save new user
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


const cartSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    items: [
        {
            productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
            title: String,
            price: Number,
            image: String,
            quantity: { type: Number, default: 1 }
        }
    ]
});

module.exports = mongoose.model("Cart", cartSchema);

