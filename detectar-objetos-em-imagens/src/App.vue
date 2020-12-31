<template>
  <v-app>
    <v-main>
      <Layout>
        <template #title>Detectar objetos em imagens</template>
        <template #view1-title>Imagem crua</template>
        <template #view2-title>Imagem processada</template>
        <template #view1>
          <img ref="rawImg" class="img" />
        </template>
        <template #view2>
          <img ref="processedImg" class="img" />
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

@Component({
  components: {
    Layout,
  },
})
export default class App extends Vue {
  mounted() {
    const it = this;
    this.inputFile.addEventListener("change", function () {
      const it2: any = this;
      const files = it2.files;
      if (files && files[0]) {
        it.rawImg.src = URL.createObjectURL(files[0]);
      }
    });
  }

  carregarImagem() {
    this.inputFile.click();
  }

  get inputFile(): HTMLElement {
    const inputFile: any = this.$refs.inputFile;
    return inputFile;
  }

  get rawImg(): any {
    const rawImg: any = this.$refs.rawImg;
    return rawImg;
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
</style>4