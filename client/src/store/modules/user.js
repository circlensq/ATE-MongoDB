import UserService from '@/services/UserService'

export const namespaced = true

export const state = {
    user: {}
}

export const mutations = {
    LOGIN_USER(state, user){
        state.user = user
    }
} 

export const actions = {
    loginUser({commit}, event) {
        return UserService.postLogin(event).then(() =>{
            commit('')
        })
    },
}