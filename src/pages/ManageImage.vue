<script setup lang="ts">
import {ref} from 'vue';
import axios from "axios";

const clue = ref<HTMLDivElement>();
const window_location_origin = ref<string>(window.location.origin)

interface ImgUrlArr {
  name: string;
}

const img_res_store = ref<ImgUrlArr[]>();
let img_res_index = 0;
const img_url_arr = ref<ImgUrlArr[]>([]);
axios.get('/file/list')
  .then(res => {
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
  window.navigator.clipboard.writeText(window.location.origin + '/file/get/' + img_path);
}

function deleteImage(img_path: string) {
  console.log('Image deleted');
  axios.delete('/file/delete/' + img_path)
    .then(res => {
        console.log(res);
      }
    )
    .catch(e => console.log(e));
}

</script>

<template>
  <div ref="clue" class="clue">点击图片复制地址</div>
  <div class="show_img_div">
    <div class="image-container" v-for="item in img_url_arr" :key="item.name">
      <div class="wrap-delete-button-line">
        <div class="wrap-delete-button-neighbors"></div>
        <div class="wrap-delete-button" @click="deleteImage(item.name)">
          <button class="delete-button">删除</button>
        </div>
      </div>
      <img :src="window_location_origin +'/file/get/'+item.name" alt="" @click="copyImageUrl(item.name)">
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
  display: grid;
  opacity: 1;
}

.wrap-delete-button-line {
  display: flex;
  box-sizing: border-box;
  transform: translate(0%, 100%);
}

.wrap-delete-button-neighbors {
  flex: 1;
}

.wrap-delete-button {
  cursor: pointer;
  box-sizing: border-box;
  width: auto;
  height: auto;
}

.wrap-delete-button:hover .delete-button {
  background-color: darkred;
  transform: translateX(3px);
}

.delete-button {
  background-color: red;
  color: white;
  font-size: x-large;
  border: none;
  padding: 5px;
  opacity: 0;
}

</style>
