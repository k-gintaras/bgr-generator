// LICENSE: depends on authors of original paper.
// Authors of Firefly and Retinex papers:
// Nikola Banic and Sven Loncaric
//
// Original code available at:
// https://ipg.fer.hr/ipg/resources/color_constancy?
//
// Firefly (Firefly: A Hardware-friendly Real-Time Local Brightness Adjustment) paper:
// https://ipg.fer.hr/_download/repository/Firefly_-_A_Hardware-friendly_Real-Time_Local_Brightness_Adjustment.pdf
//
// Retinex (Smart Light Random Memory Sprays Retinex) paper:
// https://ipg.fer.hr/_download/repository/Light_Random_Sprays_Retinex_-_Exploiting_the_Noisy_Illumination_Estimation.pdf
//
// Code modified and adapted to typescript by:
// https://github.com/k-gintaras

export class CartesianTree {
  maxSize: number;
  elements: any[];
  parent: any[];
  left: any[];
  right: any[];
  count: number;
  leftIdx: number;
  rightIdx: number;
  rootIdx: number;

  constructor(maxSize: number) {
    this.maxSize = maxSize;
    this.elements = new Array<number>(maxSize);
    this.parent = new Array<number>(maxSize).fill(-2);
    this.left = new Array<number>(maxSize).fill(-2);
    this.right = new Array<number>(maxSize).fill(-2);
    this.count = 0;
    this.leftIdx = this.rightIdx = this.rootIdx = -2;
  }

  push(element: number) {
    ++this.count;
    if (this.rightIdx === -2) {
      this.rightIdx = 0;
    } else {
      ++this.rightIdx;
    }
    if (this.rightIdx >= this.maxSize) {
      this.rightIdx = 0;
    }
    this.elements[this.rightIdx] = element;
    if (this.leftIdx === -2) {
      this.leftIdx = this.rightIdx;
    }
    if (this.rootIdx === -2) {
      this.rootIdx = this.rightIdx;
      return;
    }
    this.parent[this.rightIdx] = this.rightIdx - 1;
    if (this.parent[this.rightIdx] === -1) {
      if (this.count > 1) {
        this.parent[this.rightIdx] = this.maxSize - 1;
      } else {
        this.parent[this.rightIdx] = -2;
      }
    }
    this.left[this.rightIdx] = this.right[this.rightIdx] = -2;
    this.elements[this.rightIdx] = element;
    while (this.parent[this.rightIdx] !== -2) {
      if (
        this.elements[this.rightIdx] <=
        this.elements[this.parent[this.rightIdx]]
      ) {
        break;
      }
      this.left[this.rightIdx] = this.parent[this.rightIdx];
      this.parent[this.rightIdx] = this.parent[this.parent[this.rightIdx]];
    }
    if (this.left[this.rightIdx] !== -2) {
      this.parent[this.left[this.rightIdx]] = this.rightIdx;
    }
    if (this.parent[this.rightIdx] !== -2) {
      this.right[this.parent[this.rightIdx]] = this.rightIdx;
    } else {
      this.rootIdx = this.rightIdx;
    }
  }

  max() {
    if (this.rootIdx === -2) {
      return 0;
    } else {
      return this.elements[this.rootIdx];
    }
  }

  pop() {
    if (this.count === 0) {
      return;
    }
    if (this.parent[this.leftIdx] !== -2) {
      if (this.right[this.leftIdx] !== -2) {
        this.parent[this.right[this.leftIdx]] = this.parent[this.leftIdx];
        this.left[this.parent[this.leftIdx]] = this.right[this.leftIdx];
      }
    } else {
      this.rootIdx = this.right[this.leftIdx];
      if (this.right[this.leftIdx] !== -2) {
        this.parent[this.right[this.leftIdx]] = -2;
      }
    }
    --this.count;
    if (this.count > 0) {
      ++this.leftIdx;
      if (this.leftIdx >= this.maxSize) {
        this.leftIdx = 0;
      }
    } else {
      this.leftIdx = this.rightIdx = this.rootIdx = -2;
    }
  }

  size() {
    return this.count;
  }
}
