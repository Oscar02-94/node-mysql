// crear autenticacion
const passport = require('passport') ;

const LocalStrategy = require('passport-local').Strategy;

const pool = require('../database');

const helpers = require('../lib/helpers');




passport.use('local.login', new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
}, async(req, username, password, done) => {
//  consultando ala bade de datos diceindole que traiga todos los usuarios que conicidan con este user name
console.log(req.body);
 const rows = await pool.query('SELECT * FROM users WHERE username = ?', [username]);
 if(rows.length > 0) {
     const users  = rows[0];
  const validarPaswoord =  await helpers.matchPassword(password, users.password);
  if(validarPaswoord){
      done(null, users, req.flash('success','Bienvenido' + users.username))
  } else{
      done(null, false, req.flash('message', 'Contraseña incorrecta'));
  }
 }else {
     done(null, false, req.flash('message','El nombre de Usuario no existe'));
 }
    
}));


passport.use('local.signup', new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
}, async (req, username, password, done) => {
    const { fullname } = req.body; // como el fullname no lo pusimos como parametro lo podemos requerir del req.body ya que le pasamos la opcion  passReqToCallback: true para que pueda requerir desde el req.body
    // console.log(req.body);
    const  newUser = {
        username,
        password,
        fullname
    };

    newUser.password = await helpers.encryptPassword(password);
    const result = await pool.query('INSERT INTO users SET ?', newUser);
    // console.log(result);
    newUser.id = result.insertId;
    return done(null, newUser);
}));
// guardando una sesion con id == al serializarlo guardamos el id
passport.serializeUser((user, done) => {
    done(null, user.id);
});
// al momento de deserializar estmos tomando el id para optener los datos
passport.deserializeUser( async( id, done) => {
const rows = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
done(null, rows[0]);
});




