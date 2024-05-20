const Ride = require('../models/Ride');

exports.getAllRides = async (req, res) => {
    try {
        const rides = await Ride.find();
        res.json(rides);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.createRide = async (req, res) => {
    const ride = new Ride({
        date: req.body.date,
        time: req.body.time,
        destination: req.body.destination,
        startingLocation: req.body.startingLocation,
        cost: req.body.cost,
        seats: req.body.seats,
        user: req.body.user 
    });

    try {
        const newRide = await ride.save();
        res.status(201).json(newRide);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};
