<script setup lang="ts">
import {ref} from 'vue';
import {aiRequest} from "@/hooks/aiRequest.ts";

const {query} = aiRequest()

interface dialogue {
  id: string;
  text: string;
}

const prompt = ref<HTMLInputElement>();
const window_location_origin = ref<string>(window.location.origin)
const dialogues = ref<dialogue[]>([]);


const commitPrompt = () => {
  if (prompt.value) {
    dialogues.value.push({id: new Date().getTime().toString(), text: prompt.value.value});
  }
  query(window_location_origin.value, prompt.value?.value)
    .then(res => {
      dialogues.value.push({id: new Date().getTime().toString(), text: JSON.stringify(res)});
    });
}


</script>

<template>
  <input ref="prompt">
  <div v-for="dialogue in dialogues" :key="dialogue.id">{{ dialogue.text }}</div>
  <button ref="commit-prompt" @click="commitPrompt">commit</button>
</template>

<style scoped>

</style>
