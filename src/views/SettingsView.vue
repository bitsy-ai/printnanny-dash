<template>
  <div>
    <Disclosure
      as="div"
      class="relative overflow-hidden bg-sky-700 pb-32"
      v-slot="{ open }"
    >
      <div
        aria-hidden="true"
        :class="[
          open ? 'bottom-0' : 'inset-y-0',
          'absolute inset-x-0 left-1/2 w-full -translate-x-1/2 transform overflow-hidden lg:inset-y-0',
        ]"
      >
        <div class="absolute inset-0 flex">
          <div class="h-full w-1/2" style="background-color: #1f2937" />
          <div class="h-full w-1/2" style="background-color: #1f2937" />
        </div>
        <div class="relative flex justify-center">
          <svg
            class="flex-shrink-0"
            width="1750"
            height="308"
            viewBox="0 0 1750 308"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M284.161 308H1465.84L875.001 182.413 284.161 308z"
              fill="#1f2937"
            />
            <path d="M1465.84 308L16.816 0H1750v308h-284.16z" fill="#1f2937" />
            <path d="M1733.19 0L284.161 308H0V0h1733.19z" fill="#1f2937" />
            <path
              d="M875.001 182.413L1733.19 0H16.816l858.185 182.413z"
              fill="#334155"
            />
          </svg>
        </div>
      </div>
      <header class="relative py-10">
        <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 class="text-3xl font-bold tracking-tight text-white">Settings</h1>
        </div>
      </header>
    </Disclosure>

    <main class="relative -mt-32">
      <div class="mx-auto max-w-screen-xl px-4 pb-6 sm:px-6 lg:px-8 lg:pb-16">
        <div class="overflow-hidden rounded-lg bg-white shadow">
          <div
            class="divide-y divide-gray-200 lg:grid lg:grid-cols-12 lg:divide-y-0 lg:divide-x"
          >
            <aside class="py-6 lg:col-span-3">
              <nav class="space-y-1">
                <router-link
                  v-for="item in subNavigation"
                  :key="item.name"
                  :to="item.link"
                  :class="[
                    item.current
                      ? 'bg-indigo-50 border-indigo-500 text-indigo-700 hover:bg-indigo-50 hover:text-indigo-700'
                      : 'border-transparent text-gray-900 hover:bg-gray-50 hover:text-gray-900',
                    'group border-l-4 px-3 py-2 flex items-center text-sm font-medium',
                  ]"
                  :aria-current="item.current ? 'page' : undefined"
                >
                  <component
                    :is="item.icon"
                    :class="[
                      item.current
                        ? 'text-indigo-500 group-hover:text-indigo-500'
                        : 'text-gray-400 group-hover:text-gray-500',
                      'flex-shrink-0 -ml-1 mr-3 h-6 w-6',
                    ]"
                    aria-hidden="true"
                  />
                  <span class="truncate">{{ item.name }}</span>
                </router-link>
              </nav>
            </aside>

            <router-view name="SettingsPanel"></router-view>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { RouterLink, useRouter } from "vue-router";
import { Disclosure } from "@headlessui/vue";
import {
  CogIcon,
  UserCircleIcon,
  InformationCircleIcon,
} from "@heroicons/vue/24/outline";

const router = useRouter();

const subNavigation = ref([
  {
    name: "PrintNanny Account",
    link: { name: "printnanny-account" },
    icon: UserCircleIcon,
    current: computed(
      () => router.currentRoute.value.name === "printnanny-account"
    ),
  },
  {
    name: "Edit Settings",
    link: { name: "edit-settings-files", params: { app: "printnanny" } },
    icon: CogIcon,
    current: computed(
      () => router.currentRoute.value.name === "edit-settings-files"
    ),
  },
  {
    name: "Device Info",
    link: { name: "device-info" },
    icon: InformationCircleIcon,
    current: computed(() => router.currentRoute.value.name === "device-info"),
  },
  // { name: 'Notifications', href: '#', icon: BellIcon, current: false },
  // { name: 'Billing', href: '#', icon: CreditCardIcon, current: false },
  // { name: 'Integrations', href: '#', icon: SquaresPlusIcon, current: false },
]);
</script>
