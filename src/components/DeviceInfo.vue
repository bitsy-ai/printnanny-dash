<template>
  <div class="w-full bg-white rounded">
    <div
      v-if="store.deviceInfo == undefined"
      class="h-24 text-center w-full m-auto"
    >
      <TextSpinner
        text="Loading device information..."
        class="h-24 w-full m-auto pl-4"
      ></TextSpinner>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-2" v-else>
      <div>
        <h3 class="text-lg font-bold text-gray-900 prose p-4">
          PrintNanny Build Information (<span class="font-mono">/etc/issue</span
          >)
        </h3>
        <pre class="mb-4 mx-4 bg-slate-200 p-2 rounded">{{
          store.deviceInfo?.issue
        }}</pre>
      </div>

      <div>
        <h3 class="text-lg font-bold text-gray-900 prose p-4">
          PrintNanny OS Version (<span class="font-mono">/etc/os-release</span>)
        </h3>
        <pre class="mb-4 mx-4 bg-slate-200 p-2 rounded">{{
          store.deviceInfo?.os_release
        }}</pre>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import TextSpinner from "@/components/TextSpinner.vue";
import { useDeviceStore } from "@/stores/device";

const store = useDeviceStore();
store.load();
</script>

<style scoped>
pre {
  white-space: pre-wrap; /* css-3 */
  white-space: -moz-pre-wrap; /* Mozilla, since 1999 */
  white-space: -pre-wrap; /* Opera 4-6 */
  white-space: -o-pre-wrap; /* Opera 7 */
  word-wrap: break-word; /* Internet Explorer 5.5+ */
}
</style>
