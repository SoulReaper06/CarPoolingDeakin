const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const profileController = require('../controllers/profileController');
const rideController = require('../controllers/rideController');


// Handle sign-up form submission
router.post('/signup', authController.signup);

// Handle sign-in form submission
router.post('/signin', authController.signin);

router.get('/profile', rideController.getAllRides);

router.post('/publish-ride', rideController.createRide);

router.post('/delete-ride/:id', rideController.deleteRide);

router.get('/edit-profile', (req, res) => {
  res.render('userprofile', { user: req.session.user }); // Assuming you pass user data to profile
});

router.post('/update-profile', profileController.updateUser);

// Handle logout
router.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).send('Error logging out');
    }
    res.redirect('/');
  });
});

module.exports = router;
