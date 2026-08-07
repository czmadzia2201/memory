export enum BoardSize {
  SMALL = 'SMALL',
  MEDIUM = 'MEDIUM',
  LARGE = 'LARGE',
}

export interface BoardDimensions {
    rows: number;
    cols: number;
}

export const BOARD_DIMENSIONS: Record<BoardSize, BoardDimensions> = {
    [BoardSize.SMALL]: { rows: 5, cols: 6 },
    [BoardSize.MEDIUM]: { rows: 6, cols: 7 },
    [BoardSize.LARGE]: { rows: 7, cols: 8 }
};
