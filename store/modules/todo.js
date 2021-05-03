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
    const todoIndex = state.todos.findIndex((todo) => todo.id === editedTodo.id)
    state.todos[todoIndex] = editedTodo
  },
  removeTodo(state, index) {
    state.todos.splice(index, 1)
  },
}

const actions = {
  nuxtServerInit(vuexContext) {
    const todos = []
    todos.push({
      id: uuid.v1(),
      title: 'Welcome to Duriseo',
      isDone: false,
      isFavourite: false,
      createdAt: new Date(),
    })
    return vuexContext.commit('setTodos', todos)
  },
  setTodos(vuexContext, todos) {
    vuexContext.commit('setTodos', todos)
  },
  addTodo(vuexContext, todo) {
    vuexContext.commit('addTodo', todo)
  },
}

export default {
  state,
  getters,
  mutations,
  actions,
}
