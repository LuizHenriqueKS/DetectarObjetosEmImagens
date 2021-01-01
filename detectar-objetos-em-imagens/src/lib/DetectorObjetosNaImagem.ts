import * as tf from "@tensorflow/tfjs";
import * as cocoSsd from "@tensorflow-models/coco-ssd";
import ObjetoNaImagem from './ObjetoNaImagem';

class DetectorObjetosNaImagem {

  model: any;

  async carregar(): Promise<void> {
    tf.getBackend();
    this.model = await cocoSsd.load();
  }

  async detectarObjetos(imagem: any): Promise<Array<ObjetoNaImagem>> {
    const predictions: Array<any> = await this.model.detect(imagem);
    const objetosDetectados: Array<ObjetoNaImagem> = [];
    for (const prediction of predictions) {
      objetosDetectados.push({
        x: prediction.bbox[0],
        y: prediction.bbox[1],
        width: prediction.bbox[2],
        height: prediction.bbox[3],
        nomeObjeto: prediction.class
      });
    }
    return objetosDetectados;
  }

}

export default new DetectorObjetosNaImagem();