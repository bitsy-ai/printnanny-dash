<template>
<div class="flex w-full lg:col-span-9">
    <Transition name="fade" mode="out-in" :duration="{ enter: 800, leave: 500 }">

    <TextSpinner text-size="xl" spinner-size="64" class="m-auto" v-if="store.loading"/>
    <ErrorPanel v-else-if="store.error" :errors="[store.error]">
    </ErrorPanel>
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
import TextSpinner from "@/components/TextSpinner.vue";
import ErrorPanel from "../status/ErrorPanel.vue";
import { useDeviceStore } from "@/stores/device";

const store = useDeviceStore();
store.load()

</script>
