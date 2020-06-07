import api, { baseURL } from './config'
import * as routes from './routes'
const jwt_decode = require('jwt-decode')

export const register = async (body) => {
    try {
        const res = await api.post(routes.register, { ...body })
        return Promise.resolve(res)
    } catch (err) {
        console.log(err)
        return Promise.reject(err)
    }
}

export const registerFacebook = () => {
    window.location = `api/${routes.facebook}`
}

export const login = async (body) => {
    try {
        const res = await api.post(routes.login, { ...body })
        if (res.status !== 400) {
            const { token, success, message } = res.data
            localStorage.setItem("jwtToken", token)
            return Promise.resolve({ success, message })
        } else {
            return Promise.reject({ success: res.data.success, error: res.data.error })
        }
    } catch (err) {
        console.log(err)
        return Promise.reject(err)
    }
}

export const logout = () => {
    try {
        localStorage.removeItem('jwtToken')
        return true
    } catch (e) {
        return false
    }
}

export const getUser = () => {
    const token = localStorage.getItem('jwtToken')
    try {
        if (token) {
            const decoded = jwt_decode(token)
            return decoded
        }
    } catch (e) {
        return null
    }
}

export const loggedIn = () => {
    return localStorage.getItem('jwtToken') ? true : false
}

export const qsLoggedIn = (queryString) => {
    if (queryString) {
        let search = new URLSearchParams(queryString)
        let token = search.get('token')
        if (token) {
            localStorage.setItem("jwtToken", token)
            return true
        }
    }
    return false;
}
