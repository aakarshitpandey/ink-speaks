import * as express from 'express'
import * as bcrypt from 'bcryptjs'
import * as jwt from 'jsonwebtoken'
import { validateRegisterInput } from '../api/auth/validator'
import User from '../models/user'

const router = express.Router()

router.get('/', (req, res, next) => {
    res.send("Hi");
})

//register a user
router.post('/register', (req, res) => {
    const { error, isValid } = validateRegisterInput(req.body)

    //check validation
    if (!isValid) {
        return res.status(400).json(error)
    }

    User.findOne({ email: req.body.email }).then(user => {
        if (user) {
            return res.status(400).json({ error: "Email already exists" })
        } else {
            const newUser = new User({
                name: req.body.name,
                age: req.body.age,
                email: req.body.email,
                password: req.body.password
            })
        }

        //Hashing password before saving it in the database
        bcrypt.genSalt(10, (err, salt) => {
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

module.exports = router