<template>
  <div class="py-10">
    <header>
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h1 class="text-3xl font-bold text-gray-900 prose">{{ pageTitle }}</h1>
      </div>
    </header>
    <main>
      <div class="mx-auto max-w-7xl sm:p-6 lg:p-8">
        <img
          class="mx-auto h-36 w-auto my-4"
          src="@/assets/logos/printnanny/logo-rect-light.svg"
          alt="PrintNanny"
        />
        <CloudAccountLogin />
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import CloudAccountLogin from "@/components/cloud/CloudAccountLogin.vue";
</script>
