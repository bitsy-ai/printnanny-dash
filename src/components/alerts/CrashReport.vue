<template>
  <TransitionRoot as="template" :show="store.showCrashReportForm">
    <Dialog
      as="div"
      class="relative z-10"
      @close="store.showCrashReportForm = false"
    >
      <TransitionChild
        as="template"
        enter="ease-out duration-300"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="ease-in duration-200"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div
          class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
        />
      </TransitionChild>

      <div class="fixed inset-0 z-10 overflow-y-auto">
        <div
          class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0"
        >
          <TransitionChild
            as="template"
            enter="ease-out duration-300"
            enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enter-to="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leave-from="opacity-100 translate-y-0 sm:scale-100"
            leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <DialogPanel
              class="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-2xl"
            >
              <div
                class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4"
                v-if="store.showCrashReportConfirm == true"
              >
                <div class="sm:flex sm:items-start">
                  <div
                    class="mx-auto flex h-36 w-36 flex-shrink-0 items-center justify-center rounded-full bg-gray-100 sm:mx-0 sm:h-36 sm:w-36"
                  >
                    <img
                      src="https://cdn.printnanny.ai/www/logo/logo-square-confused.png"
                    />
                  </div>
                  <div
                    class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left px-2"
                  >
                    <DialogTitle
                      as="h3"
                      class="text-lg font-medium leading-6 text-gray-900"
                      >Thank you! Your report was received.</DialogTitle
                    >
                    <div class="mt-2">
                      <p class="text-sm text-gray-500 pt-4">
                        We'll reach out over email if we need more information.
                        📧
                      </p>
                      <p class="text-sm text-gray-500 pt-4">
                        If your issue is already known, we'll send you a GitHub
                        issue link so you can to track the bug fix. 🐛
                      </p>
                      <p class="text-sm text-gray-500 pt-4">
                        <strong
                          >Thank you for helping make PrintNanny excellent! 💜
                        </strong>
                      </p>
                    </div>
                  </div>
                </div>
                <div class="pt-8"></div>
              </div>
              <CrashReportForm v-else />
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script setup lang="ts">
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  TransitionChild,
  TransitionRoot,
} from "@headlessui/vue";

import { useAlertStore } from "@/stores/alerts";
import CrashReportForm from "@/components/alerts/CrashReportForm.vue";

const store = useAlertStore();
</script>
