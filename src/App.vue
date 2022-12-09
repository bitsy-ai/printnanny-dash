<template>
  <div class="h-full">
    <StickyAlerts />
    <router-view class="view left-sidebar" name="TopNav"> </router-view>
    <router-view class="view main-content lg:min-h-[32rem] 2xl:min-h-[62rem]"></router-view>
    <router-view class="view right-sidebar" name="FooterNav">
      <FooterNav />
    </router-view>
  </div>
</template>

<script setup lang="ts">
import { RouterView } from "vue-router";
import StickyAlerts from "./components/StickyAlerts.vue";
import FooterNav from "@/components/nav/FooterNav.vue";

// only enable tidio in production
const tidioScript = import.meta.env.VITE_TIDIO_SCRIPT_URI;
if (tidioScript !== undefined) {
  const el = document.createElement("script");
  el.setAttribute("src", tidioScript);
  document.body.appendChild(el);
}
</script>
