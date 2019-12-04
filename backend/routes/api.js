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
  console.log(`Blog Post request recieved`)
  if (res.userInfo._id) {
    const { userInfo } = res
    const newBlog = new Blog({
      authorID: res.userInfo._id,
      authorName: `${userInfo.firstName} ${userInfo.lastName}`,
      data: req.body.data,
      categories: req.body.categories,
      isPosted: req.body.isPosted
    })
    newBlog.save()
      .then((blog) => {
        try {
          updateUser(userInfo._id, { blogs: [...(userInfo.blogs), blog._id] })
            .then((user) => res.status(200).json({ blog: blog, msg: 'The blog has been saved' }))
            .catch((err) => {
              console.log(err)
              res.status(400).json({ msg: 'The userDB could not be updated' })
            })
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

//return all the blog posts
router.get('/blogs', authenticate, (req, res) => {
  Blog.find({})
    .then((blogs) => {
      if (req.body.sendAll === true || blogs.length <= 20) {
        res.status(200).json({
          blogs: blogs.sort(compareDates)
        })
      } else {
        res.status(200).json({
          blogs: blogs.sort(compareDates).slice(0, 20)
        })
      }
    })
    .catch(err => {
      console.log(err)
      res.status(400).json({ msg: `Error occured` });
    })
})

//return the blogs written by a particular user
router.get('/blogs/:id', authenticate, (req, res) => {
  Blog.find({ authorID: `${req.params.id}` })
    .then((blogs) => {
      res.status(200).json({ blogs: blogs })
    })
    .catch(e => {
      console.log(err)
      res.status(400).json({ msg: `Error occured` })
    })
})

router.get('/blogs/subscriptions', authenticate, (req, res) => {
  const { following } = res.userInfo
  let blogArr = []
  following.map((creatorID) => {
    if (blogArr.length < 50) {
      Blog.find({ authorID: `${creatorID}` })
        .then((blogs) => {
          blogArr.push(blogs)
        })
        .catch(e => {
          res.status(200).json({ blogs: blogArr, msg: `Error occured` })
        })
    }
  })
  res.status(200).send({ blogs: blogArr });
})

//increase the numebr of likes
router.get('/blogpost/likes/:id', authenticate, (req, res) => {
  Blog.findOne({ _id: `${req.params.id}` })
    .then((blog) => {
      blog.reactions.likes += 1
      if (isNaN(blog.reactions.views)) {
        blog.reactions.views = 1
      }
      console.log(blog.reactions)
      Blog.updateOne({ _id: `${req.params.id}` }, { reactions: { ...blog.reactions } })
        .then((updatedBlog) => {
          res.status(200).json({ blog: blog })
        })
        .catch((err) => {
          console.log(err)
          blog.reactions.likes -= 1
          res.status(200).json({ blog: blog })
        })
    })
    .catch((err) => {
      res.status(400).send({ msg: err })
    })
})

router.get('/blogpost/:id', authenticate, (req, res) => {
  Blog.findOne({ _id: `${req.params.id}` })
    .then((blog) => {
      if (isNaN(blog.reactions.views)) {
        blog.reactions.views = 1
      } else {
        blog.reactions.views += 1
      }
      Blog.updateOne({ _id: `${req.params.id}` }, { reactions: { ...blog.reactions } })
        .then(updatedBlog => {
          res.status(200).json({ blog: blog })
        })
        .catch(err => {
          res.status(200).json({ blog: blog })
        })
    })
    .catch((err) => {
      res.status(400).send({ msg: err })
    })
})

router.post('/subscribe/', authenticate, (req, res) => {
  User.findOne({ _id: `${req.body.authorID}` })
    .then(async (user) => {
      let response = null;
      try {
        if (!user.followers.contains(req.userInfo._id)) {
          response = await User.updateOne({ _id: `${req.body.authorID}` }, { followers: [...user.followers, req.userInfo._id] })
        } else {
          response = await User.updateOne({ _id: `${req.body.authorID}` }, { followers: user.followers.splice(user.followers.indexOf(req.userInfo._id)) })
        }
        if (response) {
          res.send(200).json({ msg: `Toggled Subscribe` });
        }
      } catch (e) {
        console.log(e)
        res.send(400).json({ msg: `Couldn't toggle subscribe` });
      }
    })
})

async function authenticate(req, res, next) {
  console.log(`authenticate`)
  passport.authenticate('jwt', { session: false }, (err, user, info) => {
    if (err) {
      res.status(400).json({ msg: 'There was an error' });
      return
    }

    if (!user) {
      console.log(`invalid token`)
      res.status(404).json({ msg: 'Invalid Token.' })
      return
    }
    //if authentication successfull
    res.userInfo = user
    next()
  })(req, res, next)
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

const compareDates = (b1, b2) => {
  if (b1.date < b2.date) {
    return 1
  } else if (b1.date > b2.date) {
    return -1
  }
  return 0
}

module.exports = router