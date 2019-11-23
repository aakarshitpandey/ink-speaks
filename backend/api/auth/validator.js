const Validator = require('validator')
const isEmpty = require('is-empty')

const validateRegisterInput = (data) => {
    let error = {}

    //convert to empty fields
    data.name = isEmpty(data.name) ? data.name : ""
    data.email = isEmpty(data.email) ? data.email : ""
    data.pswd = isEmpty(data.pswd) ? data.pswd : ""
    data.pswdConf = isEmpty(data.pswdConf) ? data.pswdConf : ""

    //Name check
    if (Validator.isEmpty(data.name)) {
        error.name = "Name field is empty"
    }

    //Email check
    if (Validator.isEmpty(data.email)) {
        error.email = "Email field is empty"
    } else if (Validator.isEmail(data.email)) {
        error.email = "Email is invalid"
    }

    //Password check
    if (Validator.isEmpty(data.pswd)) {
        error.pswd = "Password field is empty"
    } else if (!Validator.isLength(data.pswd, { min: 4, max: 30 })) {
        error.pswd = "Password should be minimum 4 characters and maximum 30 characters long"
    } else if (!Validator.contains("[0-9]")) {
        error.pswd = "Password must contain a number"
    }

    if (Validator.equals(pswd, pswdConf)) {
        error.pswdConf = "Passwords must match"
    }

    //return the errors object
    return {
        errors,
        isValid: isEmpty(errors)
    };
}

const validateLoginInput = (data) => {
    let error = {}

    //convert to empty fields
    data.email = isEmpty(data.email) ? data.email : ""
    data.pswd = isEmpty(data.pswd) ? data.pswd : ""

    //Email check
    if (Validator.isEmpty(data.email)) {
        error.email = "Email field is empty"
    } else if (Validator.isEmail(data.email)) {
        error.email = "Email is invalid"
    }

    //Password check
    if (Validator.isEmpty(data.pswd)) {
        error.pswd = "Password field is empty"
    }

    //return the errors object
    return {
        errors,
        isValid: isEmpty(errors)
    };
}

module.exports = { validateLoginInput, validateRegisterInput };