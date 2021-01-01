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
          <img ref="rawImg" class="img" />
        </template>
        <template #view2>
          <canvas ref="processedImg" class="img" />
        </template>
        <template #buttons>
          <v-btn color="primary" @click="carregarImagem">
            <v-icon small class="mr-2">fas fa-upload</v-icon>
            Carregar imagem
          </v-btn>
        </template>
      </Layout>
    </v-main>
    <input type="file" class="d-none" ref="inputFile" />
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

  mounted() {
    this.addEventosUploadImagem();
    this.carregarModel();
  }

  carregarImagem() {
    this.inputFile.click();
  }

  async detectarObjetosNaImagem() {
    const objetosDetectados = await DetectorObjetosNaImagem.detectarObjetos(
      this.rawImg
    );
    const imgWidth = this.rawImg.width;
    const imgHeight = this.rawImg.height;
    this.desenharImagemComObjetosDetectados(
      imgWidth,
      imgHeight,
      objetosDetectados
    );
  }

  private ajustarTamanhoDaImagemProcessada(width: number, height: number) {
    this.processedImg.width = width;
    this.processedImg.height = height;
  }

  private desenharImagemComObjetosDetectados(
    width: number,
    height: number,
    objetosDetectados: Array<ObjetoNaImagem>
  ) {
    this.ajustarTamanhoDaImagemProcessada(width, height);
    const img = new Image();
    img.src = URL.createObjectURL(this.getFile());
    img.onload = () => {
      const context = this.processedImg.getContext("2d");
      context.drawImage(img, 0, 0, width, height);
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
    };
  }

  private carregarModel() {
    DetectorObjetosNaImagem.carregar().then(() => {
      this.modelCarregado = true;
    });
  }

  private addEventosUploadImagem() {
    this.inputFile.addEventListener("change", () => {
      if (this.getFile()) {
        this.rawImg.src = URL.createObjectURL(this.getFile());
      } else {
        this.rawImg.src = "";
      }
    });
    this.rawImg.onload = () => {
      this.detectarObjetosNaImagem().then();
    };
  }

  private getFile(): any {
    return this.inputFile?.files[0];
  }

  get inputFile(): any {
    const inputFile: any = this.$refs.inputFile;
    return inputFile;
  }

  get rawImg(): any {
    return this.$refs.rawImg;
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