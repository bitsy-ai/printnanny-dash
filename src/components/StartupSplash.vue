<template>
    
</template>
<script setup lang="ts">
import { onMounted } from "vue";
import { useSystemdServiceStore } from "@/stores/systemdService";
import { WIDGETS } from "@/types";

const widget = WIDGETS["printnanny-online"];
const store = useSystemdServiceStore(widget);
const timeout = 300000 // 5 minutes in ms
const interval = 2000 // 2 seconds

onMounted(async () => {
  await store.pollReady(timeout, interval);
});


</script>