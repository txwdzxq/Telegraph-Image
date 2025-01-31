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
      const response_text = res[0].response.response;
      const text_arr = response_text.split('\n');
      dialogues.value.unshift({id: new Date().getTime().toString(), question: false, content: text_arr});
    });
}

</script>

<template>
  <div class="deepseek-warp">
    <div class="dialogues-warp">
      <div v-for="dialogue in dialogues" class="question" :class="{even: dialogue.question}" :key="dialogue.id">
        <div v-for="(content,index) in dialogue.content" class="cell" :key="index">
          {{ content }}
        </div>
      </div>
    </div>
    <div class="prompt-warp">
      <input ref="prompt" class="prompt">
      <button ref="commit-prompt" class="commit-prompt" @click="commitPrompt">commit</button>
    </div>
  </div>
</template>

<style scoped>
.deepseek-warp {
  display: flex;
  height: 80vh;
  flex-direction: column;
  justify-content: flex-end;
}

.dialogues-warp {
  display: flex;
  flex-direction: column;
  font-size: 32px;
}

.question {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  /* 背景颜色 */
  background-color: #f0f0f0;
  /* 圆角半径 */
  border-radius: 15px;
  /* 内边距 */
  padding: 15px;
}

.even {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.cell {
  display: flex;
}

.prompt-warp {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.prompt {
  font-size: 32px;
  width: 60vw;
}

.commit-prompt {
  font-size: 32px;
  width: 20vw;
}
</style>
