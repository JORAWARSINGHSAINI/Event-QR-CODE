if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
  }
  
  const express = require('express')
  const app = express()
  const bcrypt = require('bcrypt')
  const passport = require('passport')
  const flash = require('express-flash')
  const session = require('express-session')
  const methodOverride = require('method-override')
  const nodemailer = require('nodemailer'); 
  app.use(express.static('public'))
  const initializePassport = require('./passport-config')
  initializePassport(
    passport,
    email => users.find(user => user.email === email),
    id => users.find(user => user.id === id)
  )
  
  const users = []
  
  app.set('view-engine', 'ejs')
  app.use(express.urlencoded({ extended: false }))
  app.use(flash())
  app.use(session({
    secret: "123",
    resave: false,
    saveUninitialized: false
  }))
  app.use(passport.initialize())
  app.use(passport.session())
  app.use(methodOverride('_method'))
  

  app.get('/', checkAuthenticated, (req, res) => {
      var v = "https://api.qrserver.com/v1/create-qr-code/?data=" +req.user.name+ "&amp;size=200x200"
      mailOptions.html = mailOptions.html+v+">";
      mailOptions.to = req.user.email;
    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      }); 
      res.render('generate.ejs', { name: req.user.name,v : v,email: req.user.email })
})
  
  app.get('/login', checkNotAuthenticated, (req, res) => {
    res.render('login.ejs')
  })
  
  app.post('/login', checkNotAuthenticated, passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
  }))
  
  app.get('/register', checkNotAuthenticated, (req, res) => {
    res.render('register.ejs')
  })
  
  app.post('/register', checkNotAuthenticated, async (req, res) => {
    try {
      const hashedPassword = await bcrypt.hash(req.body.password, 10)
      users.push({
        id: Date.now().toString(),
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword
      })
      res.redirect('/login')
    } catch {
      res.redirect('/register')
    }
  })


  
  
  app.delete('/logout', (req, res) => {
    req.logOut()
    res.redirect('/login')
  })
  
  function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      return next()
    }
  
    res.redirect('/login')
  }
  
  function checkNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      return res.redirect('/')
    }
    next()
  }
  
  var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'jorawarsingh12@gmail.com',
      pass: 'Jorawar@123'
    }
  });
  
  var mailOptions = {
    from: 'jorawarsingh12@gmail.com',
    to: 'jorawarsingh12@gmail.com',
    subject: 'Event Registeration Successfull!',
    html: '<h1>Successfull !</h1><p>That was easy!</p><img src='
  };
  
  





  app.listen(3000)