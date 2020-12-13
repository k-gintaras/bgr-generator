// Copyright: 2020, https://github.com/k-gintaras
// License MIT
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-logo-colors',
  templateUrl: './logo-colors.component.html',
  styleUrls: ['./logo-colors.component.css'],
})
export class LogoColorsComponent implements OnInit {
  @Input() backgroundColor = '#00000f';
  @Input() borderColor = '#0000ff';
  @Input() squareColor = '#000fff';
  @Input() circleColor = '#00ffff';

  constructor() {}

  ngOnInit() {}
}
