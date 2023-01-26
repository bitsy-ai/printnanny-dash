<template>
  <Form
    class="space-y-8 divide-y divide-gray-200 lg:col-span-9 h-full"
    :validation-schema="schema"
    @submit="submitForm"
    v-slot="{ errors }"
    :initial-values="initialValues"
  >
    <div class="bg-white">
      <div class="sm:flex sm:items-start px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
        <div class="pt-2">
          <div>
            <h3 class="text-lg font-medium leading-6 text-gray-900">
              Send Crash Report
            </h3>
            <p class="mt-1 text-sm text-gray-500"></p>
          </div>
          <div class="sm:col-span-4 py-2">
            <label for="email" class="block text-sm font-medium text-gray-700"
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
              Please provide a detailed description of what you were doing when
              the crash occurred.
            </p>
          </div>
          <div class="sm:col-span-4 py-2">
            <label for="email" class="block text-sm font-medium text-gray-700"
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
                  >I consent to sharing data with PrintNanny Cloud</label
                >
                <p class="text-gray-500 mt-2">
                  Crash report data is automatically deleted after 30 days.
                </p>
                <p class="text-gray-500 mt-2">
                  Your data is stored securely and only used for debugging
                  purposes.
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
          <div
            class="sm:col-span-4 p-4"
            v-if="store.showCrashReportAdditionalCommand"
          >
            <h3 class="text-lg font-medium leading-6 text-gray-900 w-full flex">
              <ExclamationTriangleIcon class="w-6 h-6 mr-2 text-red-500" />
              Action Needed
            </h3>
            <p class="text-gray-500 mt-2 text-sm">
              There was a problem attaching system logs to your report. This can
              happen if your Raspberry Pi is unreachable.
            </p>
            <p class="text-gray-500 mt-2 text-sm">
              Please try SSHing into your Raspberry Pi, then attach logs
              manually:
            </p>
            <pre
              class="text-gray-500 mt-2 text-sm text-indigo-500"
              v-if="store.crashReport"
            >
$ printnanny crash-report --id={{ store.crashReport?.id }}
</pre
            >
            <pre class="text-gray-500 mt-2 text-sm text-indigo-500" v-else>
$ printnanny crash-report
</pre
            >

            <p class="text-gray-500 mt-2 text-sm">Thank you!</p>
          </div>
        </div>
      </div>
      <div class="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
        <button
          type="submit"
          :disabled="loading"
          class="disabled:opacity-50 disabled:cursor-not-allowed inline-flex w-full justify-center rounded-md border border-transparent bg-red-500 px-4 py-2 text-base font-medium text-white shadow-sm enabled:hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm"
        >
          Submit
        </button>
        <button
          type="button"
          :disabled="loading"
          class="disabled:opacity-50 disabled:cursor-not-allowed mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm enabled:hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
          @click="store.showCrashReportForm = false"
          ref="cancelButtonRef"
        >
          Cancel
        </button>
        <text-spinner
          v-if="loading"
          class="mr-2 text-gray-500 stroke-gray-500"
          text="Sending..."
        ></text-spinner>
      </div>
    </div>
  </Form>
</template>
<script setup lang="ts">
import { ref } from "vue";
import * as yup from "yup";
import { Form, Field, ErrorMessage } from "vee-validate";
import { ExclamationTriangleIcon } from "@heroicons/vue/24/outline";
import TextSpinner from "@/components/TextSpinner.vue";
import { useAlertStore } from "@/stores/alerts";
import { useCloudStore } from "@/stores/cloud";

const store = useAlertStore();
const account = useCloudStore();

const browserVersion = ref(window.navigator.userAgent);

const initialValues = { email: account.user ? account.user.email : "" };

const consent = ref(false);
const loading = ref(false);

const schema = yup.object({
  browser: yup.string(),
  email: yup.string().email().required("Please enter your email address"),
  description: yup.string().required("Please describe what you were doing"),
  consent: yup
    .bool()
    .required("Please consent to sharing data with PrintNanny Cloud"),
});

async function submitForm(values: any) {
  if (consent.value !== true) {
    console.warn("Form was submitted but consent field was false");
  }
  loading.value = true;
  console.log("Form submitted:", toRaw(values));
  const ok = await store.sendCrashReport(
    values.browser,
    values.email,
    values.description
  );
  loading.value = false;
  if (ok === true) {
    store.showCrashReportForm = false;
  }
}
</script>
