const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const rideSchema = new Schema({
    date: String,
    time: String,
    destination: String,
    startingLocation: String,
    cost: Number,
    seats: Number,
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    passengers: [{ userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, name: String }]
});

const Ride = mongoose.model('Rides', rideSchema);

module.exports = Ride;
