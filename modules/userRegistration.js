require('dotenv').config()
const bcrypt = require('bcrypt');

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
	const getUserCount = await executeQuery1("SELECT COUNT(*) AS uservalidation FROM users WHERE email = '" + content.email + "'")
	if (getUserCount[0].uservalidation === 0) {
		const hashedPassword = await bcrypt.hash(content.password, 10);
		let postdata = await executeQuery1("INSERT INTO users (access, firstname, lastname, email, password) VALUES ('" + content.access + "', '" + content.firstname + "', '" + content.lastname + "', '" + content.email + "', '" + hashedPassword + "')")
		return postdata
	} else {
		return "Error: User already exists"
	}
}