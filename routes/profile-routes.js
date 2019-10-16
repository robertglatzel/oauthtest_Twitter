const router = require('express').Router();
const Twit = require('twit');
const keys = require('../config/keys');

//check if user is logged in
const authCheck = (req, res, next) => {
	if (!req.user) {
		// executes if user is not logged in.
		res.redirect('/auth/login');
	} else {
		// means go onto the next piece of middleware.
		next();
	}
};

router.get('/', authCheck, (req, res) => {
	console.log(req.user);
	function postTweet() {
		var T = new Twit({
			consumer_key: keys.twitter.consumer,
			consumer_secret: keys.twitter.consumerSecret,
			access_token: req.user.token,
			access_token_secret: req.user.secret,
			timeout_ms: 60 * 1000, // optional HTTP request timeout to apply to all requests.
			strictSSL: true // optional - requires SSL certificates to be valid.
		});
		T.post('statuses/update', { status: 'hello world this is a test!' }, function(err, data, response) {
			console.log(data);
			return data;
		});
	}

	let data = postTweet();
	console.log('data', data);
	res.render('profile', { user: req.user });
});

module.exports = router;
