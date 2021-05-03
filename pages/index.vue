<template>
  <v-theme-provider root :dark="isDark">
    <v-container>
      <v-row class="ma-5">
        <v-col>
          <v-card>
            <v-toolbar color="blue darken-4" dark>
              <v-toolbar-side-icon></v-toolbar-side-icon>
              <v-toolbar-title class="headline">Duriseo</v-toolbar-title>

              <v-spacer></v-spacer>

              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-btn icon @click="isDark = !isDark" v-on="on">
                    <v-icon v-model="isDark">{{
                      !isDark ? 'mdi-weather-night' : 'mdi-weather-cloudy'
                    }}</v-icon>
                  </v-btn>
                </template>
                <span>
                  {{ isDark ? 'light mode' : 'dark mode' }}
                </span>
              </v-tooltip>
            </v-toolbar>

            <v-list two-line subheader>
              <v-subheader class="headline">{{
                formattedDate(this.todayDate)
              }}</v-subheader>
              <p class="mx-12 text-right">
                <b>{{ todos.length }}</b> Tasks
              </p>

              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title>
                    <v-text-field
                      v-model="newTodo"
                      id="newTodo"
                      name="newTodo"
                      label="Type your task"
                      @keyup.enter="addTodo"
                    />
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list>

            <v-list subheader two-line flat>
              <v-subheader class="subheading" v-if="todos.length == 0"
                >You have {{ todos.length }} Tasks, add some</v-subheader
              >
              <v-subheader class="subheading" v-else-if="todos.length == 1"
                >Your Tasks</v-subheader
              >

              <v-list-item-group>
                <v-list-item v-for="(todo, index) in todos" :key="index">
                  <v-list-item-action>
                    <v-checkbox
                      v-model="todo.isDone"
                      @change="updateTodo(todo)"
                    ></v-checkbox>
                  </v-list-item-action>

                  <v-list-item-content @click="toggleTodoDone(todo)">
                    <v-list-item-title
                      :class="{
                        'text-decoration-line-through': todo.isDone,
                      }"
                      >{{ todo.title | capitalize }}</v-list-item-title
                    >
                    <v-list-item-subtitle
                      >Created on
                      {{ formattedDate(todo.createdAt) }}</v-list-item-subtitle
                    >
                  </v-list-item-content>

                  <v-btn icon @click="toggleTodoFavourite(todo)" v-on="on">
                    <v-icon v-model="todo.isFavourite" v-if="!todo.isDone">{{
                      !todo.isFavourite ? 'mdi-heart-outline' : 'mdi-heart'
                    }}</v-icon>
                  </v-btn>

                  <v-btn
                    fab
                    ripple
                    small
                    color="red"
                    v-if="todo.isDone"
                    @click="removeTodo(index)"
                  >
                    <v-icon class="white--text">mdi-close</v-icon>
                  </v-btn>
                </v-list-item>
              </v-list-item-group>
            </v-list>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-theme-provider>
</template>

<script>
import { uuid } from 'vue-uuid'

export default {
  data() {
    return {
      isDark: false,
      show: true,
      newTodo: '',
      todos: [],
      todayDate: new Date(),
    }
  },
  created() {
    this.todos = this.$store.getters.todos
  },
  methods: {
    addTodo() {
      const value = this.newTodo && this.newTodo.trim()
      if (!value) {
        return
      }

      const todo = {
        id: uuid.v1(),
        title: this.newTodo,
        isDone: false,
        isFavourite: false,
        createdAt: new Date(),
      }

      this.$store.commit('addTodo', todo)
      this.newTodo = ''
    },

    updateTodo(todo) {
      this.$store.commit('editTodo', todo)
    },

    removeTodo(index) {
      this.$store.commit('removeTodo', index)
    },

    toggleTodoDone(todo) {
      todo.isDone = !todo.isDone
      this.updateTodo(todo)
    },

    toggleTodoFavourite(todo) {
      todo.isFavourite = !todo.isFavourite
      this.updateTodo(todo)
    },

    formattedDate(date) {
      return (
        this.$todoDay(date) +
        ', ' +
        date.getDate() +
        this.$todoDayOrder(date) +
        ' ' +
        this.$todoMonth(date) +
        ' ' +
        date.getFullYear()
      )
    },
  },

  filters: {
    capitalize(value) {
      if (!value) return ''
      value = value.toString()
      return value.charAt(0).toUpperCase() + value.slice(1)
    },
  },
}
</script>
