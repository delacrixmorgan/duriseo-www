import { uuid } from 'vue-uuid'

const state = () => ({
  todos: [],
})

const getters = {
  todos(state) {
    return state.todos
  },
}

const mutations = {
  setTodos(state, todos) {
    state.todos = todos
  },
  addTodo(state, todo) {
    state.todos.push(todo)
  },
  editTodo(state, editedTodo) {
    const todoIndex = state.todos.findIndex(
      (todo) => todo.uuid === editedTodo.uuid
    )
    state.todos[todoIndex] = editedTodo
  },
  deleteTodo(state, deletedTodo) {
    const todoIndex = state.todos.findIndex(
      (todo) => todo.uuid === deletedTodo.uuid
    )
    state.todos.splice(todoIndex, 1)
  },
  clearTodos(state) {
    state.todos.splice(0)
  },
}

const actions = {
  nuxtServerInit(vuexContext) {
    return []
    // return this.$axios
    //   .$get(
    //     'https://duriseo-7552f-default-rtdb.asia-southeast1.firebasedatabase.app/todos.json' +
    //       '?orderBy="userId"' +
    //       '&' +
    //       'equalTo="' +
    //       user +
    //       '"'
    //   )
    //   .then((data) => {
    //     const todos = []
    //     for (const key in data) {
    //       todos.push({ uuid: key, ...data[key] })
    //     }
    //     vuexContext.commit('setTodos', todos)
    //   })
    //   .catch((error) => console.error(error))
  },
  fetchTodos(vuexContext, userId) {
    let user
    if (userId == null) {
      user = localStorage.getItem('userId')
    } else {
      user = userId
    }
    const token = localStorage.getItem('token')
    if (token == null) {
      return []
    }

    return this.$axios
      .$get(
        'https://duriseo-7552f-default-rtdb.asia-southeast1.firebasedatabase.app/todos.json' +
          '?auth=' +
          token +
          '&' +
          'orderBy="userId"' +
          '&' +
          'equalTo="' +
          user +
          '"'
      )
      .then((data) => {
        const todos = []
        for (const key in data) {
          todos.push({ uuid: key, ...data[key] })
        }
        vuexContext.commit('setTodos', todos)
      })
  },
  setTodos(vuexContext, todos) {
    vuexContext.commit('setTodos', todos)
  },
  addTodo(vuexContext, todo) {
    const token = localStorage.getItem('token')
    const user = localStorage.getItem('userId')
    if (token == null) {
      return vuexContext.commit('addTodo', { uuid: uuid.v1(), ...todo })
    }

    return this.$axios
      .$post(
        'https://duriseo-7552f-default-rtdb.asia-southeast1.firebasedatabase.app/todos.json' +
          '?auth=' +
          token,
        { userId: user, ...todo }
      )
      .then((data) => {
        vuexContext.commit('addTodo', { uuid: data.name, ...todo })
      })
  },
  editTodo(vuexContext, todo) {
    const token = localStorage.getItem('token')
    if (token == null) {
      return vuexContext.commit('editTodo', todo)
    }

    return this.$axios
      .$put(
        'https://duriseo-7552f-default-rtdb.asia-southeast1.firebasedatabase.app/todos/' +
          todo.uuid +
          '.json' +
          '?auth=' +
          token,
        {
          title: todo.title,
          isDone: todo.isDone,
          isFavourite: todo.isFavourite,
          createdAt: todo.createdAt,
          userId: todo.userId,
        }
      )
      .then((data) => {
        vuexContext.commit('editTodo', { uuid: data.name, ...todo })
      })
  },
  deleteTodo(vuexContext, todo) {
    const token = localStorage.getItem('token')
    if (token == null) {
      return vuexContext.commit('deleteTodo', todo)
    }

    return this.$axios
      .$delete(
        'https://duriseo-7552f-default-rtdb.asia-southeast1.firebasedatabase.app/todos/' +
          todo.uuid +
          '.json' +
          '?auth=' +
          token
      )
      .then((data) => {
        vuexContext.commit('deleteTodo', todo)
      })
  },
  logoutUserTodos(vuexContext) {
    vuexContext.commit('clearTodos')
  },
}

export default {
  state,
  getters,
  mutations,
  actions,
}
