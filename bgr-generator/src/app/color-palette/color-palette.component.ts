// Copyright: 2020, https://github.com/k-gintaras
// License MIT
import { Component, OnInit, Input } from '@angular/core';
import { InputsOutputsService } from '../inputs-outputs.service';

@Component({
  selector: 'app-color-palette',
  templateUrl: './color-palette.component.html',
  styleUrls: ['./color-palette.component.css'],
})
export class ColorPaletteComponent implements OnInit {
  @Input() colorPalette;
  constructor(private ioService: InputsOutputsService) {}

  ngOnInit() {}
  trackByIndex(index: number, obj: any): any {
    return index;
  }
  trackByTitle(index: number, obj: any): any {
    return obj;
  }

  onColorPick(event) {}
}
