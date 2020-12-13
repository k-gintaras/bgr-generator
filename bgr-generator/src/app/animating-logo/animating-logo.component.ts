// Copyright: 2020, https://github.com/k-gintaras
// License MIT
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-animating-logo',
  templateUrl: './animating-logo.component.html',
  styleUrls: ['./animating-logo.component.css'],
})
export class AnimatingLogoComponent implements OnInit {
  @Input() logoText;
  @Input() logoColors;
  constructor() {}

  ngOnInit() {
    // this.animate();
  }

  trackByIndex(index: number, obj: any): any {
    return index;
  }

  animate() {
    // timer(0, 100).subscribe(() => {
    //   this.arrayRotate(this.logoColors, true);
    // });
  }

  arrayRotate(arr, reverse) {
    if (reverse) {
      arr.unshift(arr.pop());
    } else {
      arr.push(arr.shift());
    }
    return arr;
  }
}
