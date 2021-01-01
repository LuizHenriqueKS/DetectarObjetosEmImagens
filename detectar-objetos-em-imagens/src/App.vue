<template>
  <v-app>
    <v-main>
      <div v-if="!modelCarregado" class="div-carregamento">
        <v-progress-circular
          :size="50"
          color="primary"
          indeterminate
        ></v-progress-circular>
        <div class="text-body">Carregando...</div>
      </div>
      <Layout v-show="modelCarregado">
        <template #title>Detectar objetos em imagens</template>
        <template #view1-title>Imagem original</template>
        <template #view2-title>Imagem processada</template>
        <template #view1>
          <img ref="rawImg" class="img" v-show="!capturandoCamera" />
          <canvas ref="rawCaptura" class="img" v-show="capturandoCamera" />
        </template>
        <template #view2>
          <canvas ref="processedImg" class="img" />
        </template>
        <template #buttons>
          <v-btn
            class="mr-2"
            v-show="capturandoCamera"
            @click="pararCapturaCamera"
          >
            <v-icon small class="mr-2">fas fa-stop</v-icon>
            Parar captura
          </v-btn>
          <v-btn
            color="primary"
            class="mr-2"
            v-show="!capturandoCamera"
            @click="capturarCamera"
          >
            <v-icon small class="mr-2">fas fa-camera</v-icon>
            Capturar câmera
          </v-btn>
          <v-btn
            color="primary"
            :disabled="capturandoCamera"
            @click="carregarImagem"
          >
            <v-icon small class="mr-2">fas fa-upload</v-icon>
            Carregar imagem
          </v-btn>
        </template>
      </Layout>
    </v-main>
    <input ref="inputFile" type="file" class="d-none" />
    <video
      ref="video"
      class="d-none"
      width="600px"
      height="300px"
      controls="false"
      autoplay="true"
    />
  </v-app>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Layout from "./components/Layout.vue";
import DetectorObjetosNaImagem from "./lib/DetectorObjetosNaImagem";
import ObjetoNaImagem from "./lib/ObjetoNaImagem";

@Component({
  components: {
    Layout,
  },
})
export default class App extends Vue {
  modelCarregado: boolean = false;
  streamDeCaptura: any;
  capturandoCamera: boolean = false;

  mounted() {
    this.addEventosUploadImagem();
    this.addEventosCapturaCamera();
    this.carregarModel();
  }

  carregarImagem() {
    this.inputFile.click();
  }

  capturarCamera() {
    this.definirTamanhoMaximoParaRaws();
    navigator.getUserMedia(
      { video: true },
      (stream) => {
        this.capturandoCamera = true;
        this.streamDeCaptura = stream;
        this.video.srcObject = stream;
        this.video.onloadedmetadata = () => {
          this.rawCaptura.width = this.video.videoWidth;
          this.rawCaptura.height = this.video.videoHeight;
          this.processedImg.width = this.video.videoWidth;
          this.processedImg.height = this.video.videoHeight;
        };
      },
      (e) => console.error(e)
    );
  }

  pararCapturaCamera() {
    this.rawImg.src = this.rawCaptura.toDataURL();
    this.capturandoCamera = false;
    this.streamDeCaptura.getTracks().forEach((track: any) => track.stop());
  }

  async detectarObjetosNaImagem() {
    const objetosDetectados = await DetectorObjetosNaImagem.detectarObjetos(
      this.rawImg
    );
    const imgSrc = this.rawImg.src;
    const imgWidth = this.rawImg.width;
    const imgHeight = this.rawImg.height;
    this.processedImg.width = imgWidth;
    this.processedImg.height = imgHeight;
    this.desenharImagemComObjetosDetectados(
      imgSrc,
      imgWidth,
      imgHeight,
      objetosDetectados
    );
  }

  async detectarObjetosNaCaptura() {
    const objetosDetectados = await DetectorObjetosNaImagem.detectarObjetos(
      this.video
    );
    this.desenharObjetosDetectados(
      this.processedImg.getContext("2d"),
      objetosDetectados
    );
  }

  private desenharImagemComObjetosDetectados(
    imagemSrc: any,
    width: number,
    height: number,
    objetosDetectados: Array<ObjetoNaImagem>
  ) {
    const img = new Image();
    img.src = imagemSrc;
    img.onload = () => {
      const context = this.processedImg.getContext("2d");
      context.drawImage(img, 0, 0, width, height);
      this.desenharObjetosDetectados(context, objetosDetectados);
    };
  }

  private desenharObjetosDetectados(
    context: any,
    objetosDetectados: Array<ObjetoNaImagem>
  ) {
    for (const objeto of objetosDetectados) {
      context.strokeStyle = "#01DF01";
      context.lineWidth = 2;
      context.font = "bold 12px arial";
      context.fillStyle = "#01DF01";
      context.fillText(
        objeto.nomeObjeto.toUpperCase(),
        objeto.x + 4,
        objeto.y + 14
      );
      context.strokeRect(objeto.x, objeto.y, objeto.width, objeto.height);
    }
  }

  private carregarModel() {
    DetectorObjetosNaImagem.carregar().then(() => {
      this.modelCarregado = true;
    });
  }

  private addEventosUploadImagem() {
    this.inputFile.addEventListener("change", () => {
      if (this.getFile()) {
        this.definirTamanhoMaximoParaRaws();
        this.rawImg.src = URL.createObjectURL(this.getFile());
      } else {
        this.rawImg.src = "";
      }
    });
    this.rawImg.onload = () => {
      this.detectarObjetosNaImagem().then();
    };
  }

  private addEventosCapturaCamera() {
    this.video.addEventListener("play", () => {
      const context = this.rawCaptura.getContext("2d");
      const context2 = this.processedImg.getContext("2d");
      const it = this;
      (function loop() {
        if (!it.video.paused && !it.video.ended && it.capturandoCamera) {
          context.drawImage(it.video, 0, 0);
          context2.drawImage(it.video, 0, 0);
          const fps = 60;
          setTimeout(loop, 1000 / fps);
          it.detectarObjetosNaCaptura().then();
        } else {
          it.capturandoCamera = false;
        }
      })();
    });
  }

  private definirTamanhoMaximoParaRaws() {
    const maxHeight = this.rawImg.parentElement.offsetHeight - 20 + "px";
    this.rawImg.style.maxHeight = maxHeight;
    this.rawCaptura.style.maxHeight = maxHeight;
    this.processedImg.style.maxHeight = maxHeight;
    this.video.height = maxHeight;
  }

  private getFile(): any {
    return this.inputFile?.files[0];
  }

  get inputFile(): any {
    return this.$refs.inputFile;
  }

  get video(): any {
    return this.$refs.video;
  }

  get rawImg(): any {
    return this.$refs.rawImg;
  }

  get rawCaptura(): any {
    return this.$refs.rawCaptura;
  }

  get processedImg(): any {
    return this.$refs.processedImg;
  }
}
</script>

<style>
.v-application {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
}
.v-main__wrap {
  display: flex;
  align-items: center;
  justify-content: center;
}
.img {
  max-width: 100%;
  max-height: 100%;
}
.div-carregamento {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  line-height: 50px;
}
</style>4