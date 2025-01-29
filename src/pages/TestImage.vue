<script setup lang="ts">
import {ref} from 'vue';
import {aiRequest} from "@/hooks/aiRequest.ts";

const {query} = aiRequest()

const prompt = ref<HTMLInputElement>();
const result = ref<HTMLDivElement>();
const window_location_origin = ref<string>(window.location.origin)


const commitPrompt = () => {
  query(window_location_origin.value, prompt.value?.value)
    .then(res => {
      if (result.value) {
        result.value.innerText = JSON.stringify(res);
      }
    })
}


</script>

<template>
  <input ref="prompt">
  <div ref="result"></div>
  <button ref="commit-prompt" @click="commitPrompt">commit</button>
</template>

<style scoped>

</style>
