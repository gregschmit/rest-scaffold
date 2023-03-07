<script lang="ts">
import { API } from "./api"
import Spinner from "./components/Spinner.vue"
import type { Args } from "./config"
import { is } from "@babel/types"

export default {
  props: {
    args: { type: Object as () => Args, required: true },
  },
  components: {
    Spinner,
  },

  data() {
    return {
      isLoaded: false,
      api: null,
    } as {
      isLoaded: boolean
      api: API | null
    }
  },
  async mounted() {
    this.api = new API(this.args)
    await this.api.initialize()
  },
}
</script>

<template>
  <div>
    <div>{{ JSON.stringify($props) }}</div>
    <div v-if="isLoaded"></div>
    <Spinner v-else />
  </div>
</template>

<style scoped></style>
