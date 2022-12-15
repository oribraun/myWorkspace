import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'pattern'
})
export class PatternPipe implements PipeTransform {

  transform(value: string, pattern: string, ...args: unknown[]): unknown {
      const reg = new RegExp(pattern);
      const valid = reg.test(value);
      return valid;
  }

}
