<script setup lang="ts">
import {ref} from 'vue';
import {aiRequest} from "@/hooks/aiRequest.ts";

const {query} = aiRequest()

interface dialogue {
  id: string;
  question: boolean;
  content: string[];
}

const prompt = ref<HTMLInputElement>();
const window_location_origin = ref<string>(window.location.origin)
const dialogues = ref<dialogue[]>([]);


const commitPrompt = () => {
  if (prompt.value) {
    dialogues.value.unshift({id: new Date().getTime().toString(), question: true, content: [prompt.value.value]});
  }
  query(window_location_origin.value, prompt.value?.value)
    .then(res => {
      const response_text = JSON.stringify(res[0].response)
      const text_arr = response_text.split('\\n');
      dialogues.value.unshift({id: new Date().getTime().toString(), question: false, content: text_arr});
    });
}


</script>

<template>
  <input ref="prompt">
  <div v-for="dialogue in dialogues" class="question" :class="{even: dialogue.question}" :key="dialogue.id">
    <div v-for="(content,index) in dialogue.content" :key="index">
      {{ dialogue.content }}
    </div>
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
