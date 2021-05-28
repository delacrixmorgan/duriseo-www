import Cookie from 'js-cookie'

const state = () => ({
  state: {
    token: null,
    userId: null,
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
  setUserId(state, userId) {
    state.userId = userId
  },
  clearToken(state) {
    state.token = null
  },
}

const actions = {
  initAuth(vuexContext, req) {
    let token
    let userId
    let expirationDate
    if (req) {
      if (!req.headers.cookie) {
        vuexContext.dispatch('logoutUser')
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
      userId = localStorage.getItem('userId')
      expirationDate = localStorage.getItem('tokenExpiration')
    }
    if (new Date().getTime() > +expirationDate || !token) {
      console.log('No token or invalid token')
      vuexContext.dispatch('logoutUser')
      return
    }
    vuexContext.commit('setToken', token)
    vuexContext.commit('setUserId', userId)
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

        vuexContext.commit('setUserId', result.localId)
        localStorage.setItem('userId', result.localId)

        localStorage.setItem(
          'tokenExpiration',
          new Date().getTime() + Number.parseInt(result.expiresIn) * 1000
        )

        Cookie.set('jwt', result.idToken)
        Cookie.set(
          'expirationDate',
          new Date().getTime() + Number.parseInt(result.expiresIn) * 1000
        )
      })
  },
  forgotPassword(vuexContext, authData) {
    return this.$axios.$post(
      'https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=' +
        process.env.fbAPIKey,
      {
        email: authData.email,
        requestType: 'PASSWORD_RESET',
      }
    )
  },
  logoutUser(vuexContext) {
    vuexContext.commit('clearToken')
    Cookie.remove('jwt')
    Cookie.remove('expirationDate')
    if (process.client) {
      localStorage.removeItem('token')
      localStorage.removeItem('userId')
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
