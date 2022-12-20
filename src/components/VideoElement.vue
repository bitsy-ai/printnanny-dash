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
import { useCameraSettingsStore } from "@/stores/cameraSettings";

const cameraSettings = useCameraSettingsStore();

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
    <div
      class="col-span-6 grid grid-cols-1 md:grid-cols-2"
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
    </div>
    <div class="col-span-6 flex w-full sm:border-t sm:border-gray-200" v-if="cameraSettings.form?.showDetectionGraphs">
        <PlotlyElement />
    </div>
  </div>
</template>
