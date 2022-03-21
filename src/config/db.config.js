const mongoose = require('mongoose')

mongoose.connect(process.env.MONGODB_URI, {
	dbName: process.env.MONGODB_NAME,
	user: process.env.MONGODB_USER,
	pass: process.env.MONGODB_PASS,
	useNewUrlParser: true,
})
.then(() => {
	console.log('Mongodb connected.')
})
.catch((err) => console.log(err.message))
