<script setup lang="ts">
import {ref} from 'vue';
import {useRequest} from "@/hooks/useRequest.ts";

const {upload} = useRequest()

const uploadTrigger = ref<HTMLDivElement>();
const uploadTriggerStatus = ref<HTMLSpanElement>();
const uploadStatus = ref<HTMLSpanElement>();
const uploadStatusInterval = ref<HTMLDivElement>();
const uploadStatusResponse = ref<string[]>();
const selectedFiles = ref<File[]>([]);
const isDragging = ref(false);
const fileInput = ref<HTMLInputElement | null>(null);
const window_location_origin = ref<string>(window.location.origin)


const triggerFileInput = () => {
  fileInput.value?.click();
};
const onDragOver = () => {
  if (uploadTriggerStatus.value) {
    uploadTriggerStatus.value.innerText = '松开上传';
  }
  isDragging.value = true;
};
const onDragLeave = () => {
  if (uploadTriggerStatus.value) {
    uploadTriggerStatus.value.innerText = '点击或拖拽文件上传';
  }
  isDragging.value = false;
};
const onDrop = (event: DragEvent) => {
  if (uploadTriggerStatus.value) {
    uploadTriggerStatus.value.innerText = '上传中';
  }
  // stop firefox open tab
  event.preventDefault();
  event.stopPropagation();
  isDragging.value = false;
  if (event.dataTransfer && event.dataTransfer.files) {
    selectedFiles.value = Array.from(event.dataTransfer.files);
    // console.log(selectedFiles)
    upload(window.location.origin, selectedFiles.value).then(
      (res) => {
        uploadStatusResponse.value = res;
        if (uploadStatusInterval.value) {
          uploadStatusInterval.value.innerText = '上传成功点击复制';
        }
        if (uploadTriggerStatus.value) {
          uploadTriggerStatus.value.innerText = '点击或拖拽文件上传';
        }
      }
    );
    if (uploadTriggerStatus.value) {
      uploadTriggerStatus.value.innerText = '上传中';
    }
  }
};
const handlePaste = (event: ClipboardEvent) => {
  const items = event.clipboardData?.items;
  if (items) {
    console.log(items)
    selectedFiles.value = [];
    for (const item of items) {
      if (item.kind === 'file') {
        const file = item.getAsFile();
        if (file) {
          selectedFiles.value.push(file);
        }
      }
    }
    // console.log(selectedFiles)
    upload(window.location.origin, selectedFiles.value).then(
      (res) => {
        uploadStatusResponse.value = res;
        if (uploadStatusInterval.value) {
          uploadStatusInterval.value.innerText = '上传成功点击复制';
        }
        if (uploadTriggerStatus.value) {
          uploadTriggerStatus.value.innerText = '点击或拖拽文件上传';
        }
      }
    );
    if (uploadTriggerStatus.value) {
      uploadTriggerStatus.value.innerText = '上传中';
    }
  }
};

const change = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files) {
    selectedFiles.value = Array.from(target.files);
    // console.log(selectedFiles)
    upload(window.location.origin, selectedFiles.value).then(
      (res) => {
        uploadStatusResponse.value = res;
        if (uploadStatusInterval.value) {
          uploadStatusInterval.value.innerText = '上传成功点击复制';
        }
        if (uploadTriggerStatus.value) {
          uploadTriggerStatus.value.innerText = '点击或拖拽文件上传';
        }
      }
    );
    if (uploadTriggerStatus.value) {
      uploadTriggerStatus.value.innerText = '上传中';
    }
  }
};

const copyToClipboard = (event: MouseEvent) => {
  const select_element = event.currentTarget as HTMLDivElement;
  navigator.clipboard.writeText(select_element.innerText);
  if (uploadStatusInterval.value) {
    uploadStatusInterval.value.innerText = '已复制';
  }
  event.preventDefault();
  event.stopPropagation();
};

</script>
<template>
  <div ref="effectiveArea" class="effective-area" @dragover.prevent="onDragOver" @dragleave.prevent="onDragLeave"
       @drop.prevent="onDrop" @paste="handlePaste">
    <div ref="uploadTrigger" class="upload-trigger" :class="{ dragging: isDragging}" @click="triggerFileInput">
      <span ref="uploadTriggerStatus" class="upload-trigger-status">点击或拖拽文件上传</span>
      <div ref="uploadStatusInterval" class="upload-status-interval"></div>
      <div ref="uploadStatusWrap" class="upload-status-wrap">
        <div ref="uploadStatus" v-for="uploadStatusText in uploadStatusResponse" :key="uploadStatusText"
             class="upload-status" :style="{ color: uploadStatusText === '已复制' ? 'darkred' : 'black'}"
             @click="copyToClipboard">
          {{ window_location_origin + '/file/get/' + uploadStatusText }}
        </div>
      </div>
      <input ref="fileInput" type="file" @change="change" hidden="hidden" multiple>
    </div>
  </div>
</template>

<style scoped>
.effective-area {
  display: flex;
  flex: 1;
  text-align: center;
  justify-content: center;
  background-color: #cefcec;
}

.upload-trigger {
  display: flex;
  flex-direction: column;
  width: 300px;
  height: 300px;
  cursor: pointer;
  font-size: x-large;
  background-color: #e9bfff;
}

.upload-status-interval {
  display: flex;
  margin-top: auto;
  min-height: 2rem;
  flex-direction: column;
  justify-content: center;
}

.upload-status-wrap {
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

@-moz-document url-prefix() {
  .upload-status-wrap {
    /* 针对Firefox */
    scrollbar-width: auto;
    scrollbar-color: #888 transparent;
  }
}

.upload-status-wrap:hover {
  overflow-x: hidden;
  overflow-y: scroll;
}

.upload-status-wrap::-webkit-scrollbar {
  /* 设置滚动条的宽度 */
  width: 10px;
}

.upload-status-wrap::-webkit-scrollbar-track {
  /* 设置滚动条轨道背景为透明 */
  background: transparent;
}

.upload-status-wrap::-webkit-scrollbar-thumb {
  /* 设置滑块的颜色 */
  background: #888;
  /* 滑块圆角 */
  border-radius: 6px;
}

.upload-status-wrap::-webkit-scrollbar-thumb:hover {
  /* 悬停时滚动条滑块的颜色 */
  background: #666;
}

.upload-trigger-status {
  order: -1;
}

.upload-status {
  white-space: nowrap;
  margin-top: 0;
}

.upload-status:hover {
  background-color: yellow;
}

.dragging {
  background-color: #cf6969;
}

</style>
