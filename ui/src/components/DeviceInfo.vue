<template>
  <h3 class="text-lg font-bold text-gray-900 prose p-4">PrintNanny Build Information (<span class="font-mono">/etc/issue</span>)</h3>
  <pre class="mb-4 mx-4 bg-slate-200 p-2 rounded">{{ issue }}</pre>

  <h3 class="text-lg font-bold text-gray-900 prose p-4">PrintNanny OS Version (<span class="font-mono">/etc/os-release</span>)</h3>
  <pre class="mb-4 mx-4 bg-slate-200 p-2 rounded">{{ os_release }}</pre>

  <h3 class="text-lg font-bold text-gray-900 prose p-4">PrintNanny CLI Version (<span class="font-mono">printnanny --version</span>)</h3>
  <pre class="mb-4 mx-4 bg-slate-200 p-2 rounded">{{ printnanny_version }}</pre>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  data() {
    return {
      issue: "some issues",
      os_release: "red hat linux 5.0 (hurricane)",
      printnanny_version: "0.0 alpha",
    }
  },
  created() {
    window.fetch('/api/pi/version')
    .then(response => response.json())
    .then(data => {
      this.issue = data.issue
      this.os_release = data.os_release
      this.printnanny_version = data.printnanny_version
    })
  }
})
</script>
