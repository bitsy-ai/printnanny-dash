<template>
  <Transition name="fade" mode="out-in" :duration="{ enter: 800, leave: 500 }">
    <div
      class="flex items-center justify-center space-x-3 font-medium text-gray-600 m-auto"
      v-if="store.status == ConnectionStatus.ConnectionLoading && showLoading"
    >
      <TextSpinner
        text="Loading video..."
        class="text-gray-500 stroke-gray-500"
      />
    </div>
    <div
      class="flex items-center space-x-3 font-medium text-gray-600 m-auto"
      v-else-if="
        store.status == ConnectionStatus.ConnectionClosing && showLoading
      "
    >
      <TextSpinner
        text="Stopping video..."
        class="text-gray-500 stroke-gray-500"
      />
    </div>
    <div
      class="flex items-center space-x-3 font-medium text-gray-600 m-auto"
      v-else-if="store.status == ConnectionStatus.ServiceNotStarted"
    >
      <div
        class="bg-amber-500 flex-shrink-0 w-2.5 h-2.5 rounded-full"
        aria-hidden="true"
      ></div>
      <span class="text-grey-600" v-if="!compact">Camera is Offline</span>
    </div>
    <div
      class="flex items-center space-x-3 font-medium text-gray-600 m-auto"
      v-else-if="store.status == ConnectionStatus.ConnectionReady"
    >
      <div
        class="bg-emerald-500 flex-shrink-0 w-2.5 h-2.5 rounded-full"
        aria-hidden="true"
      ></div>
      <span class="text-grey-600" v-if="!compact">Camera is Active</span>
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
import { ConnectionStatus } from "@/types";
import { useVideoStore } from "@/stores/video";
import TextSpinner from "@/components/TextSpinner.vue";

const store = useVideoStore();

defineProps({
  compact: {
    default: false,
  },
  showLoading: {
    default: true,
  },
});
</script>
