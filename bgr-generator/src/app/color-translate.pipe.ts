// Copyright: 2020, https://github.com/k-gintaras
// License MIT
import { Pipe, PipeTransform } from '@angular/core';
import * as chroma from 'chroma-js/chroma.js';

@Pipe({
  name: 'colorTranslate',
})
export class ColorTranslatePipe implements PipeTransform {
  transform(s: string): any {
    const color = chroma(s);
    return color.hex();
  }
}
