import * as express from 'express'
import * as bycrypt from 'bcryptjs'
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
    })
})

module.exports = router