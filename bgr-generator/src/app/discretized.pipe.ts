// Copyright: 2020, https://github.com/k-gintaras
// License MIT
import { Pipe, PipeTransform } from '@angular/core';
import { MathfriendService } from './mathfriend.service';

@Pipe({
  name: 'discretized',
})
export class DiscretizedPipe implements PipeTransform {
  constructor(private mh: MathfriendService) {}
  transform(arr: any[], binsIn?: number): any {
    let bins = 5;
    if (!isNaN(binsIn)) {
      if (arr.length > binsIn) {
        bins = binsIn;
      }
    }
    if (arr.length < 5) {
      bins = arr.length;
    }
    const discretized = this.mh.getDiscretizedMatrix(arr, bins);
    const newArr = [];
    for (const dr of discretized) {
      newArr.push(dr[0]);
    }
    return newArr;
  }
}
