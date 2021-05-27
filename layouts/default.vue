<template>
  <v-app>
    <v-main>
      <v-container>
        <nuxt />
      </v-container>
    </v-main>
    <v-footer dark padless>
      <v-col class="text-center" cols="12">
        <strong>{{ title }} © </strong> {{ new Date().getFullYear() }}
      </v-col>
    </v-footer>
  </v-app>
</template>

<script>
export default {
  data() {
    return {
      title: 'Duriseo',
    }
  },
}
</script>
