require('dotenv').config()
const express = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../models/user')
const passport = require('passport')
const Blog = require('../models/blog')

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
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email
        };

        console.log(payload)

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
        res.status(400).json({ success: false, error: 'Password Incorrect' })
      }
    })
  })
})

router.post('/compose', authenticate, (req, res, next) => {
  if (res.userInfo._id) {
    const { userInfo } = res
    const newBlog = new Blog({
      authorID: res.userInfo._id,
      authorName: `${userInfo.firstName} ${userInfo.lastName}`,
      data: req.body.data,
      categories: req.body.categories
    })
    newBlog.save()
      .then((blog) => {
        try {
          updateUser(userInfo._id, { blogs: [...(userInfo.blogs), blog._id] })
        } catch (err) {
          console.log(err)
          res.status(400).json({ msg: 'The userDB could not be updated' })
        }
      })
      .catch(err => {
        console.log(err);
        res.status(400).json({ msg: "Blog couldn't be saved!" });
      })
  }
})

async function authenticate(req, res, next) {
  passport.authenticate('jwt', { session: false, failureFlash: 'Authentication failed...Log back in!' }, (err, user, info) => {
    if (err) {
      res.status(400).json({ msg: 'There was an error' });
      console.log(err)
    }

    if (!user) {
      res.status(404).json({ msg: 'Invalid Token.' })
    }
    //if authentication successfull
    res.userInfo = user
    next()
  })
}

const updateUser = async (id, data) => {
  if (data) {
    try {
      const res = await User.updateOne({ _id: id }, { ...data });
      return Promise.resolve({ msg: 'Updated the user', user: res })
    } catch (err) {
      console.log(err)
      return Promise.reject({ ...err, msg: 'Update user failed' })
    }
  } else {
    return Promise.reject({ msg: 'No content passed to updateUser middleware' })
  }
}

module.exports = router