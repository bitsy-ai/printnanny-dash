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
        :disabled="store.cameraButtonDisabled"
        @click="store.cameraButtonAction"
        class="disabled:cursor-not-allowed disabled:opacity-50 ml-3 inline-flex justify-center focus:outline-none rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm"
      >
        <TextSpinner
          text="Loading..."
          class="w-full stroke-white text-white"
          color="white"
          v-if="store.cameraButtonText === 'loading'"
        ></TextSpinner>
        <VideoCameraIcon class="w-5 h-5 mr-2" v-else></VideoCameraIcon>

        {{ store.cameraButtonText }}
      </button>
    </Transition>
    <Transition
      name="fade"
      mode="out-in"
      :duration="{ enter: 800, leave: 500 }"
    >
      <!-- camera service is active and recording is not active -->
      <button
        @click="store.startRecording"
        v-if="store.videoRecordingLoading"
        class="ml-3 inline-flex justify-center rounded-md border border-transparent bg-red-500 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2"
      >
        <TextSpinner
          text="Loading..."
          class="w-full stroke-white text-white"
          color="white"
        ></TextSpinner>
      </button>
      <button
        @click="store.startRecording"
        v-else-if="
          store.videoRecordingButtonShowStart &&
          store.videoRecordingButtonEnabled
        "
        class="ml-3 inline-flex justify-center rounded-md border border-transparent bg-red-500 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2"
      >
        <PlayCircleIcon class="w-5 h-5 mr-2"></PlayCircleIcon>
        {{ store.videoRecordingButtonText }}
      </button>
      <button
        @click="store.stopRecording"
        v-else-if="
          !store.videoRecordingButtonShowStart &&
          store.videoRecordingButtonEnabled
        "
        class="ml-3 inline-flex justify-center rounded-md border border-transparent bg-red-500 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2"
      >
        <StopCircleIcon class="w-5 h-5 mr-2"></StopCircleIcon>
        {{ store.videoRecordingButtonText }}
      </button>
      <button
        disabled
        v-else
        class="disabled:cursor-not-allowed disabled:opacity-50 ml-3 inline-flex justify-center rounded-md border border-transparent bg-red-500 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2"
      >
        <PlayCircleIcon class="w-5 h-5 mr-2"></PlayCircleIcon>
        Start Recording
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
import TextSpinner from "@/components/TextSpinner.vue";
import { ConnectionStatus } from "@/types";
import { useVideoStore } from "@/stores/video";
import {
  PlayCircleIcon,
  StopCircleIcon,
  VideoCameraIcon,
} from "@heroicons/vue/20/solid";

const store = useVideoStore();
</script>
