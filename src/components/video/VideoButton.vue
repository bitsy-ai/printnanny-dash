<template>
  <div class="flex items-center">
    <!-- spinner -->
    <Transition
      name="fade"
      mode="out-in"
      :duration="{ enter: 800, leave: 500 }"
    >
      <!-- various loading states -->

      <button
        v-if="store.status == ConnectionStatus.ConnectionLoading"
        disabled
        class="ml-3 inline-flex disabled:opacity-25 justify-center focus:outline-none rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm"
      >
        Loading...
      </button>

      <button
        disabled
        v-else-if="store.status == ConnectionStatus.ConnectionClosing"
        class="ml-3 inline-flex disabled:opacity-25 justify-center focus:outline-none rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm"
      >
        Stopping...
      </button>

      <!-- camera service is offline -->
      <button
        @click="store.startStream"
        v-else-if="store.status == ConnectionStatus.ServiceNotStarted"
        class="ml-3 inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
      >
        <VideoCameraIcon class="w-5 h-5 mr-2"></VideoCameraIcon>
        Start Camera
      </button>

      <!-- camera service is active -->
      <button
        @click="store.stopStream"
        v-else-if="store.status == ConnectionStatus.ConnectionReady"
        class="ml-3 inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
      >
        <VideoCameraIcon class="w-5 h-5 mr-2"></VideoCameraIcon>
        Stop Camera
      </button>
    </Transition>
  </div>
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
import { ConnectionStatus } from "@/types";
import { useVideoStore } from "@/stores/video";
import { VideoCameraIcon } from "@heroicons/vue/20/solid";

const store = useVideoStore();
</script>
