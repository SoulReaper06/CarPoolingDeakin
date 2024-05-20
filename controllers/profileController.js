const User = require('../models/User');

const profile = async (req, res) => {
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

module.exports = {
  profile,
};
