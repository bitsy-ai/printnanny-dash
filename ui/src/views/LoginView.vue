<template>
  <div class="py-10">
    <header>
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
        <transition name="slide-fade" appear :duration="800">
          <h1 class="text-3xl font-bold text-gray-800 prose text-center w-full">
            {{ pageTitle }}
          </h1>
        </transition>
        <transition name="bounce" appear :duration="1200">
          <img
            class="mx-auto h-24 w-auto my-2"
            src="@/assets/logos/printnanny/logo.svg"
            alt="PrintNanny"
          />
        </transition>
        <transition name="slide-fade" appear :duration="1200">
          <h2
            class="text-lg font-bold text-gray-600 prose text-center w-full mx-auto my-4"
          >
            {{ pageExtra }}
          </h2>
        </transition>
      </div>
    </header>
    <main>
      <transition name="fade" appear :duration="1600">
        <div class="mx-auto max-w-7xl sm:p-6 lg:p-8">
          <CloudAccountLogin />
        </div>
      </transition>
    </main>
  </div>
</template>

<script setup lang="ts">
import CloudAccountLogin from "@/components/cloud/CloudAccountLogin.vue";

const pageTitle = "👋 Welcome to PrintNanny OS";

const pageExtra =
  "This dashboard is like Mission Control for your Raspberry Pi.";
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
