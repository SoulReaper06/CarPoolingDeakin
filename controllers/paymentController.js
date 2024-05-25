const stripe = require('stripe')('sk_test_51PKD3800B0ReYQq43m2yd1qZsvKgVyKphp6hRY9aDqazFJeKqLx6oYw2VEhQuotDfx3Om18Bfq0aoumWNlsj6Sjm00RwI3atHk');
const Ride = require('../models/Ride');

const confirmPayment = async (req, res) => {
    const { rideId, userId, amount } = req.body;
    
    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [{
                price_data: {
                    currency: 'aud',
                    product_data: {
                        name: 'Car Pool Ride',
                    },
                    unit_amount: amount,
                },
                quantity: 1,
            }],
            mode: 'payment',
            success_url: `${req.headers.origin}/payment-success?session_id={CHECKOUT_SESSION_ID}&rideId=${rideId}&userId=${userId}`,
            cancel_url: `${req.headers.origin}/cancel.html`,
        });

        res.json({ id: session.id });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

const successPayment = async (req, res) => {
    const { session_id, rideId, userId } = req.query;

    try {
        // Fetch the session to ensure the payment was successful
        const session = await stripe.checkout.sessions.retrieve(session_id);
        
        if (session.payment_status === 'paid') {
            // Find the ride and update it
            const ride = await Ride.findById(rideId);
            if (!ride) {
                return res.status(404).send('Ride not found');
            }

            // Decrement the number of available seats
            ride.seats -= 1;
            // Add the user to the list of passengers
            ride.passengers.push({ userId: userId, name: session.customer_details.name });

            // Save the updated ride
            await ride.save();

            // Redirect to a success page or send a success response
            res.redirect('/profile'); // Adjust this path as needed
        } else {
            res.status(400).send('Payment not successful');
        }
    } catch (error) {
        console.error('Error handling payment success:', error);
        res.status(500).send('Server error');
    }
};

module.exports = {
    confirmPayment,
    successPayment
};
