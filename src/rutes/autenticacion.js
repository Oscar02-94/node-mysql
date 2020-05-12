// agrgando la autenticacion de los usuario en el registro y el login

const express = require('express');
const ruter = express.Router();
const passport = require('passport');
const {isLogeedIn, isNotLoggetIn} = require('../lib/proteccionRutas');  // con esto protegeremos las vistas por ejemplo el perfil


// esta ruta es para renderizar el formulario
ruter.get('/signup',isNotLoggetIn, (req, res) => {
    res.render('auth/registro')
});


ruter.post('/signup', passport.authenticate('local.signup', {
    successRedirect: '/profile',
    failureRedirect: '/signup',
    failureFlash: true
  }));


// renderizando el formulario de login
  ruter.get('/login', isNotLoggetIn,(req, res) => {
      res.render('auth/login')
  });


  ruter.post('/login',isNotLoggetIn,(req, res, next) => {
    passport.authenticate('local.login', {
        successRedirect: '/profile',
        failureRedirect:'/login',
        failureFlash: true
    })(req, res, next);
  });


// renderizando la vista de perfil como no esta dentro de una carpeta lo pasamos sin prefijos ni nada
ruter.get('/profile', isLogeedIn, (req, res) => {
    res.render('perfil')
});

// cerrando la cesion del usuario con el metodo que nos da passpor que es el logout() lo podemos llamar directo
ruter.get('/cerrarSesion', (req, res) => {
    req.logOut();
    res.redirect('/login');

})





module.exports = ruter