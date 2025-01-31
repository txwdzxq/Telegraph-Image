<script setup lang="ts">
import {ref} from 'vue';
import {aiRequest} from "@/hooks/aiRequest.ts";

const {query} = aiRequest()

interface dialogue {
  id: string;
  question: boolean;
  loading?: boolean;
  content: string[];
}

const message = ref<HTMLTextAreaElement>();
const window_location_origin = ref<string>(window.location.origin)
const dialogues = ref<dialogue[]>([]);

const commitMessage = () => {
  if (message.value) {
    if (message.value.value === undefined || message.value.value === '' || message.value.value.trim() === '') return
    const message_text = message.value.value;
    dialogues.value.push({id: new Date().getTime().toString(), question: true, content: [message_text]});
    message.value.value = '';
    dialogues.value.push({
      id: new Date().getTime().toString(),
      question: false,
      loading: true,
      content: ['']
    });
    query(window_location_origin.value, message_text)
      .then(res => {
        // const response_text = res[0].response.response;
        // const text_arr = response_text.split('\n');
        dialogues.value.pop();
        // dialogues.value.push({id: new Date().getTime().toString(), question: false, content: text_arr});
        dialogues.value.push({id: new Date().getTime().toString(), question: false, content: [JSON.stringify(res)]});
      });
  }
}

</script>

<template>
  <div class="deepseek-warp">
    <div class="dialogues-warp">
      <div v-for="dialogue in dialogues" class="question" :class="{even: dialogue.question}" :key="dialogue.id">
        <div v-for="(content,index) in dialogue.content" class="cell" :key="index"
             :class="{'even-cell': dialogue.question,loader: dialogue.loading}">
          {{ content }}
        </div>
      </div>
    </div>
    <div class="message-warp">
      <textarea ref="message" class="message" @keydown.enter.exact.prevent="commitMessage"></textarea>
      <button ref="commit-message" class="commit-message" @click="commitMessage">commit</button>
    </div>
  </div>
</template>

<style scoped>
.deepseek-warp {
  display: flex;
  min-height: 86vh;
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
}

.even {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.cell {
  display: flex;
}

.even-cell {
  /* 背景颜色 */
  background-color: #f0f0f0;
  /* 圆角半径 */
  border-radius: 15px;
  /* 内边距 */
  padding: 15px;
}

.message-warp {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.message {
  font-size: 32px;
  width: 60vw;
  border-radius: 4px;
  height: auto;
  min-height: 1em;
  max-height: 6em;
  resize: none;
}

.commit-message {
  font-size: 32px;
  width: 20vw;
}

/* Loader样式 */
.loader {
  /* 灰色背景 */
  border: 8px solid #f3f3f3;
  /* 圆形 */
  border-radius: 50%;
  /* 蓝色顶部边框 */
  border-top: 8px solid #3498db;
  /* 宽度 */
  width: 40px;
  /* 高度 */
  height: 40px;
  /* 旋转动画 */
  animation: spin 2s linear infinite;
}

/* 旋转动画关键帧 */
@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

</style>
