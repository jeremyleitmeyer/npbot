if (process.env.NODE_ENV === 'production') {
	// prod
	module.exports = require('./auth');
}