// Copyright: 2020, https://github.com/k-gintaras
// License MIT
import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({
  name: 'inputToHtml',
})
export class InputToHtmlPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}

  transform(s: string): any {
    return this.sanitizer.bypassSecurityTrustHtml(s);
  }
}
