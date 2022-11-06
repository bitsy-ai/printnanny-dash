<template>
  <div class="py-10">
    <header>
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h1 class="text-3xl font-bold text-gray-900 prose">{{ pageTitle }}</h1>
      </div>
    </header>
    <main>
      <div class="mx-auto max-w-7xl sm:p-6 lg:p-8">
        <h2 class="text-xl font-bold text-gray-900 prose">PrintNanny Cloud</h2>
        <div class="rounded-lg border-4 border-dashed border-gray-200">
          <CloudAccountLogin />
        </div>
      </div>
      <div class="mx-auto max-w-7xl sm:p-6 lg:p-8">
        <h2 class="text-xl font-bold text-gray-900 prose">
          Device Information
        </h2>
        <div class="rounded-lg border-4 border-dashed border-gray-200">
          <DeviceInfo />
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import CloudAccountLogin from "@/components/cloud/CloudAccountLogin.vue";
import DeviceInfo from "@/components/DeviceInfo.vue";
const pageTitle = "⚙️ Settings";
</script>
