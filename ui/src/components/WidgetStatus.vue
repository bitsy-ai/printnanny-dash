<template>
  <div class="flex">
    <!-- spinner -->
    <Transition
      name="fade"
      mode="out-in"
      :duration="{ enter: 800, leave: 500 }"
    >
      <TextSpinner
        v-if="
          status == ConnectionStatus.ConnectionNotStarted ||
          status == ConnectionStatus.ConnectionLoading
        "
      />
      <div
        class="flex items-center space-x-3 font-medium text-gray-600"
        v-else-if="status == ConnectionStatus.ConnectionReady"
      >
        <div
          class="bg-emerald-500 flex-shrink-0 w-2.5 h-2.5 rounded-full"
          aria-hidden="true"
        ></div>
        <span class="text-grey-600">Online</span>
      </div>
      <div
        class="flex items-center space-x-3 font-medium text-gray-600"
        v-else-if="status == ConnectionStatus.ConnectionError"
      >
        <div
          class="bg-red-500 flex-shrink-0 w-2.5 h-2.5 rounded-full"
          aria-hidden="true"
        ></div>
        <span class="text-grey-600">Error</span>
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
import { ref } from "vue";
import { ConnectionStatus } from "@/types";

const status = ref(ConnectionStatus.ConnectionReady);
</script>
