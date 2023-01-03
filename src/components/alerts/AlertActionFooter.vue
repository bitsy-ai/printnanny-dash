<!-- Alert with one or two action -->
<template>
  <div
    class="flex w-full bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6"
  >
    <span v-for="(action, index) in actions" :key="index">
      <router-link
        v-if="action.routeName !== undefined"
        :to="{ name: action.routeName }"
      >
        <button
          v-for="(action, index) in actions"
          :key="index"
          type="button"
          :class="colorClassNames(action)"
          class="inline-flex w-full justify-center rounded-md border border-transparent px-4 py-2 text-base font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm"
          @click="action.onClick"
        >
          {{ action.text }}
        </button>
      </router-link>
      <button
        v-else
        type="button"
        :class="colorClassNames(action)"
        class="inline-flex w-full justify-center rounded-md border border-transparent px-4 py-2 text-base font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm"
        @click="action.onClick"
      >
        {{ action.text }}
      </button>
    </span>
  </div>
</template>
<script setup lang="ts">
import type { PropType } from "vue";
import type { AlertAction } from "@/types";

defineProps({
  actions: {
    type: Array as PropType<Array<AlertAction>>,
    default: () => [],
  },
});
function colorClassNames(action: AlertAction) {
  return `${action.textColor} hover:${action.hoverTextColor} focus:ring-gray-700 ${action.bgColor} hover:${action.hoverBgColor}`;
}
</script>
