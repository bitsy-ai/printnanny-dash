<!-- Alert with one or two action -->
<template>
  <div class="mt-3 flex space-x-7">
    <span v-for="(action, index) in actions" :key="index">
      <router-link
        v-if="action.routeName !== undefined"
        :to="{ name: action.routeName }"
      >
        <button
          v-for="(action, index) in actions"
          :key="index"
          type="button"
          :class="colorClassNames(action.color)"
          class="bg-white rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2"
          @click="action.onClick"
        >
          {{ action.text }}
        </button>
      </router-link>
      <button
        v-else
        type="button"
        :class="colorClassNames(action.color)"
        class="bg-white rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2"
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
function colorClassNames(color: string) {
  return `text-${color}-600 hover:text-${color}-500 focus:ring-${color}-500 bg-${color}`;
}
</script>
