<template>
  <div class="flex">
    <!-- spinner -->
    <Transition
      name="fade"
      mode="out-in"
      :duration="{ enter: 800, leave: 500 }"
    >
      <TextSpinner
        text="Syncing"
        class="text-sm font-medium"
        v-if="
          nats.status == ConnectionStatus.ConnectionNotStarted ||
          nats.status == ConnectionStatus.ConnectionLoading
        "
      />
      <div
        class="flex items-center space-x-3  text-sm font-medium text-gray-600"
        v-else-if="nats.status == ConnectionStatus.ConnectionReady"
      >
        <div
          class="bg-emerald-500 flex-shrink-0 w-2.5 h-2.5 rounded-full"
          aria-hidden="true"
        ></div>
        <span class="text-grey-600">Synced</span>
      </div>
      <div
        class="flex items-center space-x-3 text-sm font-medium text-gray-600"
        v-else-if="nats.status == ConnectionStatus.ConnectionError"
      >
        <div
          class="bg-red-500 flex-shrink-0 w-2.5 h-2.5 text-sm font-medium rounded-full"
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
import { onMounted } from "vue";
import { ConnectionStatus } from "@/types";
import TextSpinner from "@/components/TextSpinner.vue";
import { useCloudStore } from "@/stores/cloud";
import { useNatsStore } from "@/stores/nats";
const cloud = useCloudStore();
const nats = useNatsStore();

onMounted(async () => {
  await cloud.connectCloudAccount();
});
</script>
