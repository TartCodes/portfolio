const express = require('express')
const dotenv = require('dotenv')
const { config } = require('process')
const mongoose = require('mongoose')
const morgan = require('morgan') 
const passport = require('passport')
const session = require('express-session')
const MongoStore = require('connect-mongo')
const connectDB = require('../CharManager/config/db')


// load config
dotenv.config({path: 'config/config.env'})

// Passport Config
require('./config/passport')(passport)


connectDB()

const app = express()

// logging
if (process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'))
}

// Handlebars ----dont think I'm using this, I'm using EJS? then REACT one learned
// app.engine('.hbs', exphbs({defaultLayout: 'main', extname: '.hbs'}))
// app.set('view engine', '.hbs')

// EJS
app.set('view engine', 'ejs')
app.use(express.static('public'))

// Sessions
app.use(
    session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({mongoUrl: process.env.MONGO_URI,})    
  })
  )


//Passport Middleware
app.use(passport.initialize())
app.use(passport.session())


// Routes
app.use('/', require('./routes/index'))
app.use('/auth', require('./routes/auth'))

const PORT = process.env.PORT || 3000

app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on ${PORT}`))