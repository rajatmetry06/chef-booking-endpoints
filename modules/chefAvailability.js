require('dotenv').config()

var pool = require('./dbConnection');

const executeQuery1 = async (query) => {
	return new Promise((resolve, reject) => {
		pool.getConnection(function (error, connection) {
			if (error) {
				console.log("\n" + error + " | " + pool.config.connectionConfig.host)
			} else {
				connection.changeUser({
					database: process.env.CHEF_DB_NAME_LOCAL1
				});
				connection.query(query, (error, elements) => {
					if (error) {
						connection.release();
						console.log(query)
						console.log("\n" + error)
					} else {
						connection.release();
						return resolve(elements)
					}
				})
			}
		})
	})
}

const processBookingData = (rawData) => {
	const dateArray = []
	const customerIdArray = []
	rawData.forEach(row => {
		dateArray.push(row.date)
		customerIdArray.push(row.chefid)
	});
	const data = {
		"date": dateArray,
		"customerId": customerIdArray
	}
	return data
}

exports.init = async (content) => {
	const processedUserDetails = []
	const getUserDetails = await executeQuery1("SELECT users.id, users.firstname, users.lastname, users.email, users.address, users.contact, users.speciality, users.occations, users.ratings, users.price, chefavailability.start, chefavailability.end FROM users JOIN chefavailability WHERE users.id = chefavailability.chefid AND chefavailability.start <= '" + content.date + "' AND chefavailability.end >= CURDATE() GROUP BY email;")
	const getBookingDetails = await executeQuery1("SELECT * FROM bookings WHERE date = '" + content.date + "'")
	const processedBookingData = await processBookingData(getBookingDetails)
	for (let x = 0; x < getUserDetails.length; x++) {
		const row = getUserDetails[x];
		let index = processedBookingData.customerId.indexOf(row.id)
		if (index < 0) {
			processedUserDetails.push(row)
		}
	}
	return processedUserDetails
}