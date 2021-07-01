import { Injectable } from '@angular/core';
import '@tensorflow/tfjs';
import * as toxicity from '@tensorflow-models/toxicity';

const threshold = 0.9;

export type ToxicityPrediction = {
  label: string;
  match: boolean;
};

@Injectable({
  providedIn: 'root',
})
export class ToxicityService {
  classify(input: string): Promise<ToxicityPrediction[]> {
    return toxicity
      .load(threshold, [])
      .then((model) => model.classify(input))
      .then((result) =>
        result.map((prediction) => ({
          label: prediction.label,
          match: prediction.results.some((r) => r.match),
        }))
      );
  }
}
