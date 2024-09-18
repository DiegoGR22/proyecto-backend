export const isAuth = (req, res, next) => {
    if (!req.user) {
        console.log('User not logged in, redirecting to login ...');
        return res.redirect('/login'); // Redirige a la página de login si el usuario no está autenticado
    }
    console.log("User already logged in");
    next();
}

export const isNotAuth = (req, res, next) => {
    if (req.user) {
        console.log('User already logged in, redirecting to home ...');
        return res.redirect('/'); // Redirige a la página de home si el usuario ya está autenticado
    }
    console.log("User not logged in");
    next();
}

export const isAdmin = (req, res, next) => {
    if(req.user.role !== 'admin'){
        console.log("You are not allowed to access this")

        return res.redirect('/error?message=ERROR 401: You are not allowed to access this');
    }
    console.log("User allowed")
    next();
}