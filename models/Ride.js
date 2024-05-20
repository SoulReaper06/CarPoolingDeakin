const mongoose = require('mongoose');

const rideSchema = new mongoose.Schema({
    date: {
        type: Date,
        required: true
    },
    time: {
        type: String,
        required: true
    },
    destination: {
        type: String,
        required: true
    },
    startingLocation: {
        type: String,
        required: true
    },
    cost: {
        type: Number,
        required: true
    },
    seats: {
        type: Number,
        required: true
    },
    user: {
        type: String,
        required: true
    }
});

const Ride = mongoose.model('Rides', rideSchema);

module.exports = Ride;
