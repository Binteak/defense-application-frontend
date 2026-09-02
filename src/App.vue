<script setup>
import AppSidebar from './components/layout/AppSidebar.vue'
import AppTopbar from './components/layout/AppTopbar.vue'
</script>

<template>
  <v-app>

    <AppSidebar />

    <AppTopbar />

    <v-main class="app-main">
      <router-view />
    </v-main>

  </v-app>
</template>


<style scoped>
.app-main {
  min-height: 100vh;
  box-sizing: border-box;

  /* Área disponible después del sidebar */
  margin-left: 240px;

  /* Espacio debajo del topbar */
  padding-top: 72px;

  background:
    radial-gradient(
      circle at 75% 0%,
      rgba(124, 255, 107, 0.018),
      transparent 35%
    ),
    #070a0d;
}

/* Pantallas grandes */
@media (min-width: 1400px) {
  .app-main {
    padding-left: 20px;
    padding-right: 20px;
  }
}

/* Tablet */
@media (max-width: 900px) {
  .app-main {
    margin-left: 0;
    padding-left: 16px;
    padding-right: 16px;
  }
}

/* Móvil */
@media (max-width: 600px) {
  .app-main {
    padding-top: 64px;
    padding-left: 10px;
    padding-right: 10px;
  }
}
</style>

