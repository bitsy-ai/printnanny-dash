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
          <div class="h-96 rounded-lg border-4 border-dashed border-gray-200 grid grid-cols-1 md:grid-cols-3 gap-4">
            <!-- card #1 -->

            
            <div class="p-6 max-w-sm bg-white rounded-lg border border-gray-200 shadow-md dark:bg-gray-800 dark:border-gray-700 flex flex-col">
                <router-link :to="{'path': '/vision'}">
                    <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Quality Control & Monitoring</h5>
                </router-link>
                <p class="mb-3 font-normal text-gray-700 dark:text-gray-400">PrintNanny spots critical defects and automatically pauses failing jobs.</p>
                <p class="mb-3 font-normal text-gray-700 dark:text-gray-400">Out of the box, PrintNanny can detect:</p>
                <ul class="list-disc px-4 font-normal text-gray-700 dark:text-gray-400">
                  <li>Layer warping</li>
                  <li>Adhesion failures</li>
                  <li>Filament "spaghetti"</li>

                </ul>
                <router-link :to="{'path': '/vision'}" class="w-3/4 inline-flex justify-self-end items-center mt-4 py-2 px-3 text-sm font-medium text-center text-white bg-indigo-600 rounded-lg hover:bg-indigo-800 focus:ring-4 focus:outline-none focus:ring-indigo-300 dark:bg-indigo-600 dark:hover:bg-indigo-700 dark:focus:ring-indigo-800">
                    Try PrintNanny Vision
                    <svg aria-hidden="true" class="ml-2 -mr-1 w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
                </router-link>
            </div>
            <!-- card #2 -->

            <div class="p-6 max-w-sm bg-white rounded-lg border border-gray-200 shadow-md dark:bg-gray-800 dark:border-gray-700 flex flex-col">
                <router-link :to="{'path': '/vision'}">
                    <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">File Sync</h5>
                </router-link>
                <p class="mb-3 font-normal text-gray-700 dark:text-gray-400">Like having a private Dropbox. Easily sync files across your devices.</p>
                <p class="mb-3 font-normal text-gray-700 dark:text-gray-400">PrintNanny File Sync is powered by <a target="_blank" href="https://syncthing.net/">Syncthing</a>, with support for:</p>
                <ul class="list-disc px-4 font-normal text-gray-700 dark:text-gray-400">
                  <li>Raspberry Pi (Rock Pi coming soon)</li>
                  <li>Windows</li>
                  <li>MacOS</li>
                  <li>Linux</li>
                </ul>
                <a href="https://docs.printnanny.ai/docs/quick-start/configure-file-sync/" target="_blank" class="w-3/4 inline-flex items-center mt-4 py-2 px-3 text-sm font-medium text-center text-white bg-indigo-600 rounded-lg hover:bg-indigo-800 focus:ring-4 focus:outline-none focus:ring-indigo-300 dark:bg-indigo-600 dark:hover:bg-indigo-700 dark:focus:ring-indigo-800">
                    Configure File Sync
                    <svg aria-hidden="true" class="ml-2 -mr-1 w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
                </a>
            </div>

            <div class="p-6 max-w-sm bg-white rounded-lg border border-gray-200 shadow-md dark:bg-gray-800 dark:border-gray-700 flex flex-col">
                <router-link :to="{'path': '/vision'}">
                    <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">What's new?</h5>
                </router-link>
                <p class="mb-3 font-normal text-gray-700 dark:text-gray-400">Read about the latest PrintNanny OS release.</p>
                <a href="https://docs.printnanny.ai/docs/category/release-history/" target="_blank" class="w-3/4 inline-flex items-center mt-4 py-2 px-3 text-sm font-medium text-center text-white bg-indigo-600 rounded-lg hover:bg-indigo-800 focus:ring-4 focus:outline-none focus:ring-indigo-300 dark:bg-indigo-600 dark:hover:bg-indigo-700 dark:focus:ring-indigo-800">
                    Latest Release
                    <svg aria-hidden="true" class="ml-2 -mr-1 w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
                </a>
            </div>

          </div>

        </div>

      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { RouterLink } from "vue-router"
const pageTitle =
  "👋 Welcome to PrintNanny OS, the Personal Assistant for 3D Printers.";



</script>
