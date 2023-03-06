<script setup lang="ts">
import Spinner from "./components/Spinner.vue"
import { reactive, ref, onMounted } from "vue"

const props = defineProps(["target", "apiType", "debug"])
const isLoaded = ref(false)

onMounted(() => {})
</script>

<template>
  <Spinner />
  <div>{{ JSON.stringify(props) }}</div>
</template>

<style scoped></style>
