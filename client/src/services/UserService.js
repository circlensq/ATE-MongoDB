import axios from 'axios'
import store from '../store/index'
   
export default {
    postLogin(user) {
        return axios.create({
            baseURL: "/api",
            withCredentials: false,
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': store.getters.getCSRFToken
            }
        }).post('/accounts/login', user)
        
    }
}