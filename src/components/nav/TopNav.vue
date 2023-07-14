<template>
  <Disclosure as="nav" class="bg-white shadow-sm" v-slot="{ open }">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="flex h-16 justify-between">
        <div class="flex">
          <div class="flex flex-shrink-0 items-center">
            <img
              class="block h-8 w-auto lg:hidden"
              src="@/assets/logos/printnanny/logo-text-rect-dark.svg"
              alt="PrintNanny"
            />
            <img
              class="hidden h-8 w-auto lg:block"
              src="@/assets/logos/printnanny/logo-text-rect-dark.svg"
              alt="PrintNanny"
            />
          </div>
          <div class="hidden sm:-my-px sm:ml-6 sm:flex sm:space-x-8">
            <RouterLink
              v-for="item in navigation"
              :key="item.name"
              :to="item.href"
              :class="[
                item.current
                  ? 'border-indigo-500 text-gray-900'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
                'inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium',
              ]"
              :aria-current="item.current ? 'page' : undefined"
              >{{ item.name }}
              <CameraStatus
                v-if="item.name === 'Camera'"
                :compact="true"
                :show-loading="false"
                class="ml-2"
              />
            </RouterLink>

            <a
              v-for="item in externalLinks"
              :key="item.name"
              :href="item.href"
              class="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              target="_blank"
              >{{ item.name }}
              <ArrowUpRightIcon class="w-4 h-4 text-sm font-medium ml-1"
            /></a>
          </div>
        </div>
        <div class="-mr-2 flex items-center sm:hidden">
          <!-- Mobile menu button -->
          <DisclosureButton
            class="inline-flex items-center justify-center rounded-md bg-white p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            <span class="sr-only">Open main menu</span>
            <Bars3Icon v-if="!open" class="block h-6 w-6" aria-hidden="true" />
            <XMarkIcon v-else class="block h-6 w-6" aria-hidden="true" />
          </DisclosureButton>
        </div>
        <!-- nats connection status indicator -->
        <div class="hidden sm:-my-px sm:ml-6 sm:flex sm:space-x-8">
          <!-- 
            <button type="button" class="rounded-full bg-white p-1 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
              <span class="sr-only">View notifications</span>
              <BellIcon class="h-6 w-6" aria-hidden="true" />
            </button>
            -->
          <router-link
            :to="{ name: 'printnanny-account' }"
            :class="[
              router.currentRoute.value.name == 'Settings'
                ? 'border-indigo-500 text-gray-900'
                : 'border-transparent text-gray-500 hover:text-gray-700',
              'cursor-pointer border-transparent border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium',
            ]"
          >
            <Cog6ToothIcon class="h-6 w-6 mr-2" />Settings
          </router-link>
          <a
            @click="alerts.openCrashReport"
            :class="[
              'cursor-pointer border-transparent border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium',
              'inline-flex items-center px-1 pt-1 text-sm font-medium mr-4',
            ]"
          >
            <FireIcon class="h-6 w-6 mr-2" />Crash Report
          </a>
          <CloudSyncStatus class="justify-self-end"/>
        </div>
      </div>
    </div>

    <DisclosurePanel class="sm:hidden">
      <div class="space-y-1 pt-2 pb-3">
        <RouterLink :to="item.href" :key="item.name" v-for="item in navigation">
          <DisclosureButton
            :class="[
              item.current
                ? 'bg-indigo-50 border-indigo-500 text-indigo-700'
                : 'border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800',
              'block pl-3 pr-4 py-2 border-l-4 text-base font-medium',
            ]"
            :aria-current="item.current ? 'page' : undefined"
            >{{ item.name }}</DisclosureButton
          >
        </RouterLink>
      </div>
    </DisclosurePanel>
  </Disclosure>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { Disclosure, DisclosureButton, DisclosurePanel } from "@headlessui/vue";
import {
  Bars3Icon,
  XMarkIcon,
  ArrowUpRightIcon,
} from "@heroicons/vue/24/outline";
import { Cog6ToothIcon, FireIcon } from "@heroicons/vue/24/solid";
import CloudSyncStatus from "@/components/status/CloudSyncStatus.vue";
import CameraStatus from "@/components/video/CameraStatus.vue";
import { useRouter, RouterLink } from "vue-router";
import { useAlertStore } from "@/stores/alerts";

import { TopBarRoutes } from "@/router/routes";
import type { NavItem } from "@/types";

const router = useRouter();

const alerts = useAlertStore();

const externalLinks = [
  { name: "Update System", href: "/update/" },
  { name: "PrintNanny Cloud", href: "https://printnanny.ai" },
  {
    name: "Docs",
    href: "https://printnanny.ai/docs/docs/category/quick-start/",
  },
];

const navigation = computed(
  (): Array<NavItem> =>
    TopBarRoutes.map((r: any) => {
      return {
        name: r.name,
        href: r.path,
        current: router.currentRoute.value.name == r.name,
      };
    })
);
</script>
