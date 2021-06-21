import UserService from '@/services/UserService'
import axios from 'axios'

export const namespaced = true

export const state = {
    user: {},
    auth: {
        message : ''
    }
}

export const mutations = {
    SET_USER_DATA(state, userData){
        state.user = userData
        localStorage.setItem('user', JSON.stringify(userData))
        axios.defaults.headers.common['Authorization'] = `Bearer ${userData.token}`
    },
    LOGOUT (state) {
        state.user = null
        localStorage.removeItem('user')
        location.reload()
    }
} 

export const actions = {
    login({commit}, credentials) {
        return UserService.postLogin(credentials).then(({data}) =>{
            state.auth.message = data.message
            commit('SET_USER_DATA', data.token)
        })
    },
    logout({ commit }) {
        commit('LOGOUT')
    }
}

export const getters = {
    loggedIn (state) {
        return !!state.user
    }
}