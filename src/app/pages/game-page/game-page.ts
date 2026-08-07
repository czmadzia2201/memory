import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { BoardSize, BOARD_DIMENSIONS } from '../../models/board-size';
import { Tile } from '../../models/tile';
import { TileStatus } from '../../models/tile-status';

@Component({
  selector: 'app-game-page',
  imports: [],
  templateUrl: './game-page.html',
  styleUrl: './game-page.css',
})
export class GamePage implements OnInit {

  @ViewChild('gameOverDialog')
  private gameOverDialog!: ElementRef<HTMLDialogElement>;

  @ViewChild('aboutDialog')
  private aboutDialog!: ElementRef<HTMLDialogElement>;

  readonly boardSizes = Object.values(BoardSize);
  readonly boardSizeLabels: Record<BoardSize, string> = {
    [BoardSize.SMALL]: 'Small (6 x 5)',
    [BoardSize.MEDIUM]: 'Medium (7 x 6)',
    [BoardSize.LARGE]: 'Large (8 x 7)',
  };
  readonly BOARD_DIMENSIONS = BOARD_DIMENSIONS;
  readonly TileStatus = TileStatus;
  private readonly imageCache: HTMLImageElement[] = [];

  selectedSize: BoardSize | null = null;
  tileMatrix: Tile[][] = [];
  score = 0;

  private uncoveredList: Tile[] = [];
  private removed = 0;
  private pairTimeout?: ReturnType<typeof setTimeout>;

  // Init game

  ngOnInit(): void {
    this.preloadImages();
  }

  startNewGame(size: BoardSize): void {
    this.resetGame();
    this.selectedSize = size;
    const { rows, cols } = BOARD_DIMENSIONS[size];
    const tiles = this.createShuffledTiles(rows * cols);
    for (let row = 0; row < rows; row++) {
        this.tileMatrix.push(tiles.slice(row * cols, (row + 1) * cols));
    }
  }

  private createShuffledTiles(count: number): Tile[] {
    const items = this.buildItems(count);

    for (let i = items.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = items[i];
      items[i] = items[j];
      items[j] = temp;
    }

    return items.map(item => ({
      id: item,
      image: `/images/${item}.png`,
      status: TileStatus.COVERED,
    }));
  }

  private buildItems(count: number): number[] {
    const half = Array.from({ length: count / 2 }, (_, i) => i + 1);
    return [...half, ...half];
  }

  // Game logic

  handleTileClick(tile: Tile): void {
    if (tile.status === TileStatus.COVERED && this.uncoveredList.length < 2) {
      this.uncoverAndCheckTile(tile);
    }
  }

  private uncoverTile(tile: Tile): void {
    tile.status = TileStatus.UNCOVERED;
    this.uncoveredList.push(tile);
  }

  private coverTile(tile: Tile): void {
    tile.status = TileStatus.COVERED;
  }

  private removeTile(tile: Tile): void {
    tile.status = TileStatus.REMOVED;
    this.removed++;
  }

  private uncoverAndCheckTile(tile: Tile): void {
    this.uncoverTile(tile);

    if (this.uncoveredList.length !== 2) {
      return;
    }

    const tile0 = this.uncoveredList[0];

    if (tile0.id === tile.id) {
      this.pairTimeout = setTimeout(() => {
        this.removeTile(tile);
        this.removeTile(tile0);
        this.uncoveredList = [];
        this.pairTimeout = undefined;
        this.checkEndGame();
      }, 500);
    } else {
      this.pairTimeout = setTimeout(() => {
        this.coverTile(tile);
        this.coverTile(tile0);
        this.uncoveredList = [];
        this.pairTimeout = undefined;
        this.score++;
      }, 1500);
    }
  }

  private checkEndGame(): void {
    const tileCount = BOARD_DIMENSIONS[this.selectedSize!].rows * BOARD_DIMENSIONS[this.selectedSize!].cols;
    if (this.removed === tileCount) {
      this.openGameOverDialog();
      for (const row of this.tileMatrix) {
        for (const tile of row) {
          this.uncoverTile(tile);
        }
      }
    }
  }

  private openGameOverDialog(): void {
    this.gameOverDialog.nativeElement.showModal();
  }

  closeGameOverDialog(): void {
    this.gameOverDialog.nativeElement.close();
  }

  private resetGame(): void {
    if (this.pairTimeout) {
      clearTimeout(this.pairTimeout);
      this.pairTimeout = undefined;
    }

    this.tileMatrix = [];
    this.score = 0;
    this.uncoveredList = [];
    this.removed = 0;
  }

  private preloadImages(): void {
    const imageCount = BOARD_DIMENSIONS[BoardSize.LARGE].rows * BOARD_DIMENSIONS[BoardSize.LARGE].cols / 2;

    for (let i = 1; i <= imageCount; i++) {
      const image = new Image();
      image.src = `/images/${i}.png`;
      this.imageCache.push(image);
    }

    const backImage = new Image();
    backImage.src = '/images/back.png';
    this.imageCache.push(backImage);
  }

  // About dialog

  openAboutDialog(): void {
    this.aboutDialog.nativeElement.showModal();
  }

  closeAboutDialog(): void {
    this.aboutDialog.nativeElement.close();
  }

}
