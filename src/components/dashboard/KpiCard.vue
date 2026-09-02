<script setup>
defineProps({
  label: {
    type: String,
    required: true
  },

  value: {
    type: [String, Number],
    required: true
  },

  description: {
    type: String,
    default: ''
  },

  icon: {
    type: String,
    default: 'mdi-chart-line'
  },

  trend: {
    type: String,
    default: ''
  }
})
</script>

<template>
  <div class="kpi-card">

    <div class="kpi-header">

      <div class="kpi-label">
        {{ label }}
      </div>

      <div class="kpi-icon">
        <v-icon
          :icon="icon"
          size="17"
        />
      </div>

    </div>

    <div class="kpi-value">
      {{ value }}
    </div>

    <div class="kpi-footer">

      <span class="kpi-description">
        {{ description }}
      </span>

      <span
        v-if="trend"
        class="kpi-trend"
      >
        {{ trend }}
      </span>

    </div>

  </div>
</template>

<style scoped>
.kpi-card {
  position: relative;

  padding: 20px;

  border: 1px solid rgba(255, 255, 255, 0.055);
  border-radius: 10px;

  background:
    linear-gradient(
      135deg,
      rgba(255, 255, 255, 0.035),
      rgba(255, 255, 255, 0.012)
    );

  transition:
    border-color 0.2s ease,
    transform 0.2s ease;
}

.kpi-card:hover {
  border-color: rgba(124, 255, 107, 0.18);
  transform: translateY(-1px);
}

.kpi-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.kpi-label {
  color: #52525b;

  font-size: 9px;
  font-weight: 700;

  letter-spacing: 0.16em;
}

.kpi-icon {
  width: 30px;
  height: 30px;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 7px;

  color: #7cff6b;

  background: rgba(124, 255, 107, 0.055);
}

.kpi-value {
  margin-top: 14px;

  color: #f4f4f5;

  font-size: 30px;
  font-weight: 600;

  letter-spacing: -0.04em;
}

.kpi-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;

  margin-top: 8px;
}

.kpi-description {
  color: #3f3f46;

  font-size: 9px;
}

.kpi-trend {
  color: #7cff6b;

  font-size: 9px;
  font-weight: 600;
}
</style>