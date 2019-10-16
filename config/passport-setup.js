const passport = require('passport');
const TwitterStrategy = require('passport-twitter').Strategy;
const keys = require('./keys.js');
const User = require('../models/user-model');
const Twit = require('twit');

//Get the user's id from the database for serializing.
// Null is the error.
passport.serializeUser((user, done) => {
	done(null, user.twitterId);
});

passport.deserializeUser((id, done) => {
	// get the user based on the id that's been returned
	User.findOne({ twitterId: id }).then((user) => {
		done(null, user);
	});
});

passport.use(
	new TwitterStrategy(
		{
			consumerKey: keys.twitter.consumer,
			consumerSecret: keys.twitter.consumerSecret,
			callbackURL: '/auth/twitter/redirect'
		},
		// create new user using user schema. Save it to the db. Save takes time, so tack on the then
		//to run after the save function runs.

		function(token, tokenSecret, profile, done) {
			console.log(`Tokens: ${token}, ${tokenSecret}`);
			console.log(`Id: ${profile.id} --- Username: ${profile.username}`);

			// check if user already exists in db. If not, create a new one.
			User.findOne({ twitterId: profile.id }).then((existingUser) => {
				if (existingUser) {
					// already have a user
					console.log(`user is: ${existingUser}`);
					done(null, existingUser);
				} else {
					// if not, create new user.
					let user = new User({
						username: profile.username,
						twitterId: profile.id,
						token: token,
						secret: tokenSecret
					});
					user.save().then((newUser) => {
						console.log(`New user created: ${newUser}`);
						done(null, newUser);
					});
				}
			});
		}
	)
);
