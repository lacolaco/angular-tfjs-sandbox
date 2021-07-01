import { Injectable } from '@angular/core';
import { wrap } from 'comlink';
import { ToxicityPrediction } from './toxicity';

const worker = wrap<typeof import('./toxicity.worker').api>(
  new Worker(new URL('./toxicity.worker', import.meta.url))
);

@Injectable({
  providedIn: 'root',
})
export class ToxicityService {
  classify(input: string): Promise<ToxicityPrediction[]> {
    return worker.classify(input);
  }
}
