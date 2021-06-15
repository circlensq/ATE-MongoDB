import { createStore, createLogger } from 'vuex'
import * as user from './modules/user'

const debug = process.env.NODE_ENV !== 'production'

export default createStore({
  modules: {
    user,
  },
  strict: debug,
  plugins: debug ? [createLogger()] : []
})