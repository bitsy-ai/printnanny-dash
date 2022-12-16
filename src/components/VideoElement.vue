<script setup lang="ts">
import { onMounted } from "vue";
import { useVideoStore } from "@/stores/video";
import { onBeforeRouteLeave } from "vue-router";
import VideoPaused from "@/assets/video-paused.svg";
import type {
  Camera,
  PlaybackVideo,
} from "@bitsy-ai/printnanny-asyncapi-models";
import TextSpinner from "@/components/TextSpinner.vue";
import VideoStatus from "@/components/status/VideoStatus.vue";
import { handleError } from "@/utils";
import PlotlyElement from "@/components/PlotlyElement.vue";

const store = useVideoStore();
store.subscribeQcDataframes();

function selectStream(stream: Camera | PlaybackVideo) {
  store.$patch({ selectedVideoSource: stream });
}

async function startStream() {
  await store
    .toggleVideoPlayer()
    .catch((e) => handleError("Failed to start stream", e));
}

onMounted(async () => {
  await store.loadCameras();
});

// stop video stream before leaving route
onBeforeRouteLeave((_to, _from) => {
  return store.stopStream();
});
</script>

<template>
  <div
    class="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6 col-span-2 grid md:grid-cols-5 grid-cols-1 gap-4"
  >
    <div div class="col-span-3 pb-4">
      <h3 class="text-base font-medium text-gray-900 mb-2">Select a Camera:</h3>
      <div v-if="store.loadingCameras">
        <text-spinner text="Looking for cameras..."></text-spinner>
      </div>
      <div
        class="rounded-md bg-yellow-50 p-4"
        v-else-if="store.cameras.length === 0"
      >
        <div class="flex">
          <div class="flex-shrink-0">
            <ExclamationTriangleIcon
              class="h-5 w-5 text-yellow-400"
              aria-hidden="true"
            />
          </div>
          <div class="ml-3">
            <h3 class="text-sm font-medium text-yellow-800">
              Warning - No Cameras Found
            </h3>
            <div class="mt-2 text-sm text-yellow-700">
              <ul role="list" class="list-disc space-y-1 pl-5">
                <li>
                  Check ribbon cable if you're using a Raspberry Pi camera
                  module
                </li>
                <li>Unplug USB camera and plug into a different port</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4" v-else>
        <a
          v-for="(stream, idx) in store.cameras"
          :key="idx"
          @click="() => selectStream(stream)"
          :class="[
            store.selectedVideoSource == stream ? 'ring ring-indigo-500' : '',
            'cursor-pointer w-full bg-gray-200 rounded-md p-4 hover:bg-gray-300 hover:border-gray-400 hover:shadow-lg',
          ]"
        >
          <img :src="VideoPaused" class="w-full" />
          <h3 class="text-base font-medium text-gray-900 text-center">
            {{ stream.label }}
          </h3>
        </a>
      </div>
      <h3 class="text-base font-medium text-gray-900 py-2">Demo Videos</h3>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <a
          v-for="(stream, idx) in store.videos"
          :key="idx"
          @click="() => selectStream(stream)"
          :class="[
            store.selectedVideoSource == stream ? 'ring ring-indigo-500' : '',
            'cursor-pointer w-full bg-gray-200 rounded-md p-4 hover:bg-gray-300 hover:border-gray-400 hover:shadow-lg',
          ]"
        >
          <img :src="stream.cover" class="w-full" />
          <h3 class="text-base font-medium text-gray-900 text-center">
            {{ stream.display_name }}
          </h3>
        </a>
      </div>
    </div>
    <div class="col-span-2 flex">
      <fieldset>
        <legend class="sr-only">Video Options</legend>
        <div class="text-base font-medium text-gray-900" aria-hidden="true">
          Video Options
        </div>
        <div class="mt-4 space-y-4">
          <div class="relative flex items-start">
            <div class="flex h-5 items-center">
              <input
                id="showOverlay"
                v-model="store.showOverlay"
                name="showOverlay"
                type="checkbox"
                class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
            </div>
            <div class="ml-3 text-sm w-full">
              <label for="showOverlay" class="font-medium text-gray-700"
                >Show Detection Overlay</label
              >
              <p class="text-gray-500">
                Draw boxes around detected objects. May cause some
                delays/stuttering in live video feed.
              </p>
            </div>
          </div>
          <div class="relative flex items-start">
            <div class="flex h-5 items-center">
              <input
                id="showOverlay"
                v-model="store.showGraph"
                name="showOverlay"
                type="checkbox"
                class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
            </div>
            <div class="ml-3 text-sm w-full">
              <label for="showOverlay" class="font-medium text-gray-700"
                >Show Detection Graphs</label
              >
              <p class="text-gray-500">
                Show a graph last 30 seconds of detection history.
              </p>
            </div>
          </div>
        </div>
      </fieldset>
    </div>
    <div
      class="col-span-6 sm:border-t sm:border-gray-200 grid grid-cols-1 md:grid-cols-2"
    >
      <div class="w-full">
        <h3
          class="text-base font-medium text-gray-900 py-2 text-center m-auto w-full"
        >
          Video Stream
        </h3>
        <VideoStatus />
        <video
          @click="startStream"
          id="janus-video"
          muted
          controls
          class="cursor-pointer aspect-video rounded-md h-80 mx-auto my-4 border-1 border-dashed border-gray-200 bg-gray-200 hover:bg-gray-300 hover:border-gray-400 hover:shadow-lg"
          aria-placeholder="Video stream is loading"
          poster="@/assets/video-paused.svg"
        />
      </div>
      <div class="w-full" v-if="store.showGraph">
        <PlotlyElement />
      </div>
    </div>
  </div>
</template>
