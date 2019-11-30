import api, { getToken } from './config'
import * as routes from './routes'
import { getUser } from './auth'

export const addBlog = async (body) => {
    try {
        console.log(`Making axios post request`)
        const res = await api.post(routes.compose, { ...body }, {
            headers: {
                Authorization: `Bearer ${getToken()}`
            }
        })
        console.log(res)
        return Promise.resolve(res)
    } catch (err) {
        console.log(err)
        return Promise.reject({ msg: err })
    }
}

export const getBlogList = async (body) => {
    try {
        const res = await api.get(routes.blogs, {
            ...body,
            headers: {
                Authorization: `Bearer ${getToken()}`
            }
        })
        console.log(res)
        return Promise.resolve(res)
    } catch (err) {
        console.log(err)
        return Promise.reject({ msg: err.msg })
    }
}

export const getBlogListFromCreator = async (body) => {
    try {
        const res = await api.get(`${routes.blogs}/${getUser().id}`, {
            ...body,
            headers: {
                Authorization: `Bearer ${getToken()}`
            }
        })
        console.log(res)
        return Promise.resolve(res)
    } catch (err) {
        console.log(err)
        return Promise.reject({ msg: err.msg })
    }
}