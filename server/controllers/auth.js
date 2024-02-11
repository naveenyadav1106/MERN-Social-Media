import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.js'

// Register user
export const register = async (req, res) => {
    try {
        // Destructure request body to extract user data
        const { firstName, lastName, email, password, picturePath, friends, location, occupation } = req.body;

        // Generate a salt for password hashing
        const salt = await bcrypt.genSalt();

        // Hash the password using bcrypt
        const passwordHash = await bcrypt.hash(password, salt);

        // Create a new user instance with provided data
        const newUser = new User({
            firstName,
            lastName,
            email,
            password: passwordHash,
            picturePath,
            friends,
            location,
            occupation,
            viewedProfile: Math.floor(Math.random() * 10000), // Generate random viewed profile count
            impressions: Math.floor(Math.random() * 10000)    // Generate random impression count
        });

        // Save the new user to the database
        const savedUser = await newUser.save();

        // Respond with the saved user data and status code 201 (Created)
        res.status(201).json(savedUser);
    } catch (error) {
        // If an error occurs during registration, respond with an error message and status code 500 (Internal Server Error)
        res.status(500).json({ error: error.message });
    }
};

// LOGINING IN
export const login = async (req, res) => {
    try {
        // Extract email and password from request body
        const { email, password } = req.body;

        // Find user by email in the database
        const user = await User.findOne({ email: email });

        // If user does not exist, return error message
        if (!user) {
            return res.status(400).json({ msg: "User does not exist" });
        }

        // Compare provided password with hashed password stored in the database
        const isMatch = await bcrypt.compare(password, user.password);

        // If passwords do not match, return error message
        if (!isMatch) {
            return res.status(400).json({ msg: "Invalid credentials" });
        }

        // Generate JWT token with user ID
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);

        // Remove password field from user object to avoid exposing sensitive information
        delete user.password;

        // Respond with JWT token and user data
        res.status(200).json({ token, user });
    } catch (error) {
        // If an error occurs, respond with error message
        res.status(500).json({ error: error.message });
    }
};

