require('dotenv').config()
const express = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../models/user')

const router = express.Router()

const validateRegisterInput = require('../api/auth/validator')
const validateLoginInput = require('../api/auth/validator')

router.get('/', (req, res, next) => {
  User.find().then((users) => {
    res.status(200).json(users)
  })
})

//register a user
router.post('/register', (req, res) => {
  // const { error, isValid } = validateRegisterInput(req.body)

  //check validation
  // if (!isValid) {
  //     return res.status(400).json(error)
  // }

  User.findOne({ email: req.body.email }).then(user => {
    let newUser = null
    if (user) {
      return res.status(400).json({ error: "Email already exists" })
    } else {
      newUser = new User({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        // age: req.body.age,
        email: req.body.email,
        password: req.body.password
      })
    }

    //Hashing password before saving it in the database
    bcrypt.genSalt(10, (err, salt) => {
      if (err) {
        throw err
      }
      bcrypt.hash(newUser.password, salt, (err, hash) => {
        if (err) {
          throw err
        }
        newUser.password = hash
        newUser
          .save()
          .then(user => res.status(200).json(user))
          .catch(err => console.log(err))
      })
    })
  })
})

//login
router.post('/login', (req, res) => {

  //check for validation
  // const { isValid, error } = validateLoginInput(req.body)
  // if (!isValid) {
  //     res.status(400).json(error)
  // }

  const email = req.body.email
  const password = req.body.password

  //finding user in the DB
  User.findOne({ email: email }).then((user) => {
    //check if the user exists
    if (!user) {
      res.status(404).json({ error: 'The email does not match' })
      return
    }

    //checking the password
    bcrypt.compare(password, user.password).then(isMatch => {
      if (isMatch) {
        const payload = {
          id: user.id,
          name: user.name,
          email: user.email
        };

        //sign token
        jwt.sign(
          payload,
          process.env.PRIVATE_KEY,
          { expiresIn: 31556926 },
          (err, token) => {
            if (err) {
              res.status(500).json({ error: 'Login Failed, try again' })
            }
            res.status(200).json({
              success: true,
              token: token,
              message: `Welcome to the App ${user.firstName}`
            })
          }
        )
      } else {
        res.status(400).json({ error: 'Password Incorrect' })
      }
    })
  })
})

module.exports = router