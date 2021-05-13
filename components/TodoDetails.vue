<template>
  <v-list-item>
    <v-list-item-action>
      <v-checkbox v-model="todo.isDone" @change="editTodo(todo)"></v-checkbox>
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
        {{ formattedDate(new Date(todo.createdAt)) }}</v-list-item-subtitle
      >
    </v-list-item-content>

    <v-btn icon @click="toggleTodoFavourite(todo)">
      <v-icon v-if="!todo.isDone" v-model="todo.isFavourite">{{
        !todo.isFavourite ? 'mdi-heart-outline' : 'mdi-heart'
      }}</v-icon>
    </v-btn>

    <v-btn
      v-if="todo.isDone"
      fab
      ripple
      small
      color="red"
      @click="deleteTodo(todo)"
    >
      <v-icon class="white--text">mdi-close</v-icon>
    </v-btn>
  </v-list-item>
</template>

<script>
export default {
  filters: {
    capitalize(value) {
      if (!value) return ''
      value = value.toString()
      return value.charAt(0).toUpperCase() + value.slice(1)
    },
  },
  props: {
    indexTodo: {
      type: Object,
      default: null,
      require: true,
    },
  },
  data() {
    return {
      todo: null,
    }
  },
  created() {
    this.todo = this.indexTodo
  },
  methods: {
    editTodo(todo) {
      this.$store.dispatch('editTodo', todo)
    },

    deleteTodo(todo) {
      this.$store.dispatch('deleteTodo', todo)
    },

    toggleTodoDone(todo) {
      todo.isDone = !todo.isDone
      this.editTodo(todo)
    },

    toggleTodoFavourite(todo) {
      todo.isFavourite = !todo.isFavourite
      this.editTodo(todo)
    },

    formattedDate(date) {
      let formattedDate
      if (date instanceof Date) {
        formattedDate = date
      } else {
        formattedDate = new Date(date)
      }

      return (
        this.$todoDay(formattedDate) +
        ', ' +
        formattedDate.getDate() +
        this.$todoDayOrder(formattedDate) +
        ' ' +
        this.$todoMonth(formattedDate) +
        ' ' +
        formattedDate.getFullYear()
      )
    },
  },
}
</script>
