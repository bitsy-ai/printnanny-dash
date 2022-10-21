<template>
<div class="flex w-full p-2">
    <div v-if="cloudStore.user !== undefined">
    </div>
    <Form @submit="submitStage1" v-if="formStage ==1" :validation-schema="formSchema1" class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-full md:w-1/2 mx-auto">
        <h2 class="text-xl font-bold text-gray-900 prose mb-4">
          Connect Account
        </h2>
        <div class="mb-4">
        <label class="block text-gray-700 text-sm font-bold mb-2" for="email">
            Email
            <ErrorMessage name="email" />
        </label>
        <Field name="email" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="email" type="text" placeholder="Enter your email address" />
        </div>
        <div class="flex items-center justify-between">
        <button class="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit">
            Send temporary login code
        </button>
        </div>
    </Form>
</div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Field, Form, ErrorMessage } from 'vee-validate';
import * as yup from 'yup';
import { useCloudStore } from "@/stores/cloud";

const formStage = ref(1);
const cloud = useCloudStore();

async function submitStage1(values: any){
    const res = await cloud.twoFactorStage1(values.email);
    if (res === true){
        formStage.value = 2
    }
}

const formSchema1 = yup.object({
  email: yup.string().required().email(),
//   twoFactorCode: yup.string().required(),
});

const cloudStore = useCloudStore();
</script>