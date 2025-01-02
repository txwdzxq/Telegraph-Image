<script setup lang="ts">
import {ref} from 'vue';
import axios from "axios";

const clue = ref<HTMLDivElement>();

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

function copyImageUrl(img_path: string) {
  console.log(window.location.href + '/file/get/'+ img_path);
}
function deleteImage() {
  console.log('Image deleted');
}

</script>

<template>
  <div ref="clue" class="clue">点击图片复制地址</div>
  <div class="show_img_div">
    <div  class="image-container" v-for="item in img_url_arr" :key="item.name">
      <div class="wrap-delete-button" @click="deleteImage">
        <button class="delete-button">删除</button>
      </div>
      <img :src="'../file/get/'+item.name" alt="" @click="copyImageUrl(item.name)">
    </div>
  </div>
</template>

<style scoped>
.clue {
  text-align: center;
  font-size: xxx-large;
}

.show_img_div {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
}

img {
  max-width: 80%;
  height: auto;
}

.image-container {
  position: relative;
}

.image-container:hover .delete-button {
  display: block;
}

.wrap-delete-button{
  position: absolute;
  top: 0;
  right: 0;
  width: 54px;
  height: 38px;
  cursor: pointer;
}

.wrap-delete-button:hover .delete-button{
  background-color: darkred;
  right: -3px;
}

.delete-button {
  position: absolute;
  top: 3px;         /* 距离容器顶部10像素 */
  right: 3px;
  background-color: red;
  color: white;
  border: none;
  padding: 5px;
  z-index: 1;       /* 确保按钮在图片之上显示 */
  display: none;    /* 默认不显示按钮 */
}


</style>
