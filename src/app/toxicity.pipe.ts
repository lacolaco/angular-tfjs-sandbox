import { Pipe, PipeTransform } from '@angular/core';
import { ToxicityService, ToxicityPrediction } from './toxicity.service';

@Pipe({
  name: 'toxicity',
})
export class ToxicityPipe implements PipeTransform {
  constructor(private readonly toxicityService: ToxicityService) {}

  transform(value: string): Promise<ToxicityPrediction[]> {
    return this.toxicityService.classify(value);
  }
}
