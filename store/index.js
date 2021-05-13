import Vuex from 'vuex'

import auth from '@/store/modules/auth.js'
import todos from '@/store/modules/todo.js'

export default () => {
  return new Vuex.Store({
    modules: {
      auth,
      todos,
    },
  })
}
