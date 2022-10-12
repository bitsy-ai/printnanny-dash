<template>
  <div class="py-10">
    <header>
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h1 class="text-3xl font-bold text-gray-900 prose">{{ pageTitle }}</h1>
      </div>
    </header>
    <main>
      <div class="mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div class="px-4 py-8 sm:px-0">

          <h2 class="text-xl font-bold text-gray-900 prose">3D Printer Management</h2>
          <div class="rounded-lg border-4 border-dashed border-gray-200 grid grid-cols-1 md:grid-cols-3 gap-4">
            <WidgetElement 
              v-for="item in printerManagers"
              :key="item.name"
              :item="item"
            /> 

          </div>

        </div>

      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { RouterLink } from "vue-router"
import WidgetElement from "@/components/WidgetElement.vue"
import ocotoprintLogo from "@/assets/logos/octoprint/octoprint_logo_rgb_250px.png"
import mainsailLogo from "@/assets/logos/mainsail/icon-192-maskable.png"

const pageTitle =
  "👋 Welcome to PrintNanny OS, the Personal Assistant for 3D Printers.";



const printerManagers = [
  { name: "OctoPrint", href: "/octoprint/", service: "octoprint.service", 
    logo: ocotoprintLogo, description: "The snappy web interface for your 3D Printer",
    menuItems: [
      { name: "Documentation", href: "https://docs.octoprint.org"},
      { name: "Plugin Repo", href: "https://plugins.octoprint.org"},
      { name: "/r/octoprint", href: "https://www.reddit.com/r/octoprint/"},
      { name: "Discord", href: "https://discord.octoprint.org/"}
    ]
  },

  { name: "Mainsail", href: "/mainsail/", service: "mainsail.service", logo:  mainsailLogo, 
  description: "Mainsail makes Klipper more accessible by adding a lightweight, responsive web user interface.",
  menuItems: []
  }

]


</script>
