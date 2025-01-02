<script setup lang="ts">
import {ref} from 'vue';
import axios from "axios";

const manage = ref<HTMLDivElement>();

interface ImgUrlArr {
  name: string;
}
const img_res_store = ref<ImgUrlArr[]>();
let img_res_index = 0;
const img_url_arr = ref<ImgUrlArr[]>([]);
axios.get('/file/list')
  .then(
    res => {
      img_res_store.value = res.data;
      for (let i = 0; i < 9; i++ , img_res_index++) {
        if (img_res_store.value && img_res_store.value[img_res_index] !== undefined) {
          img_url_arr.value?.push(img_res_store.value[img_res_index]);
        } else {
          break;
        }
      }
    }
  ).catch(e => console.log(e))

// 触底加载
window.addEventListener('scroll', () => {
  if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
    for (let i = 0; i < 9; i++ , img_res_index++) {
      if (img_res_store.value && img_res_store.value[img_res_index] !== undefined) {
        img_url_arr.value?.push(img_res_store.value[img_res_index]);
      } else {
        break;
      }
    }
  }
});
</script>

<template>
  <div ref="manage">manage</div>
  <div class="show_img">
    <div v-for="item in img_url_arr" :key="item.name">
      <img :src="'../file/get/'+item.name" alt="">
    </div>
  </div>
</template>

<style scoped>
.show_img {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
}

img {
  max-width: 80%;
  height: auto;
}
</style>
