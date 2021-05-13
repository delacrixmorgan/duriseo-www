<template>
  <v-dialog
    v-model="isVisible"
    max-width="300"
    @keydown.esc="isVisible = false"
  >
    <v-card>
      <v-card-text class="pa-4">Are you sure you want to logout?</v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="error" text @click.native="onLogout">Logout</v-btn>
        <v-btn color="grey" text @click.stop="isVisible = false">Cancel</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: {
    value: Boolean,
  },
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
      this.$store
        .dispatch('logoutUser')
        .then(() => {
          this.isVisible = false
        })
        .catch((e) => alert(e))
    },
  },
}
</script>
