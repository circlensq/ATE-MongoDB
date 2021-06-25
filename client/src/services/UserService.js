import axios from 'axios'

const apiLogin = axios.create({
    baseURL: "/api",
    withCredentials: false,
    headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
    }
})
   
export default {
    postLogin(user) {
        return apiLogin.post('/accounts/login', user)
    }
}