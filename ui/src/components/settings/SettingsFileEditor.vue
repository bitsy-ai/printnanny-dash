<template>
    <div class="divide-y divide-gray-200 lg:col-span-9 flex">
        <Transition name="fade" mode="out-in" :duration="{ enter: 800, leave: 500 }">
            <TextSpinner text-size="xl" spinner-size="64" class="m-auto" v-if="store.loading"/>

            <div v-else-if="selectedFile">
                <Listbox v-model="selectedFile">
                    <ListboxButton>{{ selectedFile.file_name }}</ListboxButton>
                    <ListboxOptions>
                    <ListboxOption
                        v-for="file in store.settingsFiles"
                        :key="file.file_name"
                        :value="file"
                    >
                        {{ file.file_name }}
                    </ListboxOption>
                    </ListboxOptions>
                </Listbox>
                <codemirror
                    :key="selectedFile.file_name"
                    v-model="selectedFile.content"
                    :style="{ height: '400px' }"
                    :autofocus="true"
                    :indent-with-tab="true"
                    :tab-size="2"
                />
            </div>
        </Transition>
    </div>
</template>
<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useSettingsFileStore } from '@/stores/settingsFile';
import TextSpinner from "@/components/TextSpinner.vue";
import {
    Listbox,
    ListboxButton,
    ListboxOptions,
    ListboxOption,
  } from '@headlessui/vue'

import type { SettingsFile } from '@bitsy-ai/printnanny-asyncapi-models';

const store = useSettingsFileStore();

const selectedFile = ref(null as null | SettingsFile);

onMounted(async () => {
    await store.load();
    selectedFile.value = store.settingsFiles[0]
})

</script>