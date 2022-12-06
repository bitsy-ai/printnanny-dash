<!-- <template>
  <div class="flex w-full">
    <div
      v-if="widgets.configs == undefined"
      class="h-24 text-center w-full m-auto"
    >
      <TextSpinner
        text="Loading config information..."
        class="h-24 w-full m-auto pl-4"
      ></TextSpinner>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-2" v-else>
      <div>
        <select
          v-model="selectedFile"
          class="form-select appearance-none block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding bg-no-repeat border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
          @change="updateEditor"
        >
          <option v-for="file in widgets.configs">
            {{ file.filename }}
          </option>
        </select>
      </div>
      <div>
        <codemirror
          v-model="code"
          placeholder="hello, world"
          :style="{ height: '400px' }"
          :autofocus="true"
          :indent-with-tab="true"
          :tab-size="2"
        />
      </div>
      <div id="editor"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import TextSpinner from "@/components/TextSpinner.vue";

const widgets = useWidgetStore();
const selectedFile = ref("");
const code = ref("hrm");

widgets.loadConfigs().then(() => {
  if (widgets.configs !== undefined && widgets.configs.length > 0) {
    selectedFile.value = widgets.configs[0].filename;
    code.value = widgets.configs[0].content;
  }
});

const updateEditor = function (event: Event) {
  let idx = (event.target as HTMLSelectElement).selectedIndex;
  if (widgets.configs !== undefined && widgets.configs.length >= idx) {
    code.value = widgets.configs[idx].content;
  }
};
</script> -->
