require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')
const logger = require('morgan');
const jwt = require('jsonwebtoken');

const userRegistration = require('./modules/userRegistration')
const userLogin = require('./modules/userLogin')
const chefAvailability = require('./modules/chefAvailability')
const chefBooking = require('./modules/chefBooking')
const listCustomerBookings = require('./modules/listCustomerBookings')
const listChefBookings = require('./modules/listChefBookings')
const userDetails = require('./modules/userDetails')
const confirmBooking = require('./modules/confirmBooking')
const slotAvailable = require('./modules/slotAvailable')
const availableSlots = require('./modules/availableSlots')
const profileUpdate = require('./modules/profileUpdate')

app.use(logger('dev'))
app.use(cors())
app.use(express.json())

function authenticateToken(req, res, next) {
	const authHeader = req.headers['authorization'];
	const token = authHeader && authHeader.split(' ')[1];

	if (token == null) return res.sendStatus(401);

	jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
		if (err) return res.sendStatus(403);
		req.user = user;
		next();
	});
}

app.get('/api/token/', (req, res) => {
	const token = jwt.sign({ name: "Rajat" }, process.env.JWT_SECRET);
	res.json({ token });
});

app.listen(process.env.API_PORT_LOCAL, function () {
	console.log("Listening on port " + process.env.API_PORT_LOCAL + " on " + process.env.API_HOST_LOCAL + "\n")
});

app.post('/api/registration/', authenticateToken, async (req, res) => {
	const result = await userRegistration.init(req.body, req.process)
	res.json(result)
})

app.post('/api/login/', authenticateToken, async (req, res) => {
	const result = await userLogin.init(req.body, req.process)
	res.json(result)
})

app.post('/api/userdetails/', authenticateToken, async (req, res) => {
	const result = await userDetails.init(req.body, req.process)
	res.json(result)
})

app.post('/api/chefavailability/', authenticateToken, async (req, res) => {
	const result = await chefAvailability.init(req.body, req.process)
	res.json(result)
})

app.post('/api/chefbooking/', authenticateToken, async (req, res) => {
	const result = await chefBooking.init(req.body, req.process)
	res.json(result)
})

app.post('/api/customer/listbookings/', authenticateToken, async (req, res) => {
	const result = await listCustomerBookings.init(req.body, req.process)
	res.json(result)
})

app.post('/api/chef/listbookings/', authenticateToken, async (req, res) => {
	const result = await listChefBookings.init(req.body, req.process)
	res.json(result)
})

app.post('/api/chef/confirmbooking/', authenticateToken, async (req, res) => {
	const result = await confirmBooking.init(req.body, req.process)
	res.json(result)
})

app.post('/api/chef/slotavailable/', authenticateToken, async (req, res) => {
	const result = await slotAvailable.init(req.body, req.process)
	res.json(result)
})

app.post('/api/chef/availableslots/', authenticateToken, async (req, res) => {
	const result = await availableSlots.init(req.body, req.process)
	res.json(result)
})

app.post('/api/chef/profileupdate/', authenticateToken, async (req, res) => {
	const result = await profileUpdate.init(req.body, req.process)
	res.json(result)
})