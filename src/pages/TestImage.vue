<script setup lang="ts">
import {ref} from 'vue';
import {aiRequest} from "@/hooks/aiRequest.ts";

const {query} = aiRequest()

const prompt = ref<HTMLInputElement>();
const dialogues = ref<HTMLDivElement>();
const window_location_origin = ref<string>(window.location.origin)


const commitPrompt = () => {
  if (prompt.value) {
    const div_prompt = new HTMLDivElement();
    div_prompt.innerText = prompt.value.value
    dialogues.value?.appendChild(div_prompt)
  }
  query(window_location_origin.value, prompt.value?.value)
    .then(res => {
      if (dialogues.value) {
        dialogues.value.innerText = JSON.stringify(res);
      }
    });
}


</script>

<template>
  <input ref="prompt">
  <div ref="dialogues"></div>
  <button ref="commit-prompt" @click="commitPrompt">commit</button>
</template>

<style scoped>

</style>
