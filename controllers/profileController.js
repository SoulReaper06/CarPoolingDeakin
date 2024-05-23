const User = require('../models/User');

const profile = async (req, res) => {
  res.set('Cache-Control', 'no-store');

  try {
    if (!req.session.userId) {
      return res.redirect('/');
    }

    const user = await User.findById(req.session.userId);
    if (!user) {
      return res.status(404).send('User not found');
    }

    res.render('profile', { user });
  } catch (error) {
    console.error('Error finding user:', error);
    res.status(500).send('Error finding user');
  }
};

const updateUser = async (req, res) => {
  const { fullName, email, mobile } = req.body;

  // Update the user in MongoDB
  User.updateOne({ _id: req.session.userId}, {
      name: fullName,
      email: email,
      mobileNum: mobile,
  }, {new: true})
  .then(user => {
    req.session.passport.user = user; // Update session data
    res.redirect('/profile');
})// Redirect back to the profile page after updating
  .catch(error => {
      console.error(error);
      res.status(500).send('An error occurred while updating the profile.');
  });
};

module.exports = {
  profile,
  updateUser,
};
