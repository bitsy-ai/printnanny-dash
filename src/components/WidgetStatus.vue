<template>
  <!-- spinner -->
  <Transition name="fade" mode="out-in" :duration="{ enter: 800, leave: 500 }">
    <TextSpinner v-if="store.loading" class="text-gray-500 stroke-gray-500" />
    <div
      class="flex items-center space-x-3 font-medium text-gray-600 justify-self-start"
      v-else-if="store.unit?.active_state == SystemdUnitActiveState.ACTIVE"
    >
      <div
        class="bg-emerald-500 flex-shrink-0 w-2.5 h-2.5 rounded-full"
        aria-hidden="true"
      ></div>
      <span class="text-grey-600">Active</span>
    </div>
    <div
      class="flex items-center space-x-3 font-medium text-gray-600 justify-self-start"
      v-else-if="store.unit?.active_state == SystemdUnitActiveState.ACTIVATING"
    >
      <div
        class="bg-blue-500 flex-shrink-0 w-2.5 h-2.5 rounded-full"
        aria-hidden="true"
      ></div>
      <span class="text-grey-600">Starting</span>
    </div>
    <div
      class="flex items-center space-x-3 font-medium text-gray-600 justify-self-start"
      v-else-if="store.unit?.active_state == SystemdUnitActiveState.DEACTIVATING"
    >
      <div
        class="bg-blue-500 flex-shrink-0 w-2.5 h-2.5 rounded-full"
        aria-hidden="true"
      ></div>
      <span class="text-grey-600">Stopping</span>
    </div>
    <div
      class="flex items-center space-x-3 font-medium text-gray-600 justify-self-start"
      v-else-if="store.unit?.active_state == SystemdUnitActiveState.INACTIVE"
    >
      <div
        class="bg-amber-500 flex-shrink-0 w-2.5 h-2.5 rounded-full"
        aria-hidden="true"
      ></div>
      <span class="text-grey-600">Inactive</span>
    </div>
    <!-- show error only if unit is loaded-->
    <div
      class="flex items-center space-x-3 font-medium text-gray-600 justify-self-start"
      v-else-if="
        store.error !== null &&
        store.unit?.load_state == SystemdUnitLoadState.LOADED
      "
    >
      <div
        class="bg-red-500 flex-shrink-0 w-2.5 h-2.5 rounded-full"
        aria-hidden="true"
      ></div>
      <span class="text-grey-600">Error</span>
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
import type { PropType } from "vue";
import type { WidgetItem } from "@/types";
import TextSpinner from "@/components/TextSpinner.vue";
import {
  SystemdUnitActiveState,
  SystemdUnitLoadState,
} from "@bitsy-ai/printnanny-asyncapi-models";
import { useSystemdServiceStore } from "@/stores/systemdService";

const props = defineProps({
  item: {
    type: Object as PropType<WidgetItem>,
    required: true,
  },
});

const store = useSystemdServiceStore(props.item, false);
</script>
