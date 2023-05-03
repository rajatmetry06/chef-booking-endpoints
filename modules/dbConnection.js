var mysql = require('mysql2');
require('dotenv').config()


var pool = mysql.createPool({
	connectionLimit: 10,
	multipleStatements: true,
	dateStrings: true,
	host: process.env.CHEF_DB_HOST_LOCAL,
	user: process.env.CHEF_DB_USER_LOCAL,
	password: process.env.CHEF_DB_PASS_LOCAL
});

module.exports = pool;