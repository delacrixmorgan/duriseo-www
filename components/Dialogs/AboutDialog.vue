<template>
  <v-dialog
    v-model="isVisible"
    max-width="300"
    @keydown.esc="isVisible = false"
  >
    <v-card class="pa-4">
      <v-card-title>Duriseo</v-card-title>
      <v-card-subtitle class="pt-2">Made by Morgan Koh</v-card-subtitle>
      <v-btn
        v-for="item in items"
        :key="item.icon"
        light
        class="ml-4"
        icon
        :href="item.link"
        target="_blank"
      >
        <v-icon>
          {{ item.icon }}
        </v-icon>
      </v-btn>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: {
    value: Boolean,
  },
  data: () => ({
    items: [
      {
        icon: 'mdi-github',
        link: 'https://github.com/delacrixmorgan',
      },
      {
        icon: 'mdi-twitter',
        link: 'https://twitter.com/DelacrixMorgan',
      },
      {
        icon: 'mdi-linkedin',
        link: 'https://www.linkedin.com/in/delacrixmorgan/',
      },
    ],
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
    onLogout() {
      Promise.all([
        this.$store.dispatch('logoutUserTodos'),
        this.$store.dispatch('logoutUser'),
      ])
        .then(() => {
          this.isVisible = false
        })
        .catch((e) => alert(e))
    },
  },
}
</script>
