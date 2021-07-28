export const namespaced = true

export const state = {
    csrfToken: null
}

export const mutations = {
    SET_CSRF_TOKEN(state, csrfToken){
        state.csrfToken = csrfToken
    }
}

export const actions = {
    setCSRFToken({ commit }, token) {
        commit('SET_CSRF_TOKEN', token)
    },
}