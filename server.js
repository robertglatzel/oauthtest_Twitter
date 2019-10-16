const express = require('express');
const cors = require('cors');
const passportSetup = require('./config/passport-setup');
const session = require('express-session');
const authRoutes = require('./routes/auth-routes');
const profileRoutes = require('./routes/profile-routes');
const passport = require('passport');
const app = express();
const mongoose = require('mongoose');
const keys = require('./config/keys');
const cookieSession = require('cookie-session');
const path = require('path');
// const Twit = 'twit';
//connect to mongodb

// Set up view engine
app.set('view engine', 'ejs');
mongoose.connect(keys.db.dbURI, () => console.log('Mongodb connected'));
//app.use(session({ secret: 'whatever', resave: true, saveUninitialized: true }));

//encrypt session key
app.use(
	cookieSession({
		maxAge: 24 * 60 * 60 * 1000,
		keys: [
			keys.session.cookieKey
		]
	})
);

//init passport
app.use(passport.initialize());
app.use(passport.session());

app.use(cors());
app.options('*', cors());
// setup routes
app.use('/auth', authRoutes);
app.use('/profile', profileRoutes);
app.use(express.static(path.join(__dirname, 'public')));

//create home route.
app.get('/', (req, res) => {
	// renders the home template in views.
	res.render('home');
});

const PORT = 5000;

app.listen(PORT, () => console.log('server running'));
