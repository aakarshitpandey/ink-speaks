import axios from 'axios'
require('dotenv').config()

export default axios.create({
    baseURL: process.env.BASE_API_URL || 'http://localhost:5000/api/',
<<<<<<< HEAD
=======
    // baseURL: process.env.BASE_API_URL || "https://ink-speaks.herokuapp.com/api/",
>>>>>>> hosting
    responseType: "json"
});

export const getToken = () => {
    return localStorage.getItem('jwtToken')
}