import { Pipe, PipeTransform } from '@angular/core';
import { ToxicityPrediction } from './toxicity';
import { ToxicityService } from './toxicity.service';

@Pipe({
  name: 'toxicity',
})
export class ToxicityPipe implements PipeTransform {
  constructor(private readonly toxicityService: ToxicityService) {}

  transform(value: string): Promise<ToxicityPrediction[]> {
    return this.toxicityService.classify(value);
  }
}
