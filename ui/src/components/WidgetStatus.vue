<template>
    <!-- spinner -->
    <Transition
      name="fade"
      mode="out-in"
      :duration="{ enter: 800, leave: 500 }"
    >
      <TextSpinner v-if="(item.unit === undefined && item.error === undefined)" />
      <div
        class="flex items-center space-x-3 font-medium text-gray-600 justify-self-start"
        v-else-if="item.unit?.active_state == SystemdUnitActiveState.ACTIVE "
      >
        <div
          class="bg-emerald-500 flex-shrink-0 w-2.5 h-2.5 rounded-full"
          aria-hidden="true"
        ></div>
        <span class="text-grey-600">Active</span>
      </div>
      <div
        class="flex items-center space-x-3 font-medium text-gray-600 justify-self-start"
        v-else-if="(item.unit?.active_state == SystemdUnitActiveState.INACTIVE)"
      >
        <div
          class="bg-amber-500 flex-shrink-0 w-2.5 h-2.5 rounded-full"
          aria-hidden="true"
        ></div>
        <span class="text-grey-600">Inactive</span>
      </div>
      <div
        class="flex items-center space-x-3 font-medium text-gray-600 justify-self-start"
        v-else-if="item.error !== undefined"
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
import { SystemdUnitStatus } from "@/types";

import { SystemdUnitActiveState } from '@bitsy-ai/printnanny-asyncapi-models';


defineProps({
  item: {
    type: Object as PropType<WidgetItem>,
    required: true,
  },
});
</script>
