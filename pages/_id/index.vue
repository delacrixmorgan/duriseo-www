<template>
  <v-theme-provider root :dark="isDark">
    <v-container>
      <v-row class="ma-5">
        <v-col>
          <v-card>
            <v-toolbar color="deep-purple accent-4" dark>
              <v-toolbar-title class="headline">Duriseo</v-toolbar-title>

              <v-spacer></v-spacer>
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-btn icon @click="isDark = !isDark" v-on="on">
                    <v-icon v-model="isDark">{{
                      !isDark ? 'mdi-weather-night' : 'mdi-white-balance-sunny'
                    }}</v-icon>
                  </v-btn>
                </template>
                <span>
                  {{ isDark ? 'Light Mode' : 'Dark Mode' }}
                </span>
              </v-tooltip>

              <auth-dialog v-model="showAuthDialog" />

              <logout-dialog v-model="showLogoutDialog" />

              <v-menu offset-y>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn icon v-bind="attrs" v-on="on">
                    <v-icon>mdi-dots-vertical</v-icon>
                  </v-btn>
                </template>
                <v-list>
                  <v-list-item
                    v-for="(item, index) in menuItems"
                    :key="index"
                    @click="item.action"
                  >
                    <v-list-item-title>{{ item.title }}</v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
            </v-toolbar>

            <v-list two-line subheader>
              <div class="d-flex justify-space-between my-4" flat tile>
                <v-subheader class="headline">{{
                  formattedDate(todayDate)
                }}</v-subheader>
                <p class="text-right my-3 mx-6">
                  <b>{{ todos.length }}</b> Tasks
                </p>
              </div>
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title>
                    <v-text-field
                      id="newTodo"
                      v-model="newTodo"
                      name="newTodo"
                      label="Type your task"
                      @keyup.enter="addTodo"
                    />
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list>

            <v-list subheader two-line flat>
              <v-subheader v-if="todos.length == 0" class="subheading"
                >You have {{ todos.length }} Tasks, add some</v-subheader
              >
              <v-subheader v-else-if="todos.length == 1" class="subheading"
                >Your Tasks</v-subheader
              >

              <v-list-item-group>
                <todo-details
                  v-for="todo in todos"
                  :key="todo.uuid"
                  :index-todo="todo"
                />
              </v-list-item-group>
            </v-list>
          </v-card>
        </v-col>
      </v-row>

      <error-snackbar v-model="showErrorDialog" :message="errorMessage" />
    </v-container>
  </v-theme-provider>
</template>

<script>
import AuthDialog from '@/components/Dialogs/AuthDialog.vue'
import LogoutDialog from '@/components/Dialogs/LogoutDialog.vue'
import ErrorSnackbar from '@/components/Snackbars/ErrorSnackbar.vue'

export default {
  components: { AuthDialog, LogoutDialog, ErrorSnackbar },
  data() {
    return {
      userId: null,
      isDark: false,
      show: true,
      newTodo: '',
      todayDate: new Date(),
      guestItems: [
        {
          title: 'Login',
          action: () => (this.showAuthDialog = true),
        },
        { title: 'About', action: () => {} },
      ],
      authItems: [
        { title: 'About', action: () => {} },
        {
          title: 'Logout',
          action: () => (this.showLogoutDialog = true),
        },
      ],
      errorMessage: '',
      showAuthDialog: false,
      showLogoutDialog: false,
      showErrorDialog: false,
    }
  },
  asyncData(context) {
    return context.params.id
  },
  computed: {
    menuItems() {
      return this.$store.getters.isAuthenticated
        ? this.authItems
        : this.guestItems
    },
    todos() {
      return this.$store.getters.todos
    },
  },
  mounted() {
    this.$store
      .dispatch('fetchTodos', this.$route.params.id)
      .then(() => {})
      .catch((error) => {
        this.errorMessage = this.$formatError(error)
        this.showErrorDialog = true
        this.$router.push('/')
      })
  },
  methods: {
    addTodo() {
      const value = this.newTodo && this.newTodo.trim()
      if (!value) {
        return
      }

      const todo = {
        title: this.newTodo,
        isDone: false,
        isFavourite: false,
        createdAt: new Date(),
      }

      this.$store
        .dispatch('addTodo', todo)
        .then(() => {
          this.newTodo = ''
        })
        .catch((error) => {
          this.errorMessage = this.$formatError(error)
          this.showErrorDialog = true
        })
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
