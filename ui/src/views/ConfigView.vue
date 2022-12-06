<template>
  <div class="py-10">
    <header>
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h1 class="text-3xl font-bold text-gray-900 prose">{{ pageTitle }}</h1>
      </div>
    </header>
    <main>
      <div class="mx-auto max-w-7xl sm:p-6 lg:p-8">
        <div class="rounded-lg border-4 border-dashed border-gray-200 p-4">
          <Config />
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import Config from "@/components/Config.vue";
const pageTitle = "🔧Configuration";
</script>
