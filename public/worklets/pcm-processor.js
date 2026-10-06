class PCMProcessor extends AudioWorkletProcessor {

  constructor() {

    super()

    // AssemblyAI trabaja con bloques de audio.
    // 1600 samples = 100 ms a 16 kHz.
    this.bufferSize = 1600

    this.buffer = new Float32Array(
      this.bufferSize
    )

    this.bufferIndex = 0
  }


  process(inputs) {

    const input = inputs[0]

    if (
      !input ||
      !input[0]
    ) {
      return true
    }


    const channel = input[0]


    for (
      let i = 0;
      i < channel.length;
      i++
    ) {

      this.buffer[
        this.bufferIndex
      ] = channel[i]

      this.bufferIndex++


      if (
        this.bufferIndex >=
        this.bufferSize
      ) {

        // Convertimos Float32
        // [-1, 1]
        // a PCM16
        // [-32768, 32767]

        const pcm16 =
          new Int16Array(
            this.bufferSize
          )


        for (
          let j = 0;
          j < this.bufferSize;
          j++
        ) {

          const sample =
            Math.max(
              -1,
              Math.min(
                1,
                this.buffer[j]
              )
            )

          pcm16[j] =
            sample < 0
              ? sample * 32768
              : sample * 32767

        }


        // Transferimos el buffer
        // al hilo principal.

        this.port.postMessage(
          pcm16.buffer,
          [pcm16.buffer]
        )


        this.buffer =
          new Float32Array(
            this.bufferSize
          )

        this.bufferIndex = 0

      }

    }


    return true
  }

}


registerProcessor(
  "pcm-processor",
  PCMProcessor
)