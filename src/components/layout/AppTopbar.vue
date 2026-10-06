<script setup>
import SystemStatus from './SystemStatus.vue'
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const currentScreen = computed(() => {
  const name = route.name === 'dashboard' ? 'Overview' : route.name

  return name
    ? name.charAt(0).toUpperCase() + name.slice(1)
    : ''
})
</script>

<template>
  <v-app-bar
    height="72"
    flat
    class="app-topbar"
  >
    <div class="topbar-content">

      <!-- LEFT -->

      <div class="topbar-left">

        <div class="breadcrumb">
          AEGIS
        </div>

        <div class="separator">
          /
        </div>

        <div class="current">
          {{ currentScreen }}
        </div>

      </div>


      <!-- RIGHT -->

      <div class="topbar-right">

        <SystemStatus />

        <div class="vertical-separator"></div>

        <button class="icon-button">

          <v-icon
            icon="mdi-bell-outline"
            size="19"
          />

          <span class="notification"></span>

        </button>

        <div class="vertical-separator"></div>

        <button class="profile">

          <div class="avatar">

            <v-icon
              icon="mdi-account-outline"
              size="18"
            />

          </div>

          <div class="profile-info">

            <div class="profile-name">
              Operator
            </div>

            <div class="profile-role">
              COMMAND USER
            </div>

          </div>

          <v-icon
            icon="mdi-chevron-down"
            size="16"
            class="profile-arrow"
          />

        </button>

      </div>

    </div>
  </v-app-bar>
</template>

<style scoped>
.app-topbar {
  background: rgba(7, 10, 13, 0.9) !important;
  border-bottom: 1px solid rgba(255, 255, 255, 0.055);
  backdrop-filter: blur(16px);
}

.topbar-content {
  width: 100%;

  display: flex;
  align-items: center;
  justify-content: space-between;

  padding: 0 24px;
}

.topbar-left,
.topbar-right {
  display: flex;
  align-items: center;
}

.topbar-left {
  gap: 9px;
}

.breadcrumb {
  color: #52525b;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.separator {
  color: #27272a;
  font-size: 13px;
}

.current {
  color: #a1a1aa;
  font-size: 11px;
  font-weight: 500;
}

.topbar-right {
  gap: 18px;
}

.vertical-separator {
  width: 1px;
  height: 22px;
  background: rgba(255, 255, 255, 0.06);
}

.icon-button {
  position: relative;

  display: flex;
  align-items: center;
  justify-content: center;

  width: 34px;
  height: 34px;

  border: none;
  border-radius: 8px;

  background: transparent;

  color: #71717a;

  cursor: pointer;

  transition: 0.2s ease;
}

.icon-button:hover {
  background: rgba(255, 255, 255, 0.04);
  color: #d4d4d8;
}

.notification {
  position: absolute;

  top: 7px;
  right: 7px;

  width: 5px;
  height: 5px;

  border-radius: 50%;

  background: #7cff6b;
}

.profile {
  display: flex;
  align-items: center;
  gap: 9px;

  border: none;
  background: transparent;

  color: inherit;

  cursor: pointer;
}

.avatar {
  width: 34px;
  height: 34px;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 9px;

  background: #11161c;

  border: 1px solid rgba(255, 255, 255, 0.07);

  color: #a1a1aa;
}

.profile-info {
  text-align: left;
}

.profile-name {
  color: #a1a1aa;

  font-size: 10px;
  font-weight: 600;
}

.profile-role {
  margin-top: 2px;

  color: #3f3f46;

  font-size: 8px;

  letter-spacing: 0.12em;
}

.profile-arrow {
  color: #3f3f46;
}

@media (max-width: 700px) {
  .profile-info,
  .profile-arrow {
    display: none;
  }

  .topbar-content {
    padding: 0 16px;
  }

  .topbar-right {
    gap: 10px;
  }
}
</style>