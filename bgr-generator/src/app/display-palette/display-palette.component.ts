// Copyright: 2020, https://github.com/k-gintaras
// License MIT
import { Component, OnInit, Input } from '@angular/core';
import { InputsOutputsService } from '../inputs-outputs.service';
import { MathfriendService } from '../mathfriend.service';

@Component({
  selector: 'app-display-palette',
  templateUrl: './display-palette.component.html',
  styleUrls: ['./display-palette.component.css'],
})
export class DisplayPaletteComponent implements OnInit {
  original: string[];
  constructor(
    private ioService: InputsOutputsService,
    private mathFriend: MathfriendService
  ) {}
  @Input() colorArray: string[] = ['#ffffff'];
  @Input() colorCount = 5;
  @Input() isVertical = true;
  @Input() isGradient = true;
  @Input() rowHeight: any = '2:1';
  @Input() isNamed = false;
  @Input() isNotClickable = false;
  @Input() name = 'Color Palette';
  isClicked = false;
  textColor = '#000000';

  ngOnInit() {
    if (this.colorArray === undefined) {
      this.colorArray = ['#ffffff'];
    }
  }

  trackByIndex(index: number, obj: any): any {
    return index;
  }

  onClicked() {
    if (this.colorArray !== undefined) {
      this.ioService.setCurrentDataTitle(this.name);
      this.ioService.setCurrentData(this.colorArray.join(', '));
    }
  }

  shuffle() {
    this.original = this.mathFriend.shuffle(this.colorArray);
  }

  reset() {
    this.original = this.mathFriend.copyArray(this.colorArray);
  }

  clickIt() {
    if (this.isClicked) {
      this.isClicked = false;
    } else {
      this.isClicked = true;
    }
  }

  getGradient() {
    if (this.colorArray.length > 1) {
      const styles = {
        'background-image':
          'linear-gradient(90deg,' + this.colorArray.join(',') + ')',
        'background-repeat': 'no-repeat',
      };
      return styles;
    }
    return {
      'background-image': 'linear-gradient(90deg,' + 'black, white' + ')',
      'background-repeat': 'no-repeat',
    };
  }
}
