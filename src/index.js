 const express=require('express');
 const morgan = require('morgan');
const  exphbs = require('express-handlebars');
const path = require('path');
const flash = require('connect-flash');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const passport= require('passport');

const { database } = require('./key');

// iniciando express
 const app =  express();
 require('./lib/passport'); // iniciamos la autenticacion para que la app se entere de la autenticacion


//  setting
app.set('port', process.env.PORT || 4000);

app.set('views', path.join(__dirname, 'views'));
app.engine('.hbs', exphbs({
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'), 'layouts'),
    partialsDir:path.join(app.get('views'), 'partials'),
    extname: '.hbs',
    helpers: require('./lib/handlebars')
}));
app.set('view engine', '.hbs');

// midelwares 
app.use(flash());

app.use(session({
    secret: 'faztmysqlnodemysql',
    resave: false,
    saveUninitialized: false,
    store: new MySQLStore(database)
  }));
  
app.use(morgan('dev'));
app.use(express.urlencoded({extended: false}));
app.use(express.json());

app.use(passport.initialize());
app.use(passport.session());





// global variables
app.use((req, res, next) => {
    app.locals.message = req.flash('message');
    app.locals.success = req.flash('success');
    app.locals.user = req.user;
    next();
    
})

// routes
app.use(require('./rutes/index'));
app.use(require('./rutes/autenticacion'));
app.use('/links' ,require('./rutes/links'));

// public
app.use(express.static(path.join(__dirname, 'public')));

// start server
app.listen(app.get('port'), () =>{
    console.log('server run on port', app.get('port'));
})