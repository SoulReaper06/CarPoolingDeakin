const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');

const app = express();

const mongoURI = "mongodb+srv://jonatjmathew08:zffmrBVwaGL0LnFS@deakin.mocsaum.mongodb.net/?retryWrites=true&w=majority&appName=deakin"

// Connect to MongoDB
async function connectDb() {
    try {
      await mongoose.connect(mongoURI);
      console.log("You successfully connected to MongoDB!");
    } catch (error) {
      console.error("MongoDB connection error:", error);
    }
  }
  connectDb().catch(console.dir);

// Define User Schema
const User = mongoose.model('User', {
  name: String,
  email: String,
  passwordUser: String,
});

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(session({
  secret: 'your_secret_key',
  resave: false,
  saveUninitialized: true,
}));

// Set the view engine to ejs
app.set('view engine', 'ejs');
// Serve static files from the 'public' directory
app.use(express.static('public'));

// Routes
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});


// Handle sign-up form submission
app.post('/signup', async (req, res) => {
  const { email, passUser } = req.body;

  try {
      // Check if the user already exists in the database
      const existingUser = await User.findOne({ email });
      if (existingUser) {
          return res.status(400).send('User already exists');
      }

      // Hash the password before saving it to the database
      const hashedPassword = await bcrypt.hash(passUser, 10);

      // Create a new user with the hashed password
      const newUser = new User({ email, passwordUser: hashedPassword });
      await newUser.save();

      res.send('Sign-up successful!');
  } catch (err) {
      console.error('Error signing up:', err);
      res.status(500).send('An error occurred. Please try again later.');
  }
})
  
  // Handle sign-in form submission
app.post('/signin', async (req, res) => {
  const { email, pass } = req.body;

  try {
      // Find the user by email
      const user = await User.findOne({ email });

      // If user not found or password doesn't match, display error
      if (!user || user.pass !== pass) {
          return res.status(401).send('Invalid email or password');
      }

      // If email and password are correct, sign in successfully
      res.send('Sign-in successful!');
  } catch (err) {
      console.error('Error signing in:', err);
      res.status(500).send('An error occurred. Please try again later.');
  }
});

  app.get('/profile', async (req, res) => {
    try {
      if (!req.session.userId) {
        res.redirect('/');
      } else {
        const user = await User.findById(req.session.userId);
        if (!user) {
          res.status(404).send('User not found');
        } else {
          res.send(`Welcome, ${user.name}!`);
        }
      }
    } catch (error) {
      console.error('Error finding user:', error);
      res.status(500).send('Error finding user');
    }
  });
  

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
