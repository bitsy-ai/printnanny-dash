<template>
  <div class="w-full bg-white rounded">
    <div
      v-if="widgets.configs == undefined"
      class="h-24 text-center w-full m-auto"
    >
      <TextSpinner
        text="Loading config information..."
        class="h-24 w-full m-auto pl-4"
      ></TextSpinner>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-2" v-else>
      <select>
        <option v-for="file in widgets.configs">
          {{ file.filename }}
        </option>
      </select>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useWidgetStore } from "@/stores/widgets";
import TextSpinner from "@/components/TextSpinner.vue";

const widgets = useWidgetStore();
widgets.loadConfigs();
</script>
