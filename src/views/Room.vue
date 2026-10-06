<script setup>

import Chat
  from '../components/chat/Chat.vue'


// =========================================================
// ROOM
// =========================================================

const roomName =
  'demo-room'


// =========================================================
// PARTICIPANT
// =========================================================
//
// El nombre se obtiene de la URL:
//
// /room?name=Alvaro
// /room?name=Juan
//
// Si no se proporciona ningún nombre,
// usamos "Alvaro" por defecto.
//

const params =
  new URLSearchParams(
    window.location.search
  )


const participantName =
  params.get('name') ||
  'Alvaro'


console.log(
  'ROOM:',
  roomName
)

console.log(
  'PARTICIPANT:',
  participantName
)

</script>



<template>

  <div class="room">

    <!-- =================================================
         HEADER
         ================================================= -->

    <section class="room-header">

      <div>

        <div class="eyebrow">
          LIVE COMMUNICATION
        </div>

        <h1>
          Room
        </h1>

        <p>
          Real-time multilingual transcription
        </p>

      </div>

    </section>


    <!-- =================================================
         CHAT
         ================================================= -->

    <section class="room-content">

      <Chat
        :room-name="roomName"
        :participant-name="participantName"
      />

    </section>

  </div>

</template>


<style scoped>

.room {

  max-width: 1600px;

  margin: 0 auto;

  padding:
    34px 38px 50px;

}


.room-header {

  margin-bottom: 30px;

}


.eyebrow {

  color: #52525b;

  font-size: 9px;

  font-weight: 700;

  letter-spacing: 0.18em;

}


.room-header h1 {

  margin:
    7px 0 5px;

  color: #f4f4f5;

  font-size: 29px;

  font-weight: 500;

  letter-spacing: -0.035em;

}


.room-header p {

  color: #52525b;

  font-size: 11px;

}


.room-content {

  width: 100%;

}


@media (max-width: 650px) {

  .room {

    padding:
      24px 16px 40px;

  }

}

</style>