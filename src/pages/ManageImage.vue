<script setup lang="ts">
import {nextTick, ref,} from 'vue';
import axios from "axios";

const clue = ref<HTMLDivElement>();
const show_img_div = ref<HTMLDivElement>();
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
      for (let i = 0; i < 24; i++ , img_res_index.value++) {
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
    for (let i = 0; i < 16; i++ , img_res_index.value++) {
      if (img_res_store.value && img_res_store.value[img_res_index.value] !== undefined) {
        const scrollPosition = window.scrollY;
        img_url_arr.value?.push(img_res_store.value[img_res_index.value]);
        nextTick(() => {
          window.scrollTo(0, scrollPosition);
        })
      } else {
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

window.addEventListener('scroll', throttle(() => load_on_end('load pic'), 2000));

function copyImageUrl(event: MouseEvent, img_path: string) {
  window.navigator.clipboard.writeText(window.location.origin + '/file/get/' + img_path);
  tips(event.clientX, event.clientY, '已复制');
}

function deleteImage(index: number, img_path: string) {
  console.log('Image deleted', img_path);

  axios.delete('/file/delete/' + img_path)
    .then(res => {
        img_url_arr.value?.splice(index, 1);
        if (img_res_store.value && img_res_store.value[++img_res_index.value] !== undefined) {
          let add = 0;
          if (img_res_store.value.length % 3 === 0) {
            add = 3;
          }
          if (img_res_store.value.length % 3 === 1) {
            add = 2;
          }
          if (img_res_store.value.length % 3 === 2) {
            add = 1;
          }
          for (let i = 0; i < add; i++ , img_res_index.value++) {
            if (img_res_store.value[img_res_index.value] !== undefined) {
              img_url_arr.value?.push(img_res_store.value[img_res_index.value]);
            } else {
              return;
            }
          }
        }
        console.log(res);
      }
    )
    .catch(e => console.log(e));
}

// 状态提示
function tips(x: number, y: number, ...msg_arr: string[]) {
  document.getElementById('tip_msg_div')?.remove();
  const tip_msg_div = document.createElement('div');
  tip_msg_div.className = 'tip-msg-div';
  tip_msg_div.style.position = 'absolute';
  tip_msg_div.style.padding = '10px';
  tip_msg_div.style.fontSize = '36px';
  tip_msg_div.style.whiteSpace = 'nowrap';
  tip_msg_div.style.backgroundColor = 'grey';
  tip_msg_div.style.borderRadius = '5px';
  tip_msg_div.style.display = 'inline-block';
  tip_msg_div.style.userSelect = 'none';
  tip_msg_div.style.pointerEvents = 'none';
  tip_msg_div.style.transition = 'opacity 1s ease-in, transform 1s linear';

  for (const msg of msg_arr) tip_msg_div.innerText += msg + '\u00A0'

  tip_msg_div.style.top = y + 'px';
  tip_msg_div.style.left = x + 'px';
  document.body.appendChild(tip_msg_div);

  const tip_msg_div_style_left = x - tip_msg_div.clientWidth / 2
  if (tip_msg_div_style_left < 0) {
    tip_msg_div.style.left = window.scrollX + 'px';
  } else if (tip_msg_div_style_left >= window.innerWidth - tip_msg_div.clientWidth - 20) {
    tip_msg_div.style.left = window.innerWidth - tip_msg_div.clientWidth - 20 + 'px';
  } else {
    tip_msg_div.style.left = tip_msg_div_style_left + 'px';
  }
  const tip_msg_div_style_top = y - tip_msg_div.offsetHeight - 10
  if (tip_msg_div_style_top < 0) {
    tip_msg_div.style.top = window.scrollY + y + 20 + 'px';
  } else {
    tip_msg_div.style.top = window.scrollY + tip_msg_div_style_top + 'px';
  }
  setTimeout(function () {
    tip_msg_div.style.opacity = '0'
  }, 500)
  setTimeout(function () {
    tip_msg_div.remove()
  }, 1500)
}

function isImage(url: string) {
  return /\.(jpeg|jpg|png)$/i.test(url);
}

function isVideo(url: string) {
  return /\.(gif|mp4)$/i.test(url);
}
</script>

<template>
  <div ref="clue" class="clue">点击图片复制地址</div>
  <div ref="show_img_div" class="show-img-div">
    <transition-group name="fade-image-container">
      <div class="image-container" v-for="(item,index) in img_url_arr" :key="item.name">
        <div class="wrap-delete-button-line">
          <div class="wrap-delete-button-neighbors"></div>
          <div class="wrap-delete-button" @click="deleteImage(index,item.name)">
            <button class="delete-button">删除</button>
          </div>
        </div>
        <img v-if="isImage(item.name)" :src="window_location_origin +'/file/get/'+item.name" alt=""
             @click="copyImageUrl($event,item.name)">
        <video v-if="isVideo(item.name)" autoplay muted loop>
          <source :src="window_location_origin +'/file/get/'+item.name">
        </video>
      </div>
    </transition-group>
  </div>
  <transition name="fade-bottom-div">
    <div v-if="img_res_store && img_res_store[img_res_index] !== undefined" class="bottom-div"></div>
  </transition>
  <div v-if="img_res_store && img_res_store[img_res_index] == undefined" class="bottom-loaded-div">已全部加载</div>
</template>

<style scoped>
.clue {
  text-align: center;
  font-size: xxx-large;
}

.show-img-div {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(256px, 1fr));
  gap: 1rem;
}

.image-container {
  border: 1px solid #e9bfff;
  border-radius: 20px;
  text-align: center;
}

.image-container img {
  max-width: 100%;
  height: auto;
}

.image-container video {
  max-width: 100%;
  height: auto;
}

.fade-image-container-enter-active {
  transition: 1s;
}

.fade-image-container-leave-active {
  transition: 1s;
}

.fade-image-container-enter-from {
  opacity: 1;
  transform: translateY(0);
}

.fade-enter-active {
  transition: opacity 0.5s ease, transform 0.5s ease;
}

.fade-image-container-leave-to {
  transform: translateY(20px);
  opacity: 0;
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

.tip-msg-div {
  position: absolute;
  padding: 10px;
  font-size: 36px;
  background-color: grey;
  border-radius: 5px;
  display: inline-block;
  user-select: none;
  pointer-events: none;
  transition: opacity 1s ease-in, transform 1s linear;
}

</style>
