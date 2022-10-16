<template>
  <div class="flex">
    <!-- spinner -->
    <Transition
      name="fade"
      mode="out-in"
      :duration="{ enter: 800, leave: 500 }"
    >
      <TextSpinner v-if="item.status == SystemdUnitStatus.Unknown" />
      <div
        class="flex items-center space-x-3 font-medium text-gray-600"
        v-else-if="item.status == SystemdUnitStatus.Active"
      >
        <div
          class="bg-emerald-500 flex-shrink-0 w-2.5 h-2.5 rounded-full"
          aria-hidden="true"
        ></div>
        <span class="text-grey-600">Online</span>
      </div>
      <div
        class="flex items-center space-x-3 font-medium text-gray-600"
        v-else-if="item.status == SystemdUnitStatus.Inactive"
      >
        <div
          class="bg-amber-500 flex-shrink-0 w-2.5 h-2.5 rounded-full"
          aria-hidden="true"
        ></div>
        <span class="text-grey-600">Inactive</span>
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
import { ref, watch } from "vue";
import type { PropType } from "vue";
import type { WidgetItem, SystemctlCommandResponse } from "@/types";
import TextSpinner from "@/components/TextSpinner.vue";
import { SystemdUnitStatus } from "@/types";
import { useWidgetStore } from "@/stores/widgets";

const props = defineProps({
  item: {
    type: Object as PropType<WidgetItem>,
    required: true,
  },
});
const store = useWidgetStore();
const idx = store.items.find(el => el.service === props.item.service)
store.loadStatus(props.item, props.idx);



</script>
