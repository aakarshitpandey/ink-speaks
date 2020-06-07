import axios from 'axios'
require('dotenv').config()

// export const baseURL = process.env.BASE_API_URL || 'http://localhost:5000/api/'
export const baseURL = process.env.BASE_API_URL || "https://ink-speaks.herokuapp.com/api/"

export default axios.create({
    baseURL: baseURL,
    responseType: "json",
});

export const getToken = () => {
    return localStorage.getItem('jwtToken')
}