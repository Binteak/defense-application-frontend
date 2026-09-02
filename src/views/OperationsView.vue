<script setup>
import { computed, ref } from 'vue'

const search = ref('')
const statusFilter = ref('ALL')

const incidents = [
  {
    id: 'INC-1048',
    sector: 'NORTH',
    type: 'Perimeter Alert',
    asset: 'ASSET-042',
    status: 'ACTIVE',
    priority: 'HIGH',
    time: '18:04:21'
  },
  {
    id: 'INC-1047',
    sector: 'EAST',
    type: 'Sensor Anomaly',
    asset: 'ASSET-087',
    status: 'INVESTIGATING',
    priority: 'MEDIUM',
    time: '17:58:03'
  },
  {
    id: 'INC-1046',
    sector: 'SOUTH',
    type: 'Communication Loss',
    asset: 'ASSET-031',
    status: 'RESOLVED',
    priority: 'LOW',
    time: '17:42:19'
  },
  {
    id: 'INC-1045',
    sector: 'WEST',
    type: 'Unauthorized Access',
    asset: 'ASSET-019',
    status: 'ACTIVE',
    priority: 'CRITICAL',
    time: '17:31:44'
  },
  {
    id: 'INC-1044',
    sector: 'NORTH',
    type: 'Environmental Alert',
    asset: 'ASSET-063',
    status: 'RESOLVED',
    priority: 'LOW',
    time: '17:18:12'
  },
  {
    id: 'INC-1043',
    sector: 'EAST',
    type: 'System Warning',
    asset: 'ASSET-091',
    status: 'INVESTIGATING',
    priority: 'MEDIUM',
    time: '17:02:56'
  }
]

const filteredIncidents = computed(() => {
  return incidents.filter((incident) => {

    const matchesSearch =
      incident.id.toLowerCase().includes(search.value.toLowerCase()) ||
      incident.type.toLowerCase().includes(search.value.toLowerCase()) ||
      incident.sector.toLowerCase().includes(search.value.toLowerCase())

    const matchesStatus =
      statusFilter.value === 'ALL' ||
      incident.status === statusFilter.value

    return matchesSearch && matchesStatus
  })
})

const getStatusClass = (status) => {
  return status.toLowerCase()
}

const getPriorityClass = (priority) => {
  return priority.toLowerCase()
}
</script>

<template>
  <div class="operations">

    <!-- HEADER -->

    <section class="page-header">

      <div>

        <div class="eyebrow">
          OPERATIONS CONTROL
        </div>

        <h1>
          Operations
        </h1>

        <p>
          Monitor incidents, assets and operational events across active sectors.
        </p>

      </div>

      <div class="system-state">

        <span class="state-dot"></span>

        ALL SYSTEMS OPERATIONAL

      </div>

    </section>


    <!-- SUMMARY -->

    <section class="summary-grid">

      <div class="summary-card">

        <span class="summary-label">
          ACTIVE INCIDENTS
        </span>

        <strong>
          18
        </strong>

        <span class="summary-meta">
          +3 since last hour
        </span>

      </div>


      <div class="summary-card critical">

        <span class="summary-label">
          CRITICAL
        </span>

        <strong>
          03
        </strong>

        <span class="summary-meta">
          Immediate attention
        </span>

      </div>


      <div class="summary-card">

        <span class="summary-label">
          INVESTIGATING
        </span>

        <strong>
          07
        </strong>

        <span class="summary-meta">
          Under review
        </span>

      </div>


      <div class="summary-card">

        <span class="summary-label">
          RESOLVED
        </span>

        <strong>
          142
        </strong>

        <span class="summary-meta">
          Last 30 days
        </span>

      </div>

    </section>


    <!-- INCIDENT TABLE -->

    <section class="panel">

      <div class="panel-header">

        <div>

          <div class="panel-label">
            INCIDENT MANAGEMENT
          </div>

          <div class="panel-title">
            Active operational events
          </div>

        </div>

        <div class="panel-controls">

          <div class="search">

            <v-icon
              icon="mdi-magnify"
              size="15"
            />

            <input
              v-model="search"
              placeholder="Search incidents..."
            />

          </div>

          <select v-model="statusFilter">

            <option value="ALL">
              ALL STATUS
            </option>

            <option value="ACTIVE">
              ACTIVE
            </option>

            <option value="INVESTIGATING">
              INVESTIGATING
            </option>

            <option value="RESOLVED">
              RESOLVED
            </option>

          </select>

        </div>

      </div>


      <div class="table-wrapper">

        <table>

          <thead>

            <tr>

              <th>
                INCIDENT
              </th>

              <th>
                SECTOR
              </th>

              <th>
                TYPE
              </th>

              <th>
                ASSET
              </th>

              <th>
                STATUS
              </th>

              <th>
                PRIORITY
              </th>

              <th>
                TIME
              </th>

            </tr>

          </thead>

          <tbody>

            <tr
              v-for="incident in filteredIncidents"
              :key="incident.id"
            >

              <td class="incident-id">
                {{ incident.id }}
              </td>

              <td>
                {{ incident.sector }}
              </td>

              <td>
                {{ incident.type }}
              </td>

              <td class="asset">
                {{ incident.asset }}
              </td>

              <td>

                <span
                  class="status"
                  :class="getStatusClass(incident.status)"
                >

                  <span></span>

                  {{ incident.status }}

                </span>

              </td>

              <td>

                <span
                  class="priority"
                  :class="getPriorityClass(incident.priority)"
                >
                  {{ incident.priority }}
                </span>

              </td>

              <td class="time">
                {{ incident.time }}
              </td>

            </tr>

          </tbody>

        </table>

        <div
          v-if="filteredIncidents.length === 0"
          class="empty"
        >
          No incidents match the current filters.
        </div>

      </div>

    </section>


    <!-- LOWER GRID -->

    <section class="lower-grid">

      <div class="panel activity">

        <div class="panel-header">

          <div>

            <div class="panel-label">
              EVENT STREAM
            </div>

            <div class="panel-title">
              Recent activity
            </div>

          </div>

          <span class="live">
            LIVE
          </span>

        </div>


        <div class="timeline">

          <div class="timeline-item">

            <span class="timeline-dot critical"></span>

            <div>

              <strong>
                Critical incident detected
              </strong>

              <p>
                Unauthorized access · WEST
              </p>

            </div>

            <time>
              17:31
            </time>

          </div>


          <div class="timeline-item">

            <span class="timeline-dot"></span>

            <div>

              <strong>
                Unit dispatched
              </strong>

              <p>
                ASSET-019 assigned to incident
              </p>

            </div>

            <time>
              17:34
            </time>

          </div>


          <div class="timeline-item">

            <span class="timeline-dot warning"></span>

            <div>

              <strong>
                Sensor anomaly detected
              </strong>

              <p>
                ASSET-087 · EAST
              </p>

            </div>

            <time>
              17:58
            </time>

          </div>


          <div class="timeline-item">

            <span class="timeline-dot"></span>

            <div>

              <strong>
                System synchronization
              </strong>

              <p>
                All operational nodes synchronized
              </p>

            </div>

            <time>
              18:06
            </time>

          </div>

        </div>

      </div>


      <div class="panel">

        <div class="panel-header">

          <div>

            <div class="panel-label">
              OPERATIONAL HEALTH
            </div>

            <div class="panel-title">
              Infrastructure status
            </div>

          </div>

        </div>


        <div class="health-list">

          <div class="health-row">

            <span>
              Network
            </span>

            <strong>
              99.99%
            </strong>

            <span class="health-ok">
              ONLINE
            </span>

          </div>


          <div class="health-row">

            <span>
              Sensors
            </span>

            <strong>
              98.72%
            </strong>

            <span class="health-ok">
              ONLINE
            </span>

          </div>


          <div class="health-row">

            <span>
              Communications
            </span>

            <strong>
              99.96%
            </strong>

            <span class="health-ok">
              ONLINE
            </span>

          </div>


          <div class="health-row">

            <span>
              Processing
            </span>

            <strong>
              99.98%
            </strong>

            <span class="health-ok">
              ONLINE
            </span>

          </div>

        </div>

      </div>

    </section>

  </div>
</template>

<style scoped>

.operations {
  max-width: 1600px;

  margin: 0 auto;

  padding: 34px 38px 50px;
}


/* HEADER */

.page-header {
  display: flex;

  align-items: flex-end;

  justify-content: space-between;

  margin-bottom: 30px;
}

.eyebrow,
.panel-label {
  color: #52525b;

  font-size: 9px;

  font-weight: 700;

  letter-spacing: .18em;
}

.page-header h1 {
  margin: 7px 0 5px;

  color: #f4f4f5;

  font-size: 29px;

  font-weight: 500;

  letter-spacing: -.035em;
}

.page-header p {
  color: #52525b;

  font-size: 11px;
}

.system-state {
  display: flex;

  align-items: center;

  gap: 7px;

  color: #71717a;

  font-family: monospace;

  font-size: 9px;
}

.state-dot {
  width: 5px;

  height: 5px;

  border-radius: 50%;

  background: #7cff6b;

  box-shadow: 0 0 8px rgba(124,255,107,.5);
}


/* SUMMARY */

.summary-grid {
  display: grid;

  grid-template-columns: repeat(4, 1fr);

  gap: 12px;

  margin-bottom: 14px;
}

.summary-card {
  display: flex;

  flex-direction: column;

  gap: 7px;

  padding: 19px;

  border: 1px solid rgba(255,255,255,.055);

  border-radius: 10px;

  background: rgba(255,255,255,.015);
}

.summary-label {
  color: #52525b;

  font-size: 8px;

  font-weight: 700;

  letter-spacing: .14em;
}

.summary-card strong {
  color: #f4f4f5;

  font-size: 25px;

  font-weight: 500;
}

.summary-meta {
  color: #52525b;

  font-size: 9px;
}

.summary-card.critical strong {
  color: #ff5c5c;
}


/* PANEL */

.panel {
  overflow: hidden;

  margin-bottom: 14px;

  border: 1px solid rgba(255,255,255,.055);

  border-radius: 10px;

  background: rgba(255,255,255,.015);
}

.panel-header {
  display: flex;

  align-items: center;

  justify-content: space-between;

  padding: 19px 20px;

  border-bottom: 1px solid rgba(255,255,255,.045);
}

.panel-title {
  margin-top: 5px;

  color: #a1a1aa;

  font-size: 12px;

  font-weight: 600;
}


/* CONTROLS */

.panel-controls {
  display: flex;

  align-items: center;

  gap: 8px;
}

.search {
  display: flex;

  align-items: center;

  gap: 6px;

  padding: 6px 9px;

  border: 1px solid rgba(255,255,255,.06);

  border-radius: 6px;

  background: rgba(255,255,255,.01);

  color: #52525b;
}

.search input {
  width: 140px;

  border: none;

  outline: none;

  background: transparent;

  color: #a1a1aa;

  font-size: 9px;
}

.search input::placeholder {
  color: #3f3f46;
}

select {
  padding: 7px 9px;

  border: 1px solid rgba(255,255,255,.06);

  border-radius: 6px;

  outline: none;

  background: #101419;

  color: #71717a;

  font-size: 8px;
}


/* TABLE */

.table-wrapper {
  overflow-x: auto;
}

table {
  width: 100%;

  border-collapse: collapse;
}

th {
  padding: 12px 20px;

  text-align: left;

  color: #3f3f46;

  font-size: 8px;

  font-weight: 700;

  letter-spacing: .12em;
}

td {
  padding: 14px 20px;

  border-top: 1px solid rgba(255,255,255,.035);

  color: #71717a;

  font-size: 9px;
}

tr:hover td {
  background: rgba(255,255,255,.012);
}

.incident-id {
  color: #a1a1aa;

  font-family: monospace;

  font-weight: 600;
}

.asset,
.time {
  font-family: monospace;

  color: #52525b;
}


/* STATUS */

.status {
  display: inline-flex;

  align-items: center;

  gap: 6px;

  font-size: 8px;

  font-weight: 700;
}

.status > span {
  width: 5px;

  height: 5px;

  border-radius: 50%;

  background: #7cff6b;
}

.status.investigating > span {
  background: #facc15;
}

.status.resolved {
  color: #52525b;
}

.status.resolved > span {
  background: #52525b;
}


/* PRIORITY */

.priority {
  font-size: 8px;

  font-weight: 700;

  letter-spacing: .08em;
}

.priority.low {
  color: #71717a;
}

.priority.medium {
  color: #facc15;
}

.priority.high {
  color: #ff9f43;
}

.priority.critical {
  color: #ff5c5c;
}


/* LOWER */

.lower-grid {
  display: grid;

  grid-template-columns: 1.4fr 1fr;

  gap: 14px;
}

.lower-grid .panel {
  margin-bottom: 0;
}


/* TIMELINE */

.timeline {
  padding: 20px;
}

.timeline-item {
  position: relative;

  display: grid;

  grid-template-columns: 12px 1fr auto;

  gap: 10px;

  padding-bottom: 21px;
}

.timeline-item:last-child {
  padding-bottom: 0;
}

.timeline-dot {
  width: 6px;

  height: 6px;

  margin-top: 4px;

  border-radius: 50%;

  background: #7cff6b;
}

.timeline-dot.warning {
  background: #facc15;
}

.timeline-dot.critical {
  background: #ff5c5c;
}

.timeline-item strong {
  color: #a1a1aa;

  font-size: 10px;

  font-weight: 500;
}

.timeline-item p {
  margin-top: 4px;

  color: #52525b;

  font-size: 9px;
}

.timeline-item time {
  color: #3f3f46;

  font-family: monospace;

  font-size: 8px;
}


/* HEALTH */

.health-list {
  padding: 10px 20px 20px;
}

.health-row {
  display: grid;

  grid-template-columns: 1fr 70px 70px;

  align-items: center;

  gap: 10px;

  padding: 15px 0;

  border-bottom: 1px solid rgba(255,255,255,.035);

  color: #71717a;

  font-size: 9px;
}

.health-row:last-child {
  border-bottom: none;
}

.health-row strong {
  color: #a1a1aa;

  text-align: right;

  font-family: monospace;

  font-size: 9px;
}

.health-ok {
  color: #7cff6b;

  text-align: right;

  font-size: 7px;

  font-weight: 700;

  letter-spacing: .1em;
}

.live {
  color: #7cff6b;

  font-family: monospace;

  font-size: 8px;
}


/* RESPONSIVE */

@media (max-width: 1100px) {

  .summary-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .lower-grid {
    grid-template-columns: 1fr;
  }

}

@media (max-width: 650px) {

  .operations {
    padding: 24px 16px 40px;
  }

  .page-header {
    align-items: flex-start;

    flex-direction: column;

    gap: 18px;
  }

  .summary-grid {
    grid-template-columns: 1fr;
  }

  .panel-header {
    align-items: flex-start;

    flex-direction: column;

    gap: 15px;
  }

  .panel-controls {
    width: 100%;
  }

  .search {
    flex: 1;
  }

  .search input {
    width: 100%;
  }

}
</style>