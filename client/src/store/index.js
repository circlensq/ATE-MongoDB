import { createStore, createLogger } from 'vuex'
import * as user from './modules/user'
import * as notification from './modules/notification'
import * as security from './modules/security'

const debug = process.env.NODE_ENV !== 'production'

export default createStore({
  modules: {
    user,
    notification,
    security
  },
  strict: debug,
  plugins: debug ? [createLogger()] : [],
  getters: {
    getCSRFToken (state) {
      return state.security.csrfToken
    }
  }
})