import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'toxicity',
})
export class ToxicityPipe implements PipeTransform {
  transform(value: string) {
    return value;
  }
}
