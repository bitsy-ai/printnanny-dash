<script setup lang="ts">
import { onMounted } from "vue";
import { useVideoStore } from "@/stores/video";
import { onBeforeRouteLeave } from "vue-router";
import VideoButton from "@/components/video/VideoButton.vue";
import VideoStatus from "@/components/video/VideoStatus.vue";
import { handleError } from "@/utils";
import PlotlyElement from "@/components/PlotlyElement.vue";
import { useCameraSettingsStore } from "@/stores/cameraSettings";
import { Cog6ToothIcon } from "@heroicons/vue/20/solid";

const cameraSettings = useCameraSettingsStore();

const store = useVideoStore();
store.subscribeQcDataframes();

async function startStream() {
  await store
    .toggleVideoPlayer()
    .catch((e) => handleError("Failed to start stream", e));
}

onMounted(async () => {
  await store.load();
  await cameraSettings.loadSettings();
});

const pageTitle = "📷 PrintNanny Cam";

// stop video stream before leaving route
onBeforeRouteLeave((_to, _from) => {
  return store.stopStream();
});
</script>

<template>
  <div>
    <header>
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h1 class="text-3xl font-bold text-gray-900 prose">{{ pageTitle }}</h1>
      </div>
    </header>
    <main>
      <div
        class="overflow-hidden rounded-lg mt-4 bg-white px-4 py-5 shadow sm:p-6 col-span-2 grid md:grid-cols-5 grid-cols-1 gap-4"
      >
        <div class="col-span-6">
          <div class="flex grid grid-cols-1">
            <VideoStatus />
            <div class="flex w-full items-center justify-center">
              <VideoButton class="m-2" />
              <router-link :to="{ name: 'camera-settings' }">
                <button
                  class="rounded-md border inline-flex border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  <Cog6ToothIcon class="w-5 h-5 mr-2"></Cog6ToothIcon>
                  Settings
                </button>
              </router-link>
            </div>
            <video
              @click="startStream"
              id="janus-video"
              muted
              controls
              class="cursor-pointer aspect-video rounded-md h-80 mx-auto my-4 border-1 border-dashed border-gray-200 bg-gray-200 hover:bg-gray-300 hover:border-gray-400 hover:shadow-lg"
              aria-placeholder="Video stream is loading"
              poster="@/assets/video-paused.svg"
            />
            <span
              v-if="store.currentVideoRecording?.mp4_file_name"
              class="text-center font-medium text-gray-600"
              >Recording to
              {{ store.currentVideoRecording?.mp4_file_name }}</span
            >
          </div>
        </div>
        <div class="col-span-6 flex w-full sm:border-t sm:border-gray-200">
          <PlotlyElement />
        </div>
      </div>
    </main>
  </div>
</template>
