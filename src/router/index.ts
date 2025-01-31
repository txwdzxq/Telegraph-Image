import {createRouter, createWebHistory} from 'vue-router'
import UploadImage from "@/pages/UploadImage.vue";
import ManageImage from "@/pages/ManageImage.vue";
import AiQuestion from "@/pages/AiQuestion.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      redirect: '/upload'
    }, {
      path: '/upload',
      name: 'upload',
      component: UploadImage
    },
    {
      path: '/manage',
      name: 'manage-image',
      component: ManageImage
    },
    {
      path: '/ai',
      name: 'ai-question',
      component: AiQuestion
    }
  ]
});

export default router;
