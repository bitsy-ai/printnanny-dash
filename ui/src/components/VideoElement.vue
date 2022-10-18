<script setup lang="ts">
import { useEventStore, VIDEO_STREAMS } from "@/stores/events";
import { ConnectionStatus } from "@/types";
import {
  Listbox,
  ListboxButton,
  ListboxOptions,
  ListboxOption,
  ListboxLabel,
} from "@headlessui/vue";
import { ChevronUpDownIcon, CheckIcon } from "@heroicons/vue/24/outline";
import TextSpinner from "@/components/TextSpinner.vue";
const store = useEventStore();
store.subscribeQcDataframes();

function selectStream(idx: number) {
  store.$patch({ selectedVideoStream: idx });
}

function toggleVideoPlayer() {
  console.log("toggling video player");
}
</script>

<template>
  <div
    class="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6 col-span-2 grid md:grid-cols-5 grid-cols-1"
  >
    <div div class="col-span-2">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <a
          v-for="(stream, idx) in VIDEO_STREAMS"
          @click="() => selectStream(idx)"
          :class="[
            store.selectedVideoStream == idx ? 'ring ring-indigo-500' : '',
            'cursor-pointer w-full bg-gray-200 rounded-md p-4 hover:bg-gray-300 hover:border-gray-400 hover:shadow-lg',
          ]"
        >
          <img :src="stream.cover" class="w-full" />
          <h3 class="text-md font-medium leading-6 text-gray-900 text-center">
            {{ stream.name }}
          </h3>
        </a>
      </div>
    </div>
    <div class="col-span-3">
      <h3 class="text-lg font-medium leading-6 text-gray-900 text-center">
        Video Stream
      </h3>

      <video
        @click="toggleVideoPlayer"
        id="janus-video"
        muted
        class="cursor-pointer aspect-video rounded-md h-80 mx-auto my-4 border-1 border-dashed border-gray-200 bg-gray-200 hover:bg-gray-300 hover:border-gray-400 hover:shadow-lg"
        aria-placeholder="Video stream is loading"
        poster="@/assets/video-paused.svg"
      />
    </div>
  </div>
</template>
