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
              <Form
                class="space-y-8 divide-y divide-gray-200 lg:col-span-9 h-full"
                :validation-schema="schema"
                @submit="submitForm"
                v-slot="{ errors }"
              >
                <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div class="pt-2">
                    <div>
                      <h3 class="text-lg font-medium leading-6 text-gray-900">
                        Send Crash Report
                      </h3>
                      <p class="mt-1 text-sm text-gray-500"></p>
                    </div>
                    <div class="sm:col-span-4 py-2">
                      <label
                        for="email"
                        class="block text-sm font-medium text-gray-700"
                        >Email Address</label
                      >
                      <div class="mt-1">
                        <Field
                          id="email"
                          name="email"
                          type="email"
                          autocomplete="email"
                          class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        />
                      </div>
                      <error-message
                        class="text-red-500 text-sm font-medium"
                        name="email"
                      ></error-message>
                    </div>
                    <div class="sm:col-span-6">
                      <label
                        for="description"
                        class="block text-sm font-medium text-gray-700"
                        >Description</label
                      >
                      <div class="mt-1">
                        <Field
                          as="textarea"
                          id="description"
                          name="description"
                          rows="3"
                          class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        />
                      </div>
                      <error-message
                        class="text-red-500 text-sm font-medium"
                        name="description"
                      ></error-message>
                      <p class="mt-2 text-sm text-gray-500">
                        Please provide a detailed description of what you were
                        doing when the crash occurred.
                      </p>
                    </div>
                    <div class="sm:col-span-4 py-2">
                      <label
                        for="email"
                        class="block text-sm font-medium text-gray-700"
                        >Browser Version</label
                      >
                      <div class="mt-1">
                        <Field
                          id="browser"
                          name="browser"
                          type="text"
                          disabled
                          :value="browserVersion"
                          class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:shadow-none"
                        />
                      </div>
                    </div>
                    <div class="sm:col-span-4 p-4">
                      <div class="relative flex items-start">
                        <div class="flex h-5 items-center">
                          <Field
                            id="consent"
                            name="consent"
                            type="checkbox"
                            :value="true"
                            class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                            :class="{ 'text-red-500': errors.consent }"
                          />
                        </div>

                        <div class="ml-3 text-sm">
                          <label for="consent" class="font-medium text-gray-700"
                            >I agree to share data with PrintNanny
                            Cloud</label
                          >
                          <p class="text-gray-500 mt-2">
                            Crash report data is automatically deleted after 30
                            days.
                          </p>
                          <p class="text-gray-500 mt-2">
                            Your data is stored securely and only used for
                            debugging purposes.
                            <a
                              href="https://printnanny.ai/privacy/"
                              class="text-indigo-500"
                              >View the privacy policy</a
                            >
                            for more information.
                          </p>
                        </div>
                      </div>
                      <ErrorMessage
                        class="text-red-500 text-sm font-medium"
                        name="consent"
                      />
                    </div>
                  </div>
                </div>
                <div
                  class="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6"
                >
                  <button
                    type="submit"
                    class="inline-flex w-full justify-center rounded-md border border-transparent bg-red-500 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm"
                    @click="open = false"
                  >
                    Submit
                  </button>
                  <button
                    type="button"
                    class="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                    @click="open = false"
                    ref="cancelButtonRef"
                  >
                    Cancel
                  </button>
                </div>
              </Form>
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
