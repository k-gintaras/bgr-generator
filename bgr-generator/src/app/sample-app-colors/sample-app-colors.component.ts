// Copyright: 2020, https://github.com/k-gintaras
// License MIT
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-sample-app-colors',
  templateUrl: './sample-app-colors.component.html',
  styleUrls: ['./sample-app-colors.component.css'],
})
export class SampleAppColorsComponent implements OnInit {
  @Input() headerColor = '#0000ff';
  @Input() backgroundColor = '#000fff';
  @Input() buttonColor = '#00ffff';
  @Input() borderColor = '#0fffff';

  constructor() {}

  ngOnInit() {}
}
