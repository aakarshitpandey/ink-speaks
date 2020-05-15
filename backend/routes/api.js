require('dotenv').config()
const express = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../models/user')
const passport = require('passport')
const Blog = require('../models/blog')
const Content = require('../models/content')
var multer = require('multer')
var upload = multer({ limits: { fieldSize: 1024 * 1024 * 1024 } })

const router = express.Router()

// const validateRegisterInput = require('../api/auth/validator')
// const validateLoginInput = require('../api/auth/validator')

router.get('/', (req, res, next) => {
  if (req.body.id) {
    console.log(req.body.id)
    User.findOne({ _id: `${req.body.id}` }).then((user) => {
      res.status(200).json(user)
    })
  } else {
    console.log(req.body.id)
    User.find().then((users) => {
      res.status(200).json(users)
    })
  }
})

router.get('/getBlogs/', (req, res) => {
  Blog.find({}).then((blogs) => { res.status(200).send({ blog: blogs }) })
})

router.get('/userProfile/:id', (req, res, next) => {
  console.log(req.params)
  User.findOne({ _id: `${req.params.id}` }).then((user) => {
    res.status(200).json(user)
  }).catch((e) => {
    res.status(400).json({ err: e })
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

  // check for validation
  // const { isValid, error } = validateLoginInput(req.body)
  // if (!isValid) {
  //   res.status(400).json(error)
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

router.post('/compose', authenticate, upload.none(), async (req, res, next) => {
  console.log(`Blog Post request recieved`)
  if (req.userInfo._id) {
    const { userInfo } = req
    const content = new Content({ data: req.body.data })
    try {
      const savedContent = await content.save()
      const newBlog = new Blog({
        authorID: req.userInfo._id,
        authorName: `${userInfo.firstName} ${userInfo.lastName}`,
        data: savedContent._id,
        categories: req.body.categories,
        isPosted: req.body.isPosted,
        title: req.body.title
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
    } catch (err) {
      console.log(err);
      res.status(400).json({ msg: "Blog couldn't be saved!" });
    }
  }
})

router.get('/blogContent/:id', async (req, res) => {
  try {
    const content = await Content.findById(req.params.id)
    res.status(200).json({ data: content })
  } catch (e) {
    console.log(e.message)
    res.status(404).json({ msg: e.message })
  }
})

//return all the blog posts
router.get('/blogs', (req, res) => {
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
  const { following } = req.userInfo
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
  let { mode } = req.query
  console.log(mode)
  let counter = 1
  if (`${mode}`.localeCompare('unlike') === 0) {
    counter = -1
  }
  console.log("Counter:", counter)
  Blog.findOne({ _id: `${req.params.id}` })
    .then(async (blog) => {
      blog.reactions.likes += counter
      if (isNaN(blog.reactions.views)) {
        blog.reactions.views = 1
      }
      if (counter === 1) {
        blog.reactions.likedUsers.push(req.userInfo._id)
        if (req.userInfo.likedBlogs)
          req.userInfo.likedBlogs.push(req.params.id)
      } else if (counter === -1) {
        // let index = blog.reactions.likedUsers.indexOf(req.userInfo._id)
        // console.log(index, req.userInfo._id)
        let index = -1
        for (let likedUser in blog.reactions.likedUsers) {
          console.log('inside')
          if (`${blog.reactions.likedUsers[likedUser]}`.localeCompare(`${req.userInfo._id}`) === 0) {
            index = likedUser
            break
          }
        }
        if (index >= 0) {
          blog.reactions.likedUsers.splice(index, 1)
        }
        if (req.userInfo.likedBlogs) {
          index = req.userInfo.likedBlogs.indexOf(req.params.id)
          if (index >= 0) {
            req.userInfo.likedBlogs.splice(index, 1)
          }
        }
      }
      console.log("reactions: ", blog.reactions)
      try {
        await User.updateOne({ _id: req.userInfo._id }, { likedUsers: req.userInfo.likedUsers })
      } catch (e) {
        console.log(e)
      }
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
      console.log(err)
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

router.delete('/blog/:id', authenticate, async (req, res) => {
  const { id } = req.params
  try {
    const blog = await Blog.findById(id)
    const authorID = blog.authorID
    console.log(blog)
    if (!blog) {
      return res.status(404).json({ msg: 'Blog not found' })
    }
    try {
      console.log('deleting: ', blog.data)
      const ret = await Content.deleteOne({ _id: blog.data })
    } catch (e) {
      console.log('Could not delete the content')
    } //end try-catch
    await Blog.deleteOne({ _id: id })
    const author = await User.findOne({ _id: authorID })
    for (let i = 0; i < author.blogs.length; i++) {
      if (`${author.blogs[i]}`.localeCompare(`${id}`) === 0) {
        author.blogs.splice(i, 1)
        break
      }
    }
    await User.updateOne({ _id: authorID }, { blogs: author.blogs })
    res.status(200).json({ msg: 'The blog was successfully deleted' })
  } catch (e) {
    res.status(400).json({ msg: e.message })
  } //end try-catch
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
    req.userInfo = user
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