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
          <WidgetElement
            v-for="item in printerApps"
            :key="item.name"
            :item="item"
          />
          <!-- repetier coming soon -->
          <div
            class="w-full max-w-sm bg-white rounded-lg border border-gray-200 shadow-md dark:bg-gray-800 dark:border-gray-700"
          >
            <div class="flex justify-end px-4 pt-4">
              <div class="h-4"></div>
            </div>
            <div class="flex flex-col items-center pb-10">
              <img
                class="mb-3 w-24 h-24 rounded-full shadow-lg"
                src="@/assets/logos/repetier/repetier.png"
                alt="Repetier"
              />
              <h5
                class="mb-1 text-xl font-medium text-gray-900 dark:text-white"
              >
                Repetier
              </h5>
              <span class="text-sm text-gray-500 dark:text-gray-400 text-center"
                >Coming soon!</span
              >
              <span class="text-sm text-gray-500 dark:text-gray-400 text-center"
                >Reply to the Github Issue to get updates.</span
              >

              <div class="flex mt-4 space-x-3 md:mt-6">
                <a
                  href="https://github.com/bitsy-ai/printnanny-os/issues/32"
                  target="_blank"
                  class="inline-flex items-center py-2 px-4 text-sm font-medium text-center text-gray-900 bg-white rounded-lg border border-gray-300 hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-700 dark:focus:ring-gray-700"
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
      <div class="mx-auto max-w-7xl sm:p-6 lg:p-8">
        <h2 class="text-xl font-bold text-gray-900 prose">Apps</h2>
        <div
          class="rounded-lg border-4 border-dashed border-gray-200 grid grid-cols-1 md:grid-cols-3 p-4 gap-4 justify-evenly"
        >
          <WidgetElement
            v-for="item in printnannyApps"
            :key="item.name"
            :item="item"
          />
          <!-- repetier coming soon -->
          <div
            class="w-full max-w-sm bg-white rounded-lg border border-gray-200 shadow-md dark:bg-gray-800 dark:border-gray-700"
          >
            <div class="flex justify-end px-4 pt-4">
              <div class="h-4"></div>
            </div>
            <div class="flex flex-col items-center pb-10">
              <img
                class="mb-3 w-24 h-24 rounded-full shadow-lg p-4"
                src="@/assets/logos/zapier/zapier.png"
                alt="Repetier"
              />
              <h5
                class="mb-1 text-xl font-medium text-gray-900 dark:text-white"
              >
                Zapier
              </h5>
              <span class="text-sm text-gray-500 dark:text-gray-400 text-center"
                >Coming soon!</span
              >
              <span class="text-sm text-gray-500 dark:text-gray-400 text-center"
                >Reply to the Github Issue to get updates.</span
              >

              <div class="flex mt-4 space-x-3 md:mt-6">
                <a
                  href="https://github.com/bitsy-ai/printnanny-os/issues/100"
                  target="_blank"
                  class="inline-flex items-center py-2 px-4 text-sm font-medium text-center text-gray-900 bg-white rounded-lg border border-gray-300 hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-700 dark:focus:ring-gray-700"
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
import WidgetElement from "@/components/WidgetElement.vue";
import ocotoprintLogo from "@/assets/logos/octoprint/octoprint_logo_rgb_250px.png";
import mainsailLogo from "@/assets/logos/mainsail/icon-192-maskable.png";
import printNannyLogo from "@/assets/logos/printnanny/logo.svg";
import syncThingLogo from "@/assets/logos/syncthing/logo-256.png";
import { ArrowUpRightIcon } from "@heroicons/vue/24/outline";

const pageTitle =
  "👋 Welcome to PrintNanny OS, the Personal Assistant for 3D Printers.";

const printerApps = [
  {
    name: "OctoPrint",
    href: "/octoprint/",
    service: "octoprint.service",
    logo: ocotoprintLogo,
    description: "The snappy web interface for your 3D Printer",
    menuItems: [
      { name: "Documentation", href: "https://docs.octoprint.org" },
      { name: "Plugin Repo", href: "https://plugins.octoprint.org" },
      { name: "/r/octoprint", href: "https://www.reddit.com/r/octoprint/" },
      { name: "Discord", href: "https://discord.octoprint.org/" },
    ],
  },
  {
    name: "Mainsail",
    href: "/mainsail/",
    service: "mainsail.service",
    logo: mainsailLogo,
    description:
      "Mainsail makes Klipper more accessible by adding a lightweight, responsive web user interface.",
    menuItems: [],
  },
];

const printnannyApps = [
  {
    name: "PrintNanny Vision",
    href: "/vision/",
    service: "printnanny-vision.service",
    logo: printNannyLogo,
    description:
      "The privacy-first defect and failure detection system. No internet connection required.",
    menuItems: [],
  },
  {
    name: "Syncthing",
    href: "/syncthing/",
    logo: syncThingLogo,
    description:
      "Sync files between two or more computers. Like having a private Dropbox.",
    service: "syncthing.service",
    menuItems: [],
  },
];
</script>
