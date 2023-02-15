<template>
  <Transition name="fade" mode="out-in" :duration="{ enter: 800, leave: 500 }">
    <div
      class="flex items-center justify-center space-x-3 font-medium text-gray-600 m-auto"
      v-if="loading"
    >
      <TextSpinner
        text=""
        class="text-gray-500 stroke-gray-500"
      />
    </div>
    <div
      class="flex items-center space-x-3 font-medium text-gray-600 m-auto"
      v-else-if="store.cameraStatus?.recording"
    >
      <VideoCameraIcon class="bg-red-500 flex-shrink-0 w-2.5 h-2.5 rounded-full" aria-hidden="true" alt="Recording in progress"></VideoCameraIcon>
      <div
        class="bg-red-500 flex-shrink-0 w-2.5 h-2.5 rounded-full"
        aria-hidden="true"
      ></div>
    </div>
    <div
      class="flex items-center space-x-3 font-medium text-gray-600 m-auto"
      v-else-if="store.cameraStatus?.streaming"
    >
      <VideoCameraIcon class="bg-green-500 flex-shrink-0 w-2.5 h-2.5 rounded-full" aria-hidden="true" alt="Camera stream active"></VideoCameraIcon>
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
import { VideoCameraIcon } from "@heroicons/vue/20/solid";
import { ConnectionStatus } from "@/types";
import { useVideoStore } from "@/stores/video";
import TextSpinner from "@/components/TextSpinner.vue";

const store = useVideoStore();
const loading = ref(true);
onMounted(async () => {
    await store.loadCameraStatus();
    loading.value = false
})
</script>
