import { Pipe, PipeTransform } from '@angular/core';
import { ToxicityPrediction } from './toxicity';

const emojis = ['😊', '😒', '🤐', '😦', '😡', '🤬', '⛔️'];

@Pipe({
  name: 'emojify',
})
export class EmojifyPipe implements PipeTransform {
  transform(value: ToxicityPrediction[] | null): string {
    if (value == null) {
      return '🤔';
    }

    const level = value.filter((p) => p.match).length;
    return emojis[Math.min(level, 6)];
  }
}
