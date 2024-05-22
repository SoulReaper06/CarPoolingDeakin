const bcrypt = require("bcrypt");
const User = require("../models/User");
const Ride = require("../models/Ride");

const signup = async (req, res) => {
  const { name, email, number, passUser } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).send("User already exists");
    }

    const hashedPassword = await bcrypt.hash(passUser, 10);
    const newUser = new User({ name , email, mobileNum : number, password: hashedPassword });
    await newUser.save();

    res.send("Sign-up successful!");
  } catch (err) {
    console.error("Error signing up:", err);
    res.status(500).send("An error occurred. Please try again later.");
  }
};

const signin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).send("Invalid email or password");
    }

    req.session.userId = user._id;
    req.session.user = user; // Store user in session

    // Redirect to profile page where getAllRides will handle fetching rides
    res.redirect("/profile");
  } catch (err) {
    console.error("Error signing in:", err);
    res.status(500).send("An error occurred. Please try again later.");
  }
};

module.exports = {
  signup,
  signin,
};
