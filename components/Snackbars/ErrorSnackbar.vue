<template>
  <v-snackbar v-model="isVisible">
    {{ message }}

    <template v-slot:action="{ attrs }">
      <v-btn color="pink" text v-bind="attrs" @click="isVisible = false">
        Dismiss
      </v-btn>
    </template>
  </v-snackbar>
</template>

<script>
export default {
  props: {
    value: Boolean,
    message: String,
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
}
</script>
