<script setup lang="ts">
import {ref} from 'vue';
import {aiRequest} from "@/hooks/aiRequest.ts";

const {query} = aiRequest()

interface dialogue {
  id: string;
  question: boolean;
  text: string;
}

const prompt = ref<HTMLInputElement>();
const window_location_origin = ref<string>(window.location.origin)
const dialogues = ref<dialogue[]>([]);


const commitPrompt = () => {
  if (prompt.value) {
    dialogues.value.unshift({id: new Date().getTime().toString(), question: true, text: prompt.value.value});
  }
  query(window_location_origin.value, prompt.value?.value)
    .then(res => {
      dialogues.value.unshift({id: new Date().getTime().toString(), question: false, text: JSON.stringify(res[0].response)});
    });
}


</script>

<template>
  <input ref="prompt">
  <div v-for="dialogue in dialogues" class="question" :class="{even: dialogue.question}" :key="dialogue.id">
    {{ dialogue.text }}
  </div>
  <button ref="commit-prompt" @click="commitPrompt">commit</button>
</template>

<style scoped>
.question {
  display: flex;
  justify-content: flex-start;
  padding: 5px;
}

.even {
  justify-content: flex-end;
}
</style>
