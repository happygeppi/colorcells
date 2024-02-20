const scl = 2;
let w, h;
const spawnProb = 0.01;
const propProb = 0.02;

const MutRate = 10;

let speed = 1;

const cells = [];
const outsideCells = [];

function Start() {
  dj.createCanvas(FULL);
  dj.background(0);
  dj.slower("x");

  w = dj.floor(width / scl);
  h = dj.floor(height / scl);

  CreateCellArray();
  CreateCell();
}

function CreateCellArray() {
  for (let j = 0; j < h; j++) {
    cells.push([]);
    for (let i = 0; i < w; i++) {
      cells[j].push(new Cell());
    }
  }
}

function Draw() {
  for (let i = 0; i < speed; i++) {
    if (outsideCells.length > 0 && dj.random() < spawnProb) CreateCell();
  
    for (let index = outsideCells.length - 1; index >= 0; index--)
      outsideCells[index].propagate(index);
  }
}

function CreateCell() {
  const i = dj.floor(dj.random(w));
  const j = dj.floor(dj.random(h));

  if (!cells[j][i].empty) return;

  const clr = [
    dj.floor(dj.random(255)),
    dj.floor(dj.random(255)),
    dj.floor(dj.random(255)),
  ];

  const cell = cells[j][i];
  outsideCells.push(cell);
  cell.setup(i, j, clr);
  cell.show();
}

class Cell {
  constructor() {
    this.empty = true;
  }

  setup(i, j, clr) {
    this.empty = false;
    this.i = i;
    this.j = j;
    this.clr = clr;
    this.outside = true;
  }

  propagate(index) {
    let outside = false;
    for (let relj = -1; relj <= 1; relj++) {
      for (let reli = -1; reli <= 1; reli++) {
        if (reli != 0 || relj != 0) {
          const i = (this.i + reli + w) % w;
          const j = (this.j + relj + h) % h;

          if (!outside && cells[j][i].empty) outside = true;

          if (dj.random() < propProb) {
            const clr = this.mutateColor();
            const cell = cells[j][i];
            outsideCells.push(cell);
            cell.setup(i, j, clr);
            cell.show();
          }
        }
      }
    }

    this.outside = outside;
    if (!this.outside) outsideCells.splice(index, 1);
  }

  mutateColor() {
    const clr = [
      this.clr[0] + dj.floor(dj.random(-MutRate, MutRate)),
      this.clr[1] + dj.floor(dj.random(-MutRate, MutRate)),
      this.clr[2] + dj.floor(dj.random(-MutRate, MutRate)),
    ];

    for (let i = 0; i < clr.length; i++) {
      if (clr[i] > 255) clr[i] = 255;
      else if (clr[i] < 0) clr[i] = 0;
    }

    return clr;
  }

  show() {
    dj.fill(this.clr);
    dj.rect(this.i * scl, this.j * scl, scl, scl);
  }
}

/*

Todo:

- Mutation rate multiplicative
- clusters:
  - each cluster with own random parameters
  - borders between clusters
  - direction not random, but noise-y --> lines, not circles

*/
