// Copyright: 2020, https://github.com/k-gintaras
// License MIT
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-array-to-textarea',
  templateUrl: './array-to-textarea.component.html',
  styleUrls: ['./array-to-textarea.component.css'],
})
export class ArrayToTextareaComponent implements OnInit {
  @Input() arrayTitle: string;
  arrayAsText: string;
  @Input() isClickable = true;
  @Input() arr: string[];
  constructor() {}

  ngOnInit() {
    if (this.arr === undefined) {
      this.arr = ['#ffffff'];
    }
  }
  getArrAsString(arr) {
    return arr.join(', ');
  }
}
