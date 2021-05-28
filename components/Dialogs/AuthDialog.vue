<template>
  <v-dialog
    v-model="isVisible"
    transition="dialog-top-transition"
    @keydown.esc="isVisible = false"
  >
    <v-card class="pa-4">
      <v-card-text>
        <v-form ref="loginForm" v-model="valid" lazy-validation>
          <v-row>
            <v-col cols="12">
              <v-text-field
                v-model="email"
                :rules="emailRules"
                label="Email"
                required
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-text-field
                v-model="password"
                :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                :rules="[passwordRules.required, passwordRules.min]"
                :type="show1 ? 'text' : 'password'"
                name="input-10-1"
                label="Password"
                hint="At least 8 characters"
                @keydown.enter="isValidToProceed(true)"
                @click:append="show1 = !show1"
              ></v-text-field>
            </v-col>
            <v-col>
              <v-btn
                x-large
                block
                :disabled="!valid"
                color="deep-purple accent-4"
                @click.stop="isValidToProceed(true)"
              >
                <span class="white--text">Login</span>
              </v-btn>
              <v-btn
                x-large
                outlined
                class="mt-4"
                :disabled="!valid"
                color="deep-purple accent-4"
                @click.stop="isValidToProceed(false)"
              >
                Sign Up
              </v-btn>

              <v-btn
                x-large
                text
                class="mt-4"
                :disabled="!valid"
                color="error"
                @click.stop="onForgotPassword"
              >
                Forgot Password
              </v-btn>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: {
    value: Boolean,
  },
  data: () => ({
    tab: 0,
    tabs: [
      { name: 'Login', icon: 'mdi-account' },
      { name: 'Register', icon: 'mdi-account-outline' },
    ],
    valid: true,
    email: '',
    password: '',
    show1: false,
    emailRules: [
      (v) => !!v || 'Required email address',
      (v) => /.+@.+\..+/.test(v) || 'Email must be valid',
    ],
    passwordRules: {
      required: (value) => !!value || 'Required.',
      min: (v) => (v && v.length >= 8) || 'Min 8 characters',
    },
  }),
  computed: {
    isVisible: {
      get() {
        return this.value
      },
      set(value) {
        this.$emit('input', value)
      },
    },
  },
  methods: {
    isValidToProceed(isLoginClicked) {
      if (this.$refs.loginForm.validate()) {
        this.onSubmit(isLoginClicked)
      }
    },
    async onSubmit(isLoginClicked) {
      try {
        await this.$store.dispatch('authenticateUser', {
          isLogin: isLoginClicked,
          email: this.email,
          password: this.password,
        })
      } catch (e) {
        alert(e)
        return
      }

      try {
        return await this.$store.dispatch('fetchTodos').then(() => {
          this.isVisible = false
        })
      } catch (e) {
        alert(e)
      }
    },
    onForgotPassword() {
      try {
        this.$store
          .dispatch('forgotPassword', {
            email: this.email,
          })
          .then(() => {
            this.isVisible = false
          })
      } catch (e) {
        alert(e)
      }
    },
    reset() {
      this.$refs.form.reset()
    },
    resetValidation() {
      this.$refs.form.resetValidation()
    },
  },
}
</script>
