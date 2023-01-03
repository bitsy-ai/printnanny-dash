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
              class="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg"
            >
              <div
                class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4"
                v-if="store.showCrashReportConfirm"
              >
                <div class="sm:flex sm:items-start">
                  <div
                    class="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10"
                  >
                    <ExclamationTriangleIcon
                      class="h-6 w-6 text-red-600"
                      aria-hidden="true"
                    />
                  </div>
                  <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <DialogTitle
                      as="h3"
                      class="text-lg font-medium leading-6 text-gray-900"
                      >Send Crash Report</DialogTitle
                    >
                    <div class="mt-2">
                      <p class="text-sm text-gray-500">
                        Please provide a detailed description of what you were
                        doing when the crash occurred.
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
import { ref } from "vue";
import * as yup from "yup";
import { Form, Field, ErrorMessage } from "vee-validate";
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  TransitionChild,
  TransitionRoot,
} from "@headlessui/vue";
import { ExclamationTriangleIcon } from "@heroicons/vue/24/outline";

import { useAlertStore } from "@/stores/alerts";
import CrashReportForm from "@/components/alerts/CrashReportForm.vue";

const store = useAlertStore();

const browserVersion = ref(window.navigator.userAgent);

const consent = ref(false);

const schema = yup.object({
  browser: yup.string(),
  email: yup.string().email().required("Please enter your email address"),
  description: yup.string().required("Please describe what you were doing"),
  consent: yup
    .bool()
    .required("Please consent to sharing data with PrintNanny Cloud"),
});

async function submitForm(values: any) {
  console.log("Form submitted:", values);
}
</script>
P
