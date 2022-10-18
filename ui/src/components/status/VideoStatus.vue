<template>
<div class="flex items-center">
    <!-- spinner -->
    <Transition
    name="fade"
    mode="out-in"
    :duration="{ enter: 800, leave: 500 }"
    >
    <div
        class="flex items-center space-x-3 font-medium text-gray-600 m-auto"
        v-if="store.status == ConnectionStatus.ConnectionLoading"
    >
    <TextSpinner text="Loading video stream"
    />
    </div>
    <div
        class="flex items-center space-x-3 font-medium text-gray-600 m-auto"
        v-else-if="store.status == ConnectionStatus.ConnectionNotStarted"
    >
        <div
        class="bg-emerald-500 flex-shrink-0 w-2.5 h-2.5 rounded-full"
        aria-hidden="true"
        ></div>
        <span class="text-grey-600">Click video player ☝️ to start the selected stream</span>
    </div>
    <div
        class="flex items-center space-x-3 font-medium text-gray-600 m-auto"
        v-else-if="store.status == ConnectionStatus.ConnectionReady"
    >
        <div
        class="bg-emerald-500 flex-shrink-0 w-2.5 h-2.5 rounded-full"
        aria-hidden="true"
        ></div>
        <span class="text-grey-600">Connected to {{ hostname }}. Click video player ☝️ to stop stream.</span>
    </div>
    <div
        class="flex items-center space-x-3 font-medium text-gray-600 m-auto"
        v-else-if="store.status == ConnectionStatus.ConnectionError"
    >
        <div
        class="bg-red-500 flex-shrink-0 w-2.5 h-2.5 rounded-full m-auto"
        aria-hidden="true"
        ></div>
        <span class="text-grey-600">Error connecting to {{ hostname }}. Click video player ☝️ to retry.</span>
    </div>
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
import TextSpinner from "@/components/TextSpinner.vue";

const hostname = window.location.hostname;
const store = useVideoStore();
</script>
