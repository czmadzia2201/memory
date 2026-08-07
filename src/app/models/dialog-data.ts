export enum DialogType {
    ABOUT = 'ABOUT',
    GAME_OVER = 'GAME_OVER'
}

export interface DialogData {
    title: string;
    paragraphs: string[];
}

export const DIALOG_CONFIGS: Record<DialogType, DialogData> = {
    [DialogType.ABOUT]: {
        title: 'About the Game',
        paragraphs: [
          'Memory is a classic game in which you uncover pairs of tiles. Each tile has an identical counterpart. Try to find matching pairs by memorizing tiles positions. Uncovering two matching tiles removes them from the board.',
          'Your score is based on the number of unsuccessful attempts. The lower it is, the better. The goal is to clear the board with as few mistakes as possible.'
        ]
    },
    [DialogType.GAME_OVER]: {
        title: 'Game Over!',
        paragraphs: []
    }
};
