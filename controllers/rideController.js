const Ride = require('../models/Ride');

const getAllRides = async (req, res) => {
  try {
      const userId = req.session.userId;
      if (!userId) {
        return res.redirect('/signin');
      }

      const rides = await Ride.find({}).populate('userId');
      res.render('profile', { user: req.session.user, rides: rides });
    } catch (error) {
      console.error('Error fetching rides:', error);
      res.status(500).send('An error occurred. Please try again later.');
    }
};

const createRide = async (req, res) => {
    const newRide = new Ride({
        date: req.body.date,
        time: req.body.time,
        destination: req.body.destination,
        startingLocation: req.body.startingLocation,
        cost: req.body.cost,
        seats: req.body.seats,
        userId: req.session.userId  
    });

    try {
        await newRide.save();
        res.redirect("/profile");
    } catch (err) {
        res.redirect("/profile");
    }
};

const bookRide = async (req, res) => {
  try {
      const userId = req.session.userId;
      const rideId = req.params.rideId;
      const ride = await Ride.findById(rideId).populate('userId'); // Assuming 'userId' references the driver
      if (!ride) {
          return res.status(404).send('Ride not found');
      }
      res.render('confirm-booking', {  user: req.session.user, ride : ride  });
  } catch (error) {
      res.status(500).send('Server error');
  }
};

const deleteRide = async (req, res) => {
  try {
      const rideId = req.params.id;
      const userId = req.session.userId;

      // Find the ride to ensure it belongs to the authenticated user
      const ride = await Ride.findOne({ _id: rideId, userId: userId });
      if (!ride) {
          return res.status(404).send('Ride not found or you do not have permission to delete this ride');
      }

      await Ride.deleteOne({ _id: rideId });
      res.redirect('/profile'); // Redirect to profile after deletion
  } catch (error) {
      console.error('Error deleting ride:', error);
      res.status(500).send('An error occurred. Please try again later.');
  }
};

module.exports = {
  getAllRides,
  createRide,
  bookRide,
  deleteRide,
};
