<template>
  <form class="divide-y divide-gray-200 lg:col-span-9" action="#" method="POST">
    <!-- Profile section -->
    <div class="py-6 px-4 sm:p-6 lg:pb-8">
      <div>
        <h2 class="text-left text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">PrintNanny Cloud</h2>

        <p class="mt-1 text-sm text-gray-500">
          Connect your PrintNanny Cloud account to get email alerts and monitor
          your 3D printer from anywhere.
        </p>
      </div>

      <div class="mt-6 flex flex-col lg:flex-row">
        <div class="flex-grow space-y-6">
          <CloudAccountLogin />
        </div>

        <div
          class="mt-6 flex-grow lg:mt-0 lg:ml-6 lg:flex-shrink-0 lg:flex-grow-0"
        >
          <div class="mt-1 lg:hidden">
            <div class="flex items-center">
              <div
                class="inline-block h-12 w-12 flex-shrink-0 overflow-hidden rounded-full"
                aria-hidden="true"
              >
                <img
                  class="h-full w-full rounded-full"
                  src="@/assets/logos/printnanny/logo.svg"
                  alt="PrintNanny"
                />
              </div>
              <div class="ml-5 rounded-md shadow-sm">
                <div
                  class="group relative flex items-center justify-center rounded-md border border-gray-300 py-2 px-3 focus-within:ring-2 focus-within:ring-sky-500 focus-within:ring-offset-2 hover:bg-gray-50"
                >
                  <label
                    for="mobile-user-photo"
                    class="pointer-events-none relative text-sm font-medium leading-4 text-gray-700"
                  >
                    <span>Change</span>
                    <span class="sr-only"> user photo</span>
                  </label>
                  <input
                    id="mobile-user-photo"
                    name="user-photo"
                    type="file"
                    class="absolute h-full w-full cursor-pointer rounded-md border-gray-300 opacity-0"
                  />
                </div>
              </div>
            </div>
          </div>

          <div class="relative hidden overflow-hidden rounded-full lg:block">
            <img
              class="relative h-40 w-40 rounded-full"
              src="@/assets/logos/printnanny/logo.svg"
              alt="PrintNanny"
            />
            <label
              for="desktop-user-photo"
              class="absolute inset-0 flex h-full w-full items-center justify-center bg-black bg-opacity-75 text-sm font-medium text-white opacity-0 focus-within:opacity-100 hover:opacity-100"
            >
              <span>Change</span>
              <span class="sr-only"> user photo</span>
              <input
                type="file"
                id="desktop-user-photo"
                name="user-photo"
                class="absolute inset-0 h-full w-full cursor-pointer rounded-md border-gray-300 opacity-0"
              />
            </label>
          </div>
        </div>
      </div>
    </div>
  </form>
</template>
<script setup lang="ts">
import CloudAccountLogin from "@/components/settings/CloudAccountLogin.vue";
</script>
