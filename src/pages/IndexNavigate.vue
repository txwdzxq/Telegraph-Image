<script setup lang="ts">
import {RouterLink} from "vue-router";

const logoutTrigger = () => {
  window.location.href = '/logout_request'
}
</script>

<template>
  <div class="index-navigate">
    <div class="navigate-item">
      <div class="spacer"></div>
      <RouterLink to="/"><span>上传图片</span></RouterLink>
      <RouterLink :to="{name: 'manage-image'}"><span>管理图片</span></RouterLink>
      <RouterLink :to="{name: 'test-image'}"><span>测试1</span></RouterLink>
      <div class="spacer"></div>
      <button class="logout" ref="logout" @click="logoutTrigger"><span>Logout</span></button>
    </div>
  </div>
</template>

<style scoped>
.index-navigate {
  display: flex;
  height: 5vh;
  min-height: 60px;
  text-align: center;
  align-items: center;
  font-size: xx-large;
}

.navigate-item {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  flex: auto;
  margin: auto;
}

.logout {
  display: inline;
  height: 50px;
  margin-left: 0;
}

.spacer {
  flex: 1;
}

span {
  padding: 0 20px 0 20px;
}
</style>
