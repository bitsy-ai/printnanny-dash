<template>
  <div class="py-10">
    <header>
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h1 class="text-3xl font-bold text-gray-900 prose">{{ pageTitle }}</h1>
      </div>
    </header>
    <main>
      <div class="mx-auto max-w-7xl sm:p-6 lg:p-8">
        <h2 class="text-xl font-bold text-gray-900 prose">
          3D Printer Management
        </h2>
        <div
          class="rounded-lg border-4 border-dashed border-gray-200 grid grid-cols-1 md:grid-cols-3 p-4 gap-4 justify-evenly"
        >
          <SystemdServiceCard
            v-for="item in widgets.printerManagementItems"
            :key="item.name"
            :item="item"
          />
          <!-- repetier coming soon -->
          <div
            class="w-full max-w-sm bg-white rounded-lg border border-gray-200 shadow-md"
          >
            <div class="flex justify-end px-4 pt-4">
              <div class="h-4"></div>
            </div>
            <div class="flex flex-col items-center pb-10">
              <img
                class="mb-3 p-2 w-24 h-24 rounded-full shadow-lg"
                src="@/assets/logos/repetier/repetier.png"
                alt="Repetier"
              />
              <h5 class="mb-1 text-xl font-medium text-gray-900">Repetier</h5>
              <span class="text-sm text-gray-500">Coming soon!</span>
              <span class="text-sm text-gray-500 text-center"
                >Reply to the Github Issue to get updates.</span
              >

              <div class="flex mt-4 space-x-3 md:mt-6">
                <a
                  href="https://github.com/bitsy-ai/printnanny-os/issues/32"
                  target="_blank"
                  class="inline-flex items-center py-2 px-4 text-sm font-medium text-center text-gray-900 bg-white rounded-lg border border-gray-300 hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200"
                >
                  <ArrowUpRightIcon
                    class="w-4 h-4 text-sm font-medium mr-1 text-white-600"
                  />
                  Github Issue
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- printnanny services -->
      <div class="mx-auto max-w-7xl sm:p-6 lg:p-8">
        <h2 class="text-xl font-bold text-gray-900 prose">
          PrintNanny Services
        </h2>
        <div
          class="rounded-lg border-4 border-dashed border-gray-200 grid grid-cols-1 md:grid-cols-3 p-4 gap-4 justify-evenly"
        >
          <SystemdServiceCard
            v-for="item in widgets.printNannyAppItems"
            :key="item.name"
            :item="item"
          />
        </div>
      </div>

      <!-- other apps -->
      <div class="mx-auto max-w-7xl sm:p-6 lg:p-8">
        <h2 class="text-xl font-bold text-gray-900 prose">Other Services</h2>
        <div
          class="rounded-lg border-4 border-dashed border-gray-200 grid grid-cols-1 md:grid-cols-3 p-4 gap-4 justify-evenly"
        >
          <SystemdServiceCard
            v-for="item in widgets.otherAppItems"
            :key="item.name"
            :item="item"
          />
          <!-- zapier coming soon -->
          <div
            class="w-full max-w-sm bg-white rounded-lg border border-gray-200 shadow-md"
          >
            <div class="flex justify-end px-4 pt-4">
              <div class="h-4"></div>
            </div>
            <div class="flex flex-col items-center pb-10">
              <img
                class="mb-3 p-2 w-24 h-24 rounded-full shadow-lg p-4"
                src="@/assets/logos/zapier/zapier.png"
                alt="Zapier"
              />
              <h5 class="mb-1 text-xl font-medium text-gray-900">Zapier</h5>
              <span class="text-sm text-gray-500 text-center"
                >Coming soon!</span
              >
              <span class="text-sm text-gray-500 text-center"
                >Reply to the Github Issue to get updates.</span
              >

              <div class="flex mt-4 space-x-3 md:mt-6">
                <a
                  href="https://github.com/bitsy-ai/printnanny-os/issues/100"
                  target="_blank"
                  class="inline-flex items-center py-2 px-4 text-sm font-medium text-center text-gray-900 bg-white rounded-lg border border-gray-300 hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200"
                >
                  <ArrowUpRightIcon
                    class="w-4 h-4 text-sm font-medium mr-1 text-white-600"
                  />
                  Github Issue
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ArrowUpRightIcon } from "@heroicons/vue/24/outline";
import { useCloudStore } from "@/stores/cloud";
import { useWidgetStore } from "@/stores/widgets";
import SystemdServiceCard from "@/components/services/SystemdServiceCard.vue";

const widgets = useWidgetStore();
const cloud = useCloudStore();

cloud.fetchUser();

const pageTitle =
  "👋 Welcome to PrintNanny OS, the Personal Assistant for 3D Printers.";
</script>
