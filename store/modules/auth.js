import Cookie from 'js-cookie'

const state = () => ({
  state: {
    token: null,
  },
})

const getters = {
  isAuthenticated(state) {
    return state.token != null
  },
}

const mutations = {
  setToken(state, token) {
    state.token = token
  },
  clearToken(state) {
    state.token = null
  },
}

const actions = {
  initAuth(vuexContext, req) {
    let token
    let expirationDate
    if (req) {
      if (!req.headers.cookie) {
        return
      }
      const jwtCookie = req.headers.cookie
        .split(';')
        .find((c) => c.trim().startsWith('jwt='))
      if (!jwtCookie) {
        return
      }
      token = jwtCookie.split('=')[1]
      expirationDate = req.headers.cookie
        .split(';')
        .find((c) => c.trim().startsWith('expirationDate='))
        .split('=')[1]
    } else if (process.client) {
      token = localStorage.getItem('token')
      expirationDate = localStorage.getItem('tokenExpiration')
    }
    if (new Date().getTime() > +expirationDate || !token) {
      console.log('No token or invalid token')
      vuexContext.dispatch('logoutUser')
      return
    }
    vuexContext.commit('setToken', token)
  },
  authenticateUser(vuexContext, authData) {
    let authUrl =
      'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=' +
      process.env.fbAPIKey
    if (!authData.isLogin) {
      authUrl =
        'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=' +
        process.env.fbAPIKey
    }
    return this.$axios
      .$post(authUrl, {
        email: authData.email,
        password: authData.password,
        returnSecureToken: true,
      })
      .then((result) => {
        vuexContext.commit('setToken', result.idToken)
        localStorage.setItem('token', result.idToken)
        localStorage.setItem(
          'tokenExpiration',
          new Date().getTime() + Number.parseInt(result.expiresIn) * 1000
        )

        console.log('token: ' + result.idToken)
        console.log('localStorage: ' + localStorage.getItem('token'))

        Cookie.set('jwt', result.idToken)
        Cookie.set(
          'expirationDate',
          new Date().getTime() + Number.parseInt(result.expiresIn) * 1000
        )
        return this.$axios.$post('http://localhost:3000/api/track-data', {
          data: 'Authenticated!',
        })
      })
      .catch((e) => console.log(e))
  },
  forgotPassword() {
    // https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode

    return this.$axios.$post(
      'https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=' +
        process.env.fbAPIKey
    )
  },
  logoutUser(vuexContext) {
    vuexContext.commit('clearToken')
    Cookie.remove('jwt')
    Cookie.remove('expirationDate')
    if (process.client) {
      localStorage.removeItem('token')
      localStorage.removeItem('tokenExpiration')
    }
  },
}

export default {
  state,
  getters,
  mutations,
  actions,
}