<template>
  <div class="py-10">
    <header>
      <div
        class="flex grid grid-columns-1 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center"
      >
        <transition name="slide-fade" appear :duration="800">
          <h1
            class="flex text-3xl font-bold text-gray-800 prose text-center mx-auto"
          >
            {{ pageTitle }}
          </h1>
        </transition>
        <h2
          class="flex text-lg font-bold text-gray-600 prose text-center mx-auto my-4"
        >
          <TextSpinner
            text-size="xl"
            spinner-size="64"
            class="text-gray-500 stroke-gray-500 text-center"
            :text="pageExtra"
          ></TextSpinner>
        </h2>

        <transition name="bounce" appear :duration="1200">
          <img
            class="mx-auto flex w-auto my-2 opacity-50"
            src="@/assets/logos/printnanny/logo.svg"
            alt="PrintNanny"
          />
        </transition>
      </div>
    </header>
    <main></main>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { useSystemdServiceStore } from "@/stores/systemdService";
import { WIDGETS } from "@/types";
import { useRouter } from "vue-router";
import TextSpinner from "@/components/TextSpinner.vue";

const widget = WIDGETS["printnanny-online"];
const store = useSystemdServiceStore(widget);
const timeout = 300000; // 5 minutes in ms
const interval = 2000; // 2 seconds

onMounted(async () => {
  await store.pollReady(timeout, interval);
  const router = useRouter();
  router.push({ name: "Home" });
});

const pageTitle = "PrintNanny OS is Starting";

const pageExtra = "You'll be redirected when PrintNanny is ready to use.";
</script>

<style>
.bounce-enter-active {
  animation: bounce-in 1s;
}
.bounce-leave-active {
  animation: bounce-in 1s reverse;
}
@keyframes bounce-in {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.25);
  }
  100% {
    transform: scale(1);
  }
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
.slide-fade-enter-active {
  transition: all 0.4s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.8s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateX(30px);
  opacity: 0;
}
</style>
