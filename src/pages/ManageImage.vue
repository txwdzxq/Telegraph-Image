<script setup lang="ts">
import {nextTick, ref} from 'vue';
import axios from "axios";

const clue = ref<HTMLDivElement>();
const window_location_origin = ref<string>(window.location.origin)

interface ImgUrlArr {
  name: string;
}

const img_res_store = ref<ImgUrlArr[]>();
const img_res_index = ref<number>(0);
const img_url_arr = ref<ImgUrlArr[]>([]);
axios.get('/file/list')
  .then(res => {
      img_res_store.value = res.data;
      for (let i = 0; i < 9; i++ , img_res_index.value++) {
        if (img_res_store.value && img_res_store.value[img_res_index.value] !== undefined) {
          img_url_arr.value?.push(img_res_store.value[img_res_index.value]);
        } else {
          return;
        }
      }
    }
  ).catch(e => console.log(e))

// 触底加载
function load_on_end(msg: string) {
  console.log(msg);
  if (window.innerHeight + window.scrollY >= document.body.offsetHeight * 0.8) {
    for (let i = 0; i < 9; i++ , img_res_index.value++) {
      if (img_res_store.value && img_res_store.value[img_res_index.value] !== undefined) {
        const scrollPosition = window.scrollY;
        img_url_arr.value?.push(img_res_store.value[img_res_index.value]);
        nextTick(() => {
          window.scrollTo(0, scrollPosition);
        })
      } else {
        console.log('img_res_index', img_res_index, img_res_store.value && img_res_store.value[img_res_index.value] !== undefined,img_res_store.value);
        return;
      }
    }
  }
}

function throttle(func: () => void, wait: number) {
  let timer: NodeJS.Timeout | null = null;
  return function () {
    if (!timer) {
      timer = setTimeout(() => {
        func();
        timer = null;
      }, wait)
    }
  }
}

window.addEventListener('scroll', throttle(() => load_on_end('load pic'), 3000));

function copyImageUrl(img_path: string) {
  window.navigator.clipboard.writeText(window.location.origin + '/file/get/' + img_path);
}

function deleteImage(event: MouseEvent, img_path: string) {
  console.log('Image deleted');
  axios.delete('/file/delete/' + img_path)
    .then(res => {
        const currentElement = event.currentTarget as HTMLDivElement;
        const wrapDeleteButtonLine = currentElement.parentElement as HTMLDivElement;
        const imageContainer = wrapDeleteButtonLine.parentElement as HTMLDivElement;
        imageContainer.remove()
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
        <div class="wrap-delete-button" @click="deleteImage($event,item.name)">
          <button class="delete-button">删除</button>
        </div>
      </div>
      <img :src="window_location_origin +'/file/get/'+item.name" alt="" @click="copyImageUrl(item.name)">
    </div>
  </div>
  <transition name="fade">
    <div v-if="img_res_store && img_res_store[img_res_index] !== undefined" class="bottom-div">
      {{img_res_store[img_res_index].name}}
    </div>
  </transition>
  <div v-if="img_res_store && img_res_store[img_res_index] == undefined" class="bottom-loaded-div">已全部加载</div>
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

.bottom-div {
  height: 100vh; /* 确保页面有足够的高度进行滚动 */
  text-align: center;
}

.fade-enter-active {
  transition: 1s;
}

.fade-leave-active {
  transition: 1s;
}

.fade-enter-from {
  height: 99vh;
}

.fade-leave-to {
  height: 1vh;
}

.bottom-loaded-div {
  text-align: center;
}

</style>
