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

exports.init = async (content) => {
	let status = content.status.split("~")[0]
	let id = content.status.split("~")[1]
	let bookingData = await executeQuery1("UPDATE bookings SET status = '" + status + "' WHERE id = '" + id + "'")
	return bookingData
}