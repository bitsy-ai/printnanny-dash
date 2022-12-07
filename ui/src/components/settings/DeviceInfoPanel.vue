<template>
<div class="divide-y divide-gray-200 lg:col-span-9">
    <Transition name="fade" mode="out-in" :duration="{ enter: 800, leave: 500 }">

    <TextSpinner text-size="xl" spinner-size="64" class="m-auto" v-if="store.loading"/>
    <ErrorPanel v-else-if="store.error" :errors="[store.error]">
    </ErrorPanel>
    <div v-else>
        <div class="py-6 px-4 sm:p-6 lg:pb-8">
                <div>
                  <h2 class="text-lg font-medium leading-6 text-gray-900">Device Information</h2>
                  <p class="mt-1 text-sm text-gray-500">Please include the information below when creating a 
                    <a
                    target="_blank" 
                    :href="githubIssueHref"
                    class="text-indigo-500 hover:text-indigo-700 focus:ring-4 focus:outline-none focus:ring-indigo-30"
                    >Github Issue.</a></p>
                </div>

        </div>
        <div class="py-6 px-4 sm:p-6 lg:pb-8">
            <pre>/etc/issue

{{store.deviceInfo.issue}}</pre>
        </div>
        <div class="py-6 px-4 sm:p-6 lg:pb-8">
            <pre>/etc/os-release

{{store.deviceInfo.os_release}}</pre>
        </div>
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
import TextSpinner from "@/components/TextSpinner.vue";
import ErrorPanel from "../status/ErrorPanel.vue";
import { useDeviceStore } from "@/stores/device";

const githubIssueHref = import.meta.env.VITE_PRINTNANNY_OS_NEW_GITHUB_ISSUE;

const store = useDeviceStore();
store.load()

</script>
