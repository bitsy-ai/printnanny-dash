<template>
  <div class="rounded-md bg-red-50 p-4 w-full">
    <div class="flex">
      <div class="flex-shrink-0">
        <XCircleIcon class="h-5 w-5 text-red-400" aria-hidden="true" />
      </div>
      <div class="ml-3">
        <h3 class="text-sm font-medium text-red-800">{{ header }}</h3>
        <div class="mt-2 text-sm text-red-700">
          <ul role="list" class="list-disc space-y-1 pl-5">
            <li v-for="(error, i) in errors" :key="i">{{ error }}</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { PropType } from "vue";
import { XCircleIcon } from "@heroicons/vue/20/solid";

defineProps({
  header: {
    type: String,
    default: "Oops, something went wrong",
  },
  errors: {
    type: Array as PropType<Array<Error | String>>,
    default: ["An unexpected error occurred. Try refreshing the page."],
  },
});
</script>
