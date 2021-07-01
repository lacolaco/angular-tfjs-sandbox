/// <reference lib="webworker" />

import '@tensorflow/tfjs';
import * as toxicity from '@tensorflow-models/toxicity';
import { expose } from 'comlink';
import { ToxicityPrediction } from './toxicity';

const threshold = 0.9;

let model: toxicity.ToxicityClassifier | null = null;

async function loadModel() {
  return model ?? toxicity.load(threshold, []).then((m) => (model = m));
}

export const api = {
  async classify(input: string): Promise<ToxicityPrediction[]> {
    return loadModel()
      .then((model) => model.classify(input))
      .then((result) =>
        result.map((prediction) => ({
          label: prediction.label,
          match: prediction.results.some((r) => r.match),
        }))
      );
  },
};

expose(api);
