<script setup>

import {
  ref,
  nextTick,
  onMounted,
  onBeforeUnmount
} from 'vue'

import {
  Room,
  TokenSource
} from 'livekit-client'


// =========================================================
// PROPS
// =========================================================

const props = defineProps({

  roomName: {
    type: String,
    default: 'demo-room'
  },

  participantName: {
    type: String,
    default: 'user'
  }

})


// =========================================================
// STATE
// =========================================================

const messages = ref([])

const messageInput = ref('')

const connectionStatus =
  ref('DISCONNECTED')

const microphoneEnabled =
  ref(false)

const error =
  ref(null)

const messagesContainer =
  ref(null)


// =========================================================
// LIVEKIT
// =========================================================

let room = null


// =========================================================
// ASSEMBLYAI
// =========================================================

// WebSocket de AssemblyAI
let assemblySocket = null

// Micrófono utilizado para AssemblyAI
let audioStream = null

// AudioContext
let audioContext = null

// Source del micrófono
let audioSource = null

// AudioWorklet
let audioProcessor = null

// Indica si AssemblyAI está conectado
let assemblyConnected = false


// =========================================================
// TOKEN SERVER LIVEKIT
// =========================================================

const tokenServerId =
  import.meta.env.VITE_LIVEKIT_TOKEN_SERVER_ID


console.log(
  'LIVEKIT TOKEN SERVER ID:',
  tokenServerId
)


// =========================================================
// SCROLL
// =========================================================

const scrollToBottom = async () => {

  await nextTick()

  if (
    messagesContainer.value
  ) {

    messagesContainer.value.scrollTop =
      messagesContainer.value.scrollHeight

  }

}


// =========================================================
// ADD MESSAGE
// =========================================================

const addMessage = (
  text,
  participant,
  isFinal = true
) => {

  if (!text) {
    return
  }


  messages.value.push({

    id:
      `${Date.now()}-${Math.random()}`,

    text,

    participant,

    isFinal,

    timestamp:
      new Date().toLocaleTimeString()

  })


  scrollToBottom()

}


// =========================================================
// LIVEKIT - RECEIVE TEXT MESSAGES
// =========================================================

const setupTextMessages = () => {

  if (!room) {

    console.warn(
      'No se puede registrar el receptor: room no disponible'
    )

    return

  }


  console.log(
    'Registrando LiveKit text stream handler...'
  )


  room.registerTextStreamHandler(

    'lk.chat',

    async (
      reader,
      participantInfo
    ) => {

      try {

        // -----------------------------------------
        // Leer el mensaje completo
        // -----------------------------------------

        const text =
          await reader.readAll()


        if (!text) {
          return
        }


        // -----------------------------------------
        // Identidad del participante
        // -----------------------------------------

        const participant =
          participantInfo?.name ||
          participantInfo?.identity ||
          'Unknown'


        console.log(
          'LIVEKIT MESSAGE RECEIVED:',
          text
        )


        console.log(
          'MESSAGE FROM:',
          participant
        )


        // -----------------------------------------
        // Mostrar mensaje recibido
        // -----------------------------------------

        addMessage(
          text,
          participant,
          true
        )

      }

      catch (err) {

        console.error(
          'Error receiving LiveKit message:',
          err
        )

      }

    }

  )


  console.log(
    'LiveKit text stream handler registrado'
  )

}


// =========================================================
// LIVEKIT - CONNECT
// =========================================================

const connectToRoom = async () => {

  try {

    error.value = null

    connectionStatus.value =
      'CONNECTING'


    console.log(
      'LIVEKIT TOKEN SERVER ID:',
      tokenServerId
    )


    // -----------------------------------------
    // Token Server
    // -----------------------------------------

    const tokenSource =
      TokenSource.developmentTokenServer(
        tokenServerId
      )


    // -----------------------------------------
    // Obtener credenciales
    // -----------------------------------------

    const credentials =
  await tokenSource.fetch({

    roomName:
      props.roomName,

    participantName:
      props.participantName,

    participantIdentity:
      props.participantName

  })

    console.log(
      'TOKEN RECIBIDO:',
      credentials
    )


    // -----------------------------------------
    // Crear Room
    // -----------------------------------------

    room =
      new Room()


    // -----------------------------------------
    // Conectar a LiveKit
    // -----------------------------------------

    await room.connect(

      credentials.serverUrl,

      credentials.participantToken

    )


    console.log(
      'CONNECTED:',
      room.name
    )


    console.log(
      'LOCAL PARTICIPANT:',
      room.localParticipant.identity
    )


    // -----------------------------------------
    // IMPORTANTE
    // -----------------------------------------
    //
    // Registramos el receptor DESPUÉS
    // de conectar a LiveKit.
    //
    // Cuando otro navegador haga:
    //
    // sendText()
    //
    // LiveKit entregará el mensaje aquí.
    //
    // -----------------------------------------

    setupTextMessages()


    connectionStatus.value =
      'LIVE'


  }

  catch (err) {

    console.error(
      'LIVEKIT ERROR:',
      err
    )


    connectionStatus.value =
      'ERROR'


    error.value =
      err?.message ||
      String(err)

  }

}


// =========================================================
// ASSEMBLYAI TOKEN
// =========================================================

const getAssemblyToken = async () => {

  const apiUrl =
    import.meta.env.VITE_API_URL ||
    'http://127.0.0.1:8003/api'


  const response =
    await fetch(
      `${apiUrl}/assemblyai/token/`
    )


  if (!response.ok) {

    throw new Error(
      'No se pudo obtener el token de AssemblyAI'
    )

  }


  const data =
    await response.json()


  if (!data.token) {

    throw new Error(
      'Django no devolvió un token de AssemblyAI'
    )

  }


  return data.token

}


// =========================================================
// ASSEMBLYAI WEBSOCKET
// =========================================================

const connectToAssemblyAI = async () => {

  console.log(
    'Solicitando token de AssemblyAI...'
  )


  const token =
    await getAssemblyToken()


  console.log(
    'Token AssemblyAI recibido'
  )


  return new Promise(
    (resolve, reject) => {

      const wsUrl =
        new URL(
          'wss://streaming.assemblyai.com/v3/ws'
        )


      // -----------------------------------------
      // Configuración AssemblyAI
      // -----------------------------------------

      wsUrl.searchParams.set(
        'sample_rate',
        '16000'
      )


      wsUrl.searchParams.set(
        'speech_model',
        'u3-rt-pro'
      )


      wsUrl.searchParams.set(
        'token',
        token
      )


      // -----------------------------------------
      // Crear WebSocket
      // -----------------------------------------

      assemblySocket =
        new WebSocket(
          wsUrl.toString()
        )


      // -----------------------------------------
      // OPEN
      // -----------------------------------------

      assemblySocket.onopen =
        () => {

          console.log(
            'ASSEMBLYAI CONNECTED'
          )


          assemblyConnected =
            true


          resolve()

        }


      // -----------------------------------------
      // MESSAGE
      // -----------------------------------------

      assemblySocket.onmessage =
        (event) => {

          try {

            const data =
              JSON.parse(
                event.data
              )


            console.log(
              'ASSEMBLYAI:',
              data
            )


            // -----------------------------------
            // TRANSCRIPTION
            // -----------------------------------

            if (
              data.type === 'Turn'
            ) {

              const transcript =
                data.transcript?.trim()


              if (!transcript) {
                return
              }


              // ---------------------------------
              // TRANSCRIPCIÓN PARCIAL
              // ---------------------------------

              if (
                data.end_of_turn === false
              ) {

                messageInput.value =
                  transcript

              }


              // ---------------------------------
              // TRANSCRIPCIÓN FINAL
              // ---------------------------------

              if (
                data.end_of_turn === true
              ) {

                messageInput.value =
                  transcript

              }

            }

          }

          catch (err) {

            console.error(
              'AssemblyAI message error:',
              err
            )

          }

        }


      // -----------------------------------------
      // ERROR
      // -----------------------------------------

      assemblySocket.onerror =
        (event) => {

          console.error(
            'ASSEMBLYAI WEBSOCKET ERROR:',
            event
          )


          assemblyConnected =
            false


          reject(
            new Error(
              'Error conectando con AssemblyAI'
            )
          )

        }


      // -----------------------------------------
      // CLOSE
      // -----------------------------------------

      assemblySocket.onclose =
        (event) => {

          console.log(
            'ASSEMBLYAI CLOSED:',
            event.code,
            event.reason
          )


          assemblyConnected =
            false

        }

    }

  )

}


// =========================================================
// START AUDIO CAPTURE
// =========================================================

const startAudioCapture = async () => {

  console.log(
    'Solicitando acceso al micrófono...'
  )


  // -----------------------------------------
  // Obtener micrófono
  // -----------------------------------------

  audioStream =
    await navigator.mediaDevices
      .getUserMedia({

        audio: {

          channelCount: 1,

          echoCancellation: true,

          noiseSuppression: true,

          autoGainControl: true

        },

        video: false

      })


  // -----------------------------------------
  // AudioContext
  // -----------------------------------------

  audioContext =
    new AudioContext({

      sampleRate: 16000

    })


  console.log(
    'AudioContext sample rate:',
    audioContext.sampleRate
  )


  // -----------------------------------------
  // Reanudar si está suspendido
  // -----------------------------------------

  if (
    audioContext.state ===
    'suspended'
  ) {

    await audioContext.resume()

  }


  // -----------------------------------------
  // Cargar AudioWorklet
  // -----------------------------------------
  //
  // El archivo debe estar en:
  //
  // public/worklets/pcm-processor.js
  //
  // Por eso utilizamos:
  //
  // /worklets/pcm-processor.js
  //
  // -----------------------------------------

  await audioContext.audioWorklet.addModule(
    '/worklets/pcm-processor.js'
  )


  // -----------------------------------------
  // Crear source
  // -----------------------------------------

  audioSource =
    audioContext.createMediaStreamSource(
      audioStream
    )


  // -----------------------------------------
  // Crear processor
  // -----------------------------------------

  audioProcessor =
    new AudioWorkletNode(
      audioContext,
      'pcm-processor'
    )


  // -----------------------------------------
  // AudioWorklet → AssemblyAI
  // -----------------------------------------

  audioProcessor.port.onmessage =
    (event) => {

      if (
        !assemblySocket ||
        assemblySocket.readyState !==
          WebSocket.OPEN
      ) {

        return

      }


      // event.data contiene PCM16

      assemblySocket.send(
        event.data
      )

    }


  // -----------------------------------------
  // Conectar audio
  // -----------------------------------------

  audioSource.connect(
    audioProcessor
  )


  // -----------------------------------------
  // Evitar reproducir nuestro micrófono
  // -----------------------------------------

  const silentGain =
    audioContext.createGain()


  silentGain.gain.value =
    0


  audioProcessor.connect(
    silentGain
  )


  silentGain.connect(
    audioContext.destination
  )


  console.log(
    'AUDIO CAPTURE STARTED'
  )

}


// =========================================================
// STOP AUDIO CAPTURE
// =========================================================

const stopAudioCapture = async () => {

  console.log(
    'Stopping audio capture...'
  )


  // -----------------------------------------
  // AudioWorklet
  // -----------------------------------------

  if (
    audioProcessor
  ) {

    try {

      audioProcessor.disconnect()

    }

    catch (err) {

      console.warn(
        'Processor disconnect:',
        err
      )

    }


    audioProcessor =
      null

  }


  // -----------------------------------------
  // Source
  // -----------------------------------------

  if (
    audioSource
  ) {

    try {

      audioSource.disconnect()

    }

    catch (err) {

      console.warn(
        'Source disconnect:',
        err
      )

    }


    audioSource =
      null

  }


  // -----------------------------------------
  // Micrófono
  // -----------------------------------------

  if (
    audioStream
  ) {

    audioStream
      .getTracks()
      .forEach(
        track => track.stop()
      )


    audioStream =
      null

  }


  // -----------------------------------------
  // AudioContext
  // -----------------------------------------

  if (
    audioContext
  ) {

    try {

      await audioContext.close()

    }

    catch (err) {

      console.warn(
        'AudioContext close:',
        err
      )

    }


    audioContext =
      null

  }

}


// =========================================================
// CLOSE ASSEMBLYAI
// =========================================================

const disconnectFromAssemblyAI =
  async () => {

    if (
      assemblySocket
    ) {

      try {

        if (
          assemblySocket.readyState ===
            WebSocket.OPEN
        ) {

          // -----------------------------------
          // Cerrar sesión correctamente
          // -----------------------------------

          assemblySocket.send(
            JSON.stringify({
              type: 'Terminate'
            })
          )

        }

      }

      catch (err) {

        console.warn(
          'AssemblyAI terminate:',
          err
        )

      }


      try {

        assemblySocket.close()

      }

      catch (err) {

        console.warn(
          'AssemblyAI close:',
          err
        )

      }


      assemblySocket =
        null

    }


    assemblyConnected =
      false

}


// =========================================================
// MICROPHONE
// =========================================================

const toggleMicrophone = async () => {

  if (!room) {

    console.warn(
      'LiveKit room no disponible'
    )

    return

  }


  try {

    const enabled =
      !microphoneEnabled.value


    // =========================================
    // ENCENDER
    // =========================================

    if (enabled) {

      console.log(
        'Starting microphone...'
      )


      // ---------------------------------------
      // AssemblyAI
      // ---------------------------------------

      await connectToAssemblyAI()


      // ---------------------------------------
      // Captura de audio
      // ---------------------------------------

      await startAudioCapture()


      // ---------------------------------------
      // LiveKit
      // ---------------------------------------

      await room.localParticipant
        .setMicrophoneEnabled(true)


      microphoneEnabled.value =
        true


      console.log(
        'MICROPHONE + TRANSCRIPTION ON'
      )

    }


    // =========================================
    // APAGAR
    // =========================================

    else {

      console.log(
        'Stopping microphone...'
      )


      // ---------------------------------------
      // Apagar LiveKit
      // ---------------------------------------

      await room.localParticipant
        .setMicrophoneEnabled(false)


      // ---------------------------------------
      // Parar captura
      // ---------------------------------------

      await stopAudioCapture()


      // ---------------------------------------
      // Cerrar AssemblyAI
      // ---------------------------------------

      await disconnectFromAssemblyAI()


      microphoneEnabled.value =
        false


      console.log(
        'MICROPHONE + TRANSCRIPTION OFF'
      )

    }

  }

  catch (err) {

    console.error(
      'Microphone error:',
      err
    )


    // -----------------------------------------
    // Limpiar si algo falla
    // -----------------------------------------

    await stopAudioCapture()

    await disconnectFromAssemblyAI()


    try {

      await room.localParticipant
        .setMicrophoneEnabled(false)

    }

    catch (_) {}


    microphoneEnabled.value =
      false


    error.value =
      err?.message ||
      String(err)

  }

}


// =========================================================
// SEND TEXT MESSAGE
// =========================================================

const sendMessage = async () => {

  const text =
    messageInput.value.trim()


  if (
    !text ||
    !room
  ) {

    return

  }


  try {

    console.log(
      'SENDING LIVEKIT MESSAGE:',
      text
    )


    // -----------------------------------------
    // Enviar a todos los participantes
    // mediante LiveKit Text Streams
    // -----------------------------------------

    await room.localParticipant
      .sendText(

        text,

        {
          topic: 'lk.chat'
        }

      )


    // -----------------------------------------
    // Mostrar nuestro propio mensaje
    // -----------------------------------------

    addMessage(

      text,

      props.participantName,

      true

    )


    // -----------------------------------------
    // Limpiar input
    // -----------------------------------------

    messageInput.value = ''


  }

  catch (err) {

    console.error(
      'Error sending message:',
      err
    )

  }

}


// =========================================================
// DISCONNECT LIVEKIT
// =========================================================

const disconnectFromRoom =
  async () => {

    // -----------------------------------------
    // Parar transcripción
    // -----------------------------------------

    await stopAudioCapture()

    await disconnectFromAssemblyAI()


    if (!room) {

      return

    }


    try {

      await room.disconnect()

    }

    catch (err) {

      console.error(
        'Disconnect error:',
        err
      )

    }


    room =
      null


    connectionStatus.value =
      'DISCONNECTED'


    microphoneEnabled.value =
      false

  }


// =========================================================
// MOUNT
// =========================================================

onMounted(() => {

  connectToRoom()

})


// =========================================================
// UNMOUNT
// =========================================================

onBeforeUnmount(() => {

  disconnectFromRoom()

})

</script>


<template>

  <section class="chat-panel">


    <!-- =================================================
         HEADER
         ================================================= -->

    <div class="chat-header">

      <div>

        <div class="panel-label">
          REAL-TIME COMMUNICATION
        </div>

        <div class="chat-title">
          Live Transcription
        </div>

      </div>


      <div class="connection-status">

        <span
          class="status-dot"
          :class="{
            live:
              connectionStatus === 'LIVE',

            error:
              connectionStatus === 'ERROR'
          }"
        ></span>

        {{ connectionStatus }}

      </div>

    </div>


    <!-- =================================================
         ERROR
         ================================================= -->

    <div
      v-if="error"
      class="chat-error"
    >

      {{ error }}

    </div>


    <!-- =================================================
         MESSAGES
         ================================================= -->

    <div
      ref="messagesContainer"
      class="messages"
    >

      <div
        v-if="messages.length === 0"
        class="empty-chat"
      >

        Speak into the microphone...

      </div>


      <div
        v-for="message in messages"
        :key="message.id"
        class="message"
      >

        <div class="message-meta">

          <span class="message-author">

            {{ message.participant }}

          </span>

          <span class="message-time">

            {{ message.timestamp }}

          </span>

        </div>


        <div class="message-text">

          {{ message.text }}

        </div>

      </div>

    </div>


    <!-- =================================================
         CONTROLS
         ================================================= -->

    <div class="chat-controls">

      <button
        class="microphone-button"
        :class="{
          active: microphoneEnabled
        }"
        @click="toggleMicrophone"
      >

        <span v-if="microphoneEnabled">
          🎙
        </span>

        <span v-else>
          🔇
        </span>

        {{ microphoneEnabled
          ? 'Microphone ON'
          : 'Microphone OFF'
        }}

      </button>


      <form
        class="text-form"
        @submit.prevent="sendMessage"
      >

        <input
          v-model="messageInput"
          type="text"
          placeholder="Speak or type a message..."
        />


        <button
          type="submit"
          class="send-button"
        >

          SEND

        </button>

      </form>

    </div>

  </section>

</template>


<style scoped>

.chat-panel {

  width: 100%;

  overflow: hidden;

  border:
    1px solid
    rgba(
      255,
      255,
      255,
      0.055
    );

  border-radius: 10px;

  background:
    rgba(
      255,
      255,
      255,
      0.015
    );

}


.chat-header {

  display: flex;

  align-items: center;

  justify-content: space-between;

  padding:
    19px 20px;

  border-bottom:
    1px solid
    rgba(
      255,
      255,
      255,
      0.045
    );

}


.panel-label {

  color: #52525b;

  font-size: 9px;

  font-weight: 700;

  letter-spacing: 0.18em;

}


.chat-title {

  margin-top: 5px;

  color: #a1a1aa;

  font-size: 12px;

  font-weight: 600;

}


.connection-status {

  display: flex;

  align-items: center;

  gap: 7px;

  color: #52525b;

  font-family: monospace;

  font-size: 9px;

}


.status-dot {

  width: 6px;

  height: 6px;

  border-radius: 50%;

  background: #52525b;

}


.status-dot.live {

  background: #7cff6b;

  box-shadow:
    0 0 8px
    rgba(
      124,
      255,
      107,
      0.7
    );

}


.status-dot.error {

  background: #ff5c5c;

}


.chat-error {

  margin: 12px;

  padding: 10px;

  border:
    1px solid
    rgba(
      255,
      92,
      92,
      0.2
    );

  border-radius: 7px;

  color: #ff5c5c;

  font-size: 10px;

}


.messages {

  height: 430px;

  overflow-y: auto;

  padding: 20px;

}


.empty-chat {

  display: flex;

  align-items: center;

  justify-content: center;

  height: 100%;

  color: #3f3f46;

  font-size: 11px;

}


.message {

  margin-bottom: 18px;

}


.message-meta {

  display: flex;

  align-items: center;

  gap: 10px;

  margin-bottom: 5px;

}


.message-author {

  color: #7cff6b;

  font-size: 9px;

  font-weight: 700;

  letter-spacing: 0.08em;

}


.message-time {

  color: #3f3f46;

  font-family: monospace;

  font-size: 8px;

}


.message-text {

  color: #d4d4d8;

  font-size: 12px;

  line-height: 1.6;

}


.chat-controls {

  display: flex;

  gap: 10px;

  padding: 14px;

  border-top:
    1px solid
    rgba(
      255,
      255,
      255,
      0.045
    );

}


.microphone-button {

  padding:
    9px 12px;

  border:
    1px solid
    rgba(
      255,
      255,
      255,
      0.06
    );

  border-radius: 6px;

  background: transparent;

  color: #71717a;

  font-size: 9px;

  font-weight: 700;

  cursor: pointer;

}


.microphone-button.active {

  border-color:
    rgba(
      124,
      255,
      107,
      0.25
    );

  color: #7cff6b;

}


.text-form {

  display: flex;

  flex: 1;

  gap: 8px;

}


.text-form input {

  min-width: 0;

  flex: 1;

  border:
    1px solid
    rgba(
      255,
      255,
      255,
      0.06
    );

  border-radius: 6px;

  outline: none;

  padding:
    9px 12px;

  background:
    rgba(
      255,
      255,
      255,
      0.02
    );

  color: #d4d4d8;

  font-size: 11px;

}


.send-button {

  padding:
    9px 12px;

  border: 0;

  border-radius: 6px;

  background:
    rgba(
      124,
      255,
      107,
      0.08
    );

  color: #7cff6b;

  font-size: 9px;

  font-weight: 700;

  cursor: pointer;

}

</style>