<template>
  <div class="divide-y divide-gray-200 lg:col-span-9 flex">
    <Transition
      name="fade"
      mode="out-in"
      :duration="{ enter: 800, leave: 500 }"
    >
      <TextSpinner
        text-size="xl"
        spinner-size="64"
        class="m-auto text-gray-500 stroke-gray-500"
        v-if="store.loading"
      />
      <ErrorPanel v-else-if="store.error" :errors="[store.error]"> </ErrorPanel>
      <div v-else class="pt-4 px-4 sm:p-4 w-full">
        <div>
          <h2
            class="text-left text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl"
          >
            Device Information
          </h2>
        </div>
        <!-- Version -->
        <div class="w-full mx-auto divide-y-2 divide-gray-200">
          <dl class="mt-6 space-y-6 divide-y divide-gray-200">
            <Disclosure
              as="div"
              class="pt-6"
              v-slot="{ open }"
              :defaultOpen="true"
            >
              <dt class="text-lg">
                <DisclosureButton
                  class="flex w-full items-start justify-between text-left text-gray-400"
                >
                  <span class="font-medium text-gray-900"
                    >PrintNanny OS Version & Build</span
                  >
                  <span class="ml-6 flex h-7 items-center">
                    <ChevronDownIcon
                      :class="[
                        open ? '-rotate-180' : 'rotate-0',
                        'h-6 w-6 transform',
                      ]"
                      aria-hidden="true"
                    />
                  </span>
                </DisclosureButton>
              </dt>
              <DisclosurePanel as="dd" class="mt-2 pr-12">
                <pre class="text-base text-gray-500"
                  >{{ store.deviceInfo?.issue }}}</pre
                >
              </DisclosurePanel>
            </Disclosure>
          </dl>
        </div>
        <div class="w-full mx-auto divide-y-2 divide-gray-200">
          <dl class="mt-6 space-y-6 divide-y divide-gray-200">
            <Disclosure
              as="div"
              class="pt-6"
              v-slot="{ open }"
              :defaultOpen="true"
            >
              <dt class="text-lg">
                <DisclosureButton
                  class="flex w-full items-start justify-between text-left text-gray-400"
                >
                  <span class="font-medium text-gray-900">Network</span>
                  <span class="ml-6 flex h-7 items-center">
                    <ChevronDownIcon
                      :class="[
                        open ? '-rotate-180' : 'rotate-0',
                        'h-6 w-6 transform',
                      ]"
                      aria-hidden="true"
                    />
                  </span>
                </DisclosureButton>
              </dt>
              <DisclosurePanel as="dd" class="mt-2 pr-12">
                <pre class="text-base text-gray-500"
                  >{{ store.deviceInfo?.ifaddrs }}}</pre
                >
              </DisclosurePanel>
            </Disclosure>
          </dl>
        </div>
      </div>
    </Transition>
  </div>
</template>
<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
<script setup lang="ts">
import TextSpinner from "@/components/TextSpinner.vue";
import ErrorPanel from "../status/ErrorPanel.vue";
import { useDeviceStore } from "@/stores/device";
import { Disclosure, DisclosureButton, DisclosurePanel } from "@headlessui/vue";
import { ChevronDownIcon } from "@heroicons/vue/24/outline";
const store = useDeviceStore();
store.load();
</script>
