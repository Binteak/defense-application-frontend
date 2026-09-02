<script setup>
const navigation = [
  {
    title: 'Overview',
    subtitle: 'Command center',
    icon: 'mdi-view-dashboard-outline',
    route: '/'
  },
  {
    title: 'Operations',
    subtitle: 'Live operations',
    icon: 'mdi-radar',
    route: '/operations'
  },
  {
    title: 'Intelligence',
    subtitle: 'Reports & events',
    icon: 'mdi-brain',
    route: '/intelligence'
  },
  {
    title: 'Analytics',
    subtitle: 'Operational data',
    icon: 'mdi-chart-line',
    route: '/analytics'
  },
  {
    title: 'Situational Map',
    subtitle: 'Geospatial view',
    icon: 'mdi-map-outline',
    route: '/map'
  }
]
</script>

<template>
  <v-navigation-drawer
    permanent
    width="270"
    class="app-sidebar"
  >
    <div class="sidebar-wrapper">

      <!-- BRAND -->

      <div class="brand">

        <div class="brand-mark">
          <v-icon
            icon="mdi-shield-outline"
            size="22"
          />
        </div>

        <div class="brand-info">

          <div class="brand-name">
            AEGIS<span>.</span>
          </div>

          <div class="brand-subtitle">
            Command Platform
          </div>

        </div>

      </div>


      <!-- SYSTEM -->

      <div class="system-status">

        <span class="status-dot"></span>

        <div>

          <div class="status-label">
            SYSTEM STATUS
          </div>

          <div class="status-value">
            ALL SYSTEMS OPERATIONAL
          </div>

        </div>

      </div>


      <!-- NAVIGATION -->

      <div class="navigation-section">

        <div class="navigation-label">
          OPERATIONS
        </div>

        <nav>

          <RouterLink
            v-for="item in navigation"
            :key="item.route"
            :to="item.route"
            class="navigation-item"
          >

            <div class="navigation-icon">

              <v-icon
                :icon="item.icon"
                size="19"
              />

            </div>

            <div class="navigation-content">

              <div class="navigation-title">
                {{ item.title }}
              </div>

              <div class="navigation-subtitle">
                {{ item.subtitle }}
              </div>

            </div>

          </RouterLink>

        </nav>

      </div>


      <!-- BOTTOM -->

      <div class="sidebar-bottom">

        <div class="security-card">

          <div class="security-header">

            <div class="security-icon">
              <v-icon
                icon="mdi-lock-outline"
                size="16"
              />
            </div>

            <span>
              SECURE ENVIRONMENT
            </span>

          </div>

          <div class="security-description">
            Encrypted operational connection
          </div>

          <div class="security-indicator">

            <span></span>

            CONNECTION SECURED

          </div>

        </div>

        <div class="sidebar-version">
          AEGIS PLATFORM · v1.0.0
        </div>

      </div>

    </div>
  </v-navigation-drawer>
</template>

<style scoped>
.app-sidebar {
  background: #090d12 !important;
  border-right: 1px solid rgba(255, 255, 255, 0.055);
}

.sidebar-wrapper {
  height: 100%;
  display: flex;
  flex-direction: column;
}


/* BRAND */

.brand {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 28px 24px 24px;
}

.brand-mark {
  width: 40px;
  height: 40px;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 10px;

  background: rgba(124, 255, 107, 0.08);
  border: 1px solid rgba(124, 255, 107, 0.18);

  color: #7cff6b;
}

.brand-name {
  color: #f4f4f5;

  font-size: 17px;
  font-weight: 700;

  letter-spacing: 0.18em;
}

.brand-name span {
  color: #7cff6b;
}

.brand-subtitle {
  margin-top: 2px;

  color: #52525b;

  font-size: 9px;
  font-weight: 600;

  letter-spacing: 0.17em;
  text-transform: uppercase;
}


/* SYSTEM STATUS */

.system-status {
  display: flex;
  align-items: center;
  gap: 10px;

  margin: 0 18px 28px;
  padding: 12px;

  border: 1px solid rgba(124, 255, 107, 0.08);
  border-radius: 9px;

  background: rgba(124, 255, 107, 0.025);
}

.status-dot {
  width: 7px;
  height: 7px;

  flex-shrink: 0;

  border-radius: 50%;

  background: #7cff6b;

  box-shadow: 0 0 10px rgba(124, 255, 107, 0.5);
}

.status-label {
  color: #52525b;

  font-size: 8px;
  font-weight: 700;

  letter-spacing: 0.14em;
}

.status-value {
  margin-top: 3px;

  color: #71717a;

  font-size: 9px;

  letter-spacing: 0.03em;
}


/* NAVIGATION */

.navigation-section {
  padding: 0 12px;
}

.navigation-label {
  padding: 0 12px 10px;

  color: #3f3f46;

  font-size: 9px;
  font-weight: 700;

  letter-spacing: 0.2em;
}

.navigation-item {
  position: relative;

  display: flex;
  align-items: center;

  gap: 12px;

  min-height: 58px;

  margin-bottom: 3px;
  padding: 9px 12px;

  border-radius: 9px;

  color: #71717a;

  text-decoration: none;

  transition:
    background 0.2s ease,
    color 0.2s ease;
}

.navigation-item:hover {
  background: rgba(255, 255, 255, 0.025);
  color: #a1a1aa;
}

.navigation-item.router-link-active {
  background: rgba(124, 255, 107, 0.055);
  color: #7cff6b;
}

.navigation-item.router-link-active::before {
  content: '';

  position: absolute;

  left: -12px;
  top: 12px;
  bottom: 12px;

  width: 2px;

  border-radius: 0 3px 3px 0;

  background: #7cff6b;

  box-shadow: 0 0 10px rgba(124, 255, 107, 0.4);
}

.navigation-icon {
  width: 34px;
  height: 34px;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 8px;

  background: rgba(255, 255, 255, 0.02);
}

.navigation-item.router-link-active .navigation-icon {
  background: rgba(124, 255, 107, 0.08);
}

.navigation-content {
  min-width: 0;
}

.navigation-title {
  font-size: 12px;
  font-weight: 600;
}

.navigation-subtitle {
  margin-top: 3px;

  color: #3f3f46;

  font-size: 9px;
}

.navigation-item.router-link-active .navigation-subtitle {
  color: rgba(124, 255, 107, 0.45);
}


/* BOTTOM */

.sidebar-bottom {
  margin-top: auto;

  padding: 18px;
}

.security-card {
  padding: 13px;

  border: 1px solid rgba(255, 255, 255, 0.045);
  border-radius: 9px;

  background: rgba(255, 255, 255, 0.015);
}

.security-header {
  display: flex;
  align-items: center;
  gap: 8px;

  color: #71717a;

  font-size: 8px;
  font-weight: 700;

  letter-spacing: 0.14em;
}

.security-icon {
  color: #7cff6b;
}

.security-description {
  margin-top: 8px;

  color: #52525b;

  font-size: 10px;
}

.security-indicator {
  display: flex;
  align-items: center;
  gap: 6px;

  margin-top: 10px;

  color: #7cff6b;

  font-size: 8px;
  font-weight: 600;

  letter-spacing: 0.08em;
}

.security-indicator span {
  width: 5px;
  height: 5px;

  border-radius: 50%;

  background: #7cff6b;
}

.sidebar-version {
  margin-top: 14px;

  text-align: center;

  color: #27272a;

  font-size: 8px;

  letter-spacing: 0.12em;
}
</style>