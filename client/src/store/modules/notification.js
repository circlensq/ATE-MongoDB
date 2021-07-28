export const namespaced = true

export const state = {
    enableFailNotification: false,
    notificationAPIStatus: false
}

export const mutations = {
    SET_FALSE_FAIL_NOTIFICATION(state) {
        state.enableFailNotification = false
    },
    SET_TRUE_FAIL_NOTIFICATION(state) {
        state.enableFailNotification = true
    },
    SET_FALSE_NOTIFICATION_API(state){
        state.notificationAPIStatus = false
    },
    SET_TRUE_DISABLE_FAIL_NOTIFICATION(state){
        state.notificationAPIStatus = true
    }
}

export const actions = {

    setFalseFailNotificationActions({ commit }) {
        commit('SET_FALSE_FAIL_NOTIFICATION')
    },
    setTrueFailNotificationActions({ commit }) {
        commit('SET_TRUE_FAIL_NOTIFICATION')
    },
    
    setFalseNotificationAPIActions({commit}) {
        commit('SET_FALSE_NOTIFICATION_API')
    },
    setTrueNotificationAPIActions({commit}) {
        commit('SET_TRUE_NOTIFICATION_API')
    },
}