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
        class="m-auto"
        v-if="store.loading"
      />

      <div
        v-else-if="selectedFile"
        class="divide-y divide-gray-200 pt-6 w-full"
      >
        <div class="py-6 px-4 sm:p-6 lg:pb-8">
          <h2 class="text-lg font-medium leading-6 text-gray-900 py-4">
            Edit Settings Files
          </h2>

          <Listbox as="div" v-model="selectedFile" class="md:w-3/4">
            <ListboxLabel class="block text-sm font-medium text-gray-700"
              >Select a file:</ListboxLabel
            >
            <div class="relative mt-1">
              <ListboxButton
                class="relative w-full cursor-default rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 text-left shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm"
              >
                <span class="block truncate">{{ selectedFile.file_name }}</span>
                <span
                  class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2"
                >
                  <ChevronUpDownIcon
                    class="h-5 w-5 text-gray-400"
                    aria-hidden="true"
                  />
                </span>
              </ListboxButton>

              <transition
                leave-active-class="transition ease-in duration-100"
                leave-from-class="opacity-100"
                leave-to-class="opacity-0"
              >
                <ListboxOptions
                  class="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
                >
                  <ListboxOption
                    as="template"
                    v-for="file in store.settingsFiles"
                    :key="file.file_name"
                    :value="file"
                    v-slot="{ active, selected }"
                  >
                    <li
                      :class="[
                        active ? 'text-white bg-indigo-600' : 'text-gray-900',
                        'relative cursor-default select-none py-2 pl-3 pr-9',
                      ]"
                    >
                      <span
                        :class="[
                          selected ? 'font-semibold' : 'font-normal',
                          'block truncate',
                        ]"
                        >{{ file.file_name }}</span
                      >

                      <span
                        v-if="selected"
                        :class="[
                          active ? 'text-white' : 'text-indigo-600',
                          'absolute inset-y-0 right-0 flex items-center pr-4',
                        ]"
                      >
                        <CheckIcon class="h-5 w-5" aria-hidden="true" />
                      </span>
                    </li>
                  </ListboxOption>
                </ListboxOptions>
              </transition>
            </div>
          </Listbox>
        </div>

        <div class="py-6 lg:pb-8">
          <codemirror
            :key="selectedFile.file_name"
            v-model="selectedFile.content"
            class="py-6 px-4 sm:p-6 lg:pb-8"
          />
        </div>
        <div class="py-6 lg:pb-8">
          <h2 class="text-lg font-medium leading-6 text-gray-900 py-2">
            Describe your changes:
          </h2>
          <p class="text-sm text-gray-500 mb-2">
            Your description is saved as a git commit message, so you can revert
            back to a previous state.
          </p>
          <codemirror
            key="commitMsg"
            v-model="commitMsg"
            class="py-6 px-4 sm:p-6 lg:pb-8"
          />
        </div>
        <div class="flex justify-end py-4 px-4 sm:px-6">
          <button
            type="button"
            @click="store.load"
            class="inline-flex justify-center rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
          >
            Cancel
          </button>
          <button
            type="button"
            @click="applyChanges"
            class="ml-5 inline-flex justify-center rounded-md border border-transparent bg-indigo-500 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
          >
            Save
          </button>
        </div>
      </div>
    </Transition>
  </div>
</template>
<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import { useSettingsFileStore } from "@/stores/settingsFile";
import { ChevronUpDownIcon } from "@heroicons/vue/24/outline";
import { CheckIcon } from "@heroicons/vue/24/solid";
import TextSpinner from "@/components/TextSpinner.vue";
import {
  Listbox,
  ListboxButton,
  ListboxOptions,
  ListboxOption,
  ListboxLabel,
} from "@headlessui/vue";

import type { SettingsFile } from "@bitsy-ai/printnanny-asyncapi-models";

const props = defineProps({
  app: {
    type: String,
    default: "printnanny",
  },
});

const store = useSettingsFileStore();

const selectedFile = ref(null as null | SettingsFile);
let now = new Date();
const commitMsg = ref(`Updated settings at ${now}`);

function applyChanges() {
  store.apply(selectedFile.value as SettingsFile, commitMsg.value);
}

onMounted(async () => {
  await store.load();
  selectedFile.value =
    store.settingsFiles.find((el) => el.app == props.app) ||
    store.settingsFiles[0];
  commitMsg;
});

watch(selectedFile, async (newValue, _oldValue) => {
  now = new Date();
  commitMsg.value = `Updated ${newValue?.app} settings at ${now}`;
});
</script>
