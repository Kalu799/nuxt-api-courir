<script setup>
const route = useRoute()

const showLayout = computed(() => {
  return route.path !== '/login'
})
</script>

<template>
  <div class="app-shell">
    <AdminHeader v-if="showLayout" />

    <main class="app-main">
      <NuxtPage />
    </main>

    <AdminFooter v-if="showLayout" />
  </div>
</template>

<style>
html,
body,
#__nuxt {
  min-height: 100%;
  margin: 0;
}

body {
  font-family:
    system-ui,
    -apple-system,
    BlinkMacSystemFont,
    "Segoe UI",
    sans-serif;
}

.app-shell {
  display: flex;
  flex-direction: column;

  min-height: 100vh;
}

.app-main {
  flex: 1;

  background-color: #f7f8f5;
}
</style>