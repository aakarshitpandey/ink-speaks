import api, { getToken } from './config'
import * as routes from './routes'
import { getUser } from './auth'

export const getUserByID = async () => {
    const user = getUser()
    console.log(user)
    try {
        const res = await api.get(`${routes.userProfile}${user.id}`)
        return Promise.resolve(res)
    } catch (e) {
        return Promise.reject({ msg: e })
    }
}

export const addBlog = async (body) => {
    const formData = new FormData()
    formData.append("title", body.title)
    formData.append("data", body.data)
    formData.append("categories", body.categories)
    console.log(body.data)
    try {
        const res = await api.post(routes.compose, formData/*{ ...body }*/, {
            headers: {
                'Content-Type': 'multipart/form-data',
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

export const getBlogListSubscriptions = async (body) => {
    try {
        const res = await api.get(routes.subscribedBlogs, {
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
        const res = await api.get(`${routes.blogs}${getUser().id}`, {
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

export const getBlogById = async (id) => {
    try {
        const res = await api.get(`${routes.blogpost}${id}`, {
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

export const getBlogContentsById = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const res = await api.get(`${routes.blogContent}${id}`, {
                headers: {
                    Authorization: `Bearer ${getToken()}`
                }
            })
            return resolve(res.data.data)
        } catch (err) {
            console.log(err)
            return reject({ msg: err })
        }
    })
}

export const likeBlog = async (id, mode) => {
    if (`${mode}`.localeCompare('unlike') !== 0) {
        mode = "like"
    }
    try {
        const res = await api.get(`${routes.like}${id}?mode=${mode}`, {
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

export const subscribe = async (authorID) => {
    try {
        const res = await api.post(`${routes.subscribe}`, { authorID: authorID }, {
            headers: {
                Authorization: `Bearer ${getToken()}`
            }
        })
        console.log(res)
        return Promise.resolve(res)
    } catch (e) {
        console.log(e)
        return Promise.reject({ msg: e })
    }
}