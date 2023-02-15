<template>
  <Transition name="fade" mode="out-in" :duration="{ enter: 800, leave: 500 }">
    <div
      class="flex items-center justify-center space-x-3 font-medium text-gray-600 m-auto"
      v-if="loading"
    >
      <TextSpinner text="" class="text-gray-500 stroke-gray-500" />
    </div>
    <div
      class="flex items-center space-x-3 font-medium text-gray-600 m-auto"
      v-else-if="store.cameraStatus?.recording"
    >
      <PlayCircleIcon
        class="text-red-500 flex-shrink-0 w-5 h-5"
        aria-hidden="true"
        alt="Recording in progress"
      ></PlayCircleIcon>
    </div>
    <div
      class="flex items-center space-x-3 font-medium text-gray-600 m-auto"
      v-else-if="store.cameraStatus?.streaming"
    >
      <VideoCameraIcon
        class="text-green-500 flex-shrink-0 w-5 h-5"
        aria-hidden="true"
        alt="Camera stream active"
      ></VideoCameraIcon>
    </div>
    <div
      class="flex items-center space-x-3 font-medium text-gray-600 m-auto"
      v-else
    >
      <PauseCircleIcon
        class="text-amber-500 flex-shrink-0 w-5 h-5"
        aria-hidden="true"
        alt="Camera stream is paused"
      ></PauseCircleIcon>
    </div>
  </Transition>
</template>
<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
<script setup lang="ts">
import { onMounted, ref } from "vue";
import {
  PlayCircleIcon,
  VideoCameraIcon,
  PauseCircleIcon,
} from "@heroicons/vue/20/solid";
import { ConnectionStatus } from "@/types";
import { useVideoStore } from "@/stores/video";
import TextSpinner from "@/components/TextSpinner.vue";

const store = useVideoStore();
const loading = ref(true);

onMounted(async () => {
  await store.loadCameraStatus();
  loading.value = false;
});
</script>
