const User = require("../models/user");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
dotenv.config();

exports.createUser = async (req, res) => {
  try {
    const { name, services, termsAndCondition } = req.body;
    console.log(termsAndCondition);
    const user = new User({ name, services, termsAndCondition }); // Use services array
    await user.save();
    const token = jwt.sign(
      { userId: user._id, username: user.name, services: user.services },
      process.env.JWT_SECRET
    );
    console.log(process.env.JWT_SECRET);
    const exp = Date.now() + 1000 * 60 * 60 * 24 * 30;
    console.log(token);

    // Send the token as a JSON response to the client
    res.status(201).json({ user, token });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { name, services, termsAndCondition } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { name, services, termsAndCondition },
      { new: true }
    );
    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};
exports.getUser = async (req, res) => {
  try {
    // Retrieve the user by user ID from the request parameters
    const userId = req.params.id;

    // Use Mongoose to find the user by ID
    const user = await User.findById(userId);

    // Check if the user exists
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
