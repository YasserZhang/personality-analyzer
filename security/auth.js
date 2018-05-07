let Auth = {}

Auth.isLoggedIn = (req, res, next) => {
    console.log('Checking if isLoggedIn...');
    if (req.isAuthenticated()) {
        console.log('User is logged in');
        return next()
    } else {
        console.log('User NOT logged in');
        res.redirect('/login')
    }
}

Auth.isAdmin = (req, res, next) => {
    if (req.isAuthenticated()) {

        if (req.user.is_admin) {
            return next()
        } else {
            res.status(403).send('Access denied.')
        }

    } else {
        res.redirect('/login')
    }
}

Auth.isPublic = (req, res, next) => {
    if (!req.isAuthenticated()) {
        return next()
    } else {
        res.redirect('/profile')
    }
}

module.exports = Auth
