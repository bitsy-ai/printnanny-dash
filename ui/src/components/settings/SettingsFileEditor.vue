<template>

    <codemirror v-for="file in store.settingsFiles"
        :key="file.file_name"
        v-model="file.content"
        :style="{ height: '400px' }"
        :autofocus="true"
        :indent-with-tab="true"
        :tab-size="2"
    />
</template>
<script setup lang="ts">
import type { PropType } from "vue";
import { useSettingsFileStore } from "@/stores/settingsFile";
import type { WidgetItem } from "@/types";

const props = defineProps({
  item: {
    type: Object as PropType<WidgetItem>,
    required: true,
  },
});

const store = useSettingsFileStore(props.item);

</script>