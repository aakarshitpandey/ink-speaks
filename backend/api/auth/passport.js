require('dotenv').config();

import * as bcrypt from 'bcryptjs'
import * as jwt from 'jsonwebtoken'
import * as passport from 'passport'

export const login = async (password, user) => {
    bcrypt.compare(password, user.password)
        .then(isMatch => {
            if (isMatch) {
                // password has been matched
                // Create the JWT Payload
                const payload = {
                    id: user.id,
                    email: user.email,
                    name: user.name
                }

                //Sign the JWT Token
                jwt.sign(
                    payload,
                )
            } else {

            }
        })
}