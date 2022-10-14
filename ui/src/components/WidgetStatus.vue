<template>
  <div class="flex">
    <!-- spinner -->
    <Transition
      name="fade"
      mode="out-in"
      :duration="{ enter: 800, leave: 500 }"
    >
      <TextSpinner v-if="status == SystemdUnitStatus.Unknown" />
      <div
        class="flex items-center space-x-3 font-medium text-gray-600"
        v-else-if="status == SystemdUnitStatus.Active"
      >
        <div
          class="bg-emerald-500 flex-shrink-0 w-2.5 h-2.5 rounded-full"
          aria-hidden="true"
        ></div>
        <span class="text-grey-600">Online</span>
      </div>
      <div
        class="flex items-center space-x-3 font-medium text-gray-600"
        v-else-if="status == SystemdUnitStatus.Inactive"
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
import type { PropType } from "vue";
import type { WidgetItem, MediaCommandResponse, SystemctlCommandResponse } from "@/types";
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

const status = ref(SystemdUnitStatus.Unknown);

async function refreshStatus() {
  const res: SystemctlCommandResponse | undefined = await store.showStatus(props.item);
  if (res === undefined){
    status.value = SystemdUnitStatus.Unknown;
  }
  else {
    const state = res.data.get("ActiveState");
    switch (state) {
      case "active":
        status.value = SystemdUnitStatus.Active;
        break;
      case "inactive":
        status.value = SystemdUnitStatus.Inactive;
        break;
      default:
        status.value = SystemdUnitStatus.Unknown;
    } 
  }
  status.value = SystemdUnitStatus.Unknown;
}
window.setInterval(async () => {
  refreshStatus;
}, 3000);
</script>
