<script setup>
defineProps({
  compact: {
    type: Boolean,
    default: false
  }
})
</script>

<template>
  <div class="system">
    <div class="system-indicator">
      <span class="pulse"></span>
      <span class="dot"></span>
    </div>

    <div v-if="!compact">
      <div class="label">
        SYSTEM STATUS
      </div>

      <div class="value">
        OPERATIONAL
      </div>
    </div>
  </div>
</template>

<style scoped>
.system {
  display: flex;
  align-items: center;
  gap: 9px;
}

.system-indicator {
  position: relative;
  width: 8px;
  height: 8px;
}

.dot {
  position: absolute;
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #7cff6b;
}

.pulse {
  position: absolute;
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #7cff6b;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% {
    transform: scale(1);
    opacity: 0.5;
  }

  70% {
    transform: scale(2.5);
    opacity: 0;
  }

  100% {
    transform: scale(2.5);
    opacity: 0;
  }
}

.label {
  color: #52525b;
  font-size: 8px;
  font-weight: 700;
  letter-spacing: 0.16em;
}

.value {
  margin-top: 2px;
  color: #7cff6b;
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.04em;
}
</style>