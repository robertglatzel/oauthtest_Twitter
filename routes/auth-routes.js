const router = require('express').Router();
const passport = require('passport');

//auth login
router.get('/login', (req, res) => {
	res.render('login');
});

// auth logout
router.get('/logout', (req, res) => {
	// handle with passport.
	req.logout();
	res.redirect('/');
});

//auth with twitter
router.get('/twitter', passport.authenticate('twitter'));

//callback route for twitter to redirect to.
// When auth works, we hit this route. It hits passport.authenticate first, which is the callback function
//defined in the straregy. Then once that's completed, it fires the req, res callback in here.
// req now contains the user object that's logged in
router.get('/twitter/redirect', passport.authenticate('twitter'), (req, res) => {
	//res.send(req.user);
	res.render('after');
});

module.exports = router;
