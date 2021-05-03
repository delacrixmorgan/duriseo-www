import Vuex from 'vuex'

import todos from '@/store/modules/todo.js'

export default () => {
  return new Vuex.Store({
    modules: {
      todos,
    },
  })
}
