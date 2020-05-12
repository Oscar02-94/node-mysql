module.exports = {
    isLogeedIn(req, res, next) {
        if(req.isAuthenticated() ) {
            return next();
        }
        return res.redirect('/signup');
    },

    // este codigo hece el proceso inverso de islogeedIn con este codigo el usuario no podra ver las vistas como el login o registro
    isNotLoggetIn(req, res, next) {
        if(!req.isAuthenticated() ) {
            return next();
        }
        return res.redirect('/profile');
    }
}


// este codigo nos dice que si el usuario esta logeado que contune con las rutas 
// y si no esta logueado que nos redireccione al registro(signup)