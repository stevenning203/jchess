import { LoadImage } from "./image_loader.js";
import { Piece } from "./piece.js";
import { IsMoveValid } from "./logic.js";
import { InBounds } from "./logic.js";
import { IsAttackValid } from "./logic.js";
import { IndexToCoordinates } from "./logic.js";
import { RCToIndex } from "./logic.js";
import { canvas } from "./logic.js";
import { rect } from "./logic.js";
import { context } from "./logic.js";
import { WIDTH } from "./logic.js";
import { HEIGHT } from "./logic.js";
import { GRID_SIZE } from "./logic.js";
import { Polarize } from "./logic.js";

const hightlight_grid = {
    r: -1,
    c: -1,
}

const board = [];

let turn = 0;

function LoadImages() {
    
}

function InitCanvas() {
    canvas.width = rect.width * devicePixelRatio;
    canvas.height = rect.height * devicePixelRatio;
    context.scale(devicePixelRatio, devicePixelRatio);
    canvas.style.width = rect.width + 'px';
    canvas.style.height = rect.height + 'px';
    canvas.addEventListener("mousedown", function(e)
    {
        HandleClick(e);
    });
}

function Main() {
    InitCanvas();
    GenBoard();
    LoadImages();
    MainLoop();
}

function Clear() {
    context.clearRect(0, 0, WIDTH, HEIGHT);
    context.fillStyle = '#000000';
    context.fillRect(0, 0, WIDTH, HEIGHT);
}

function GenBoard() {
    for (let i = 0; i < 64; i++) {
        board.push(null);
    }

    let white_pawn_image = LoadImage("./assets/white_pawn.png");
    let black_pawn_image = LoadImage("./assets/black_pawn.png");

    for (let i = 8; i <= 15; i++) {
        // fill the second row with black pawns
        board[i] = new Piece(black_pawn_image, 1, 1);
        // fill the second-to-last row with white pawns
        board[i + 40] = new Piece(white_pawn_image, 1, 0);
    }

    let white_king_image = LoadImage("./assets/white_king.png");
    let black_king_image = LoadImage("./assets/black_king.png");
    
    board[4] = new Piece(black_king_image, 2, 1);
    board[4 + 56] = new Piece(white_king_image, 2, 0);

    let white_knight_image = LoadImage("./assets/white_knight.png");
    let black_knight_image = LoadImage("./assets/black_knight.png");

    board[1] = new Piece(black_knight_image, 3, 1);
    board[1 + 5] = new Piece(black_knight_image, 3, 1);

    board[1 + 56] = new Piece(white_knight_image, 3, 0);
    board[1 + 5 + 56] = new Piece(white_knight_image, 3, 0);

    let white_bishop_image = LoadImage("./assets/white_bishop.png");
    let black_bishop_image = LoadImage("./assets/black_bishop.png");

    board[2] = new Piece(black_bishop_image, 4, 1);
    board[5] = new Piece(black_bishop_image, 4, 1);

    board[2 + 56] = new Piece(white_bishop_image, 4, 0);
    board[5 + 56] = new Piece(white_bishop_image, 4, 0);

    let white_rook_image = LoadImage("./assets/white_rook.png");
    let black_rook_image = LoadImage("./assets/black_rook.png");

    board[0] = new Piece(black_rook_image, 5, 1);
    board[7] = new Piece(black_rook_image, 5, 1);

    board[0 + 56] = new Piece(white_rook_image, 5, 0);
    board[7 + 56] = new Piece(white_rook_image, 5, 0);

    let white_queen_image = LoadImage("./assets/white_queen.png");
    let black_queen_image = LoadImage("./assets/black_queen.png");

    board[3] = new Piece(black_queen_image, 6, 1);
    board[3 + 56] = new Piece(white_queen_image, 6, 0);
}

function MainLoop() {
    Clear();
    GameLogic();
    Render();

    requestAnimationFrame(MainLoop);
}

function Render() {
    DrawBoard();
    DrawPieces();
}

function DrawBoard() {
    for (let i = 0; i < 64; i++ ) {
        let c = IndexToCoordinates(i);
        if (c.x / GRID_SIZE === hightlight_grid.c && c.y / GRID_SIZE === hightlight_grid.r) {
            context.fillStyle = "#719173";
        } else if ((i + Math.floor(i / 8)) % 2 == 0) {
            context.fillStyle = '#826133';
        } else {
            context.fillStyle = '#b78963';
        }
        context.fillRect(c.x, c.y, GRID_SIZE, GRID_SIZE);
    }
}

function DrawPieces() {
    for (let i = 0; i < 64; i++) {
        let piece = board[i];
        if (piece == null) {
            continue;
        }
        let c = IndexToCoordinates(i);
        let o = piece.getOffset();
        context.drawImage(piece.getImage(), c.x, c.y, GRID_SIZE, GRID_SIZE);
    }
}

function GameLogic() {
    
}

function HandleClick(event) {
    function ResetGrid() {
        hightlight_grid.r = -1;
        hightlight_grid.c = -1;
    }
    let move_made = false;
    let rect = canvas.getBoundingClientRect();
    let x = event.clientX - rect.left;
    let y = event.clientY - rect.top;
    let row = Math.floor(y / GRID_SIZE);
    let col = Math.floor(x / GRID_SIZE);
    let piece = board[row * 8 + col];
    if (piece != null) {
        // piece is on attacker side?
        if (turn == piece.getColor()) {
            hightlight_grid.c = col;
            hightlight_grid.r = row;
        } else {
            if (-1 != hightlight_grid.c && -1 != hightlight_grid.r) {
                let from = board[hightlight_grid.r * 8 + hightlight_grid.c];
                if (IsAttackValid(from, {r: hightlight_grid.r, c: hightlight_grid.c}, {r: row, c: col}, board)) {
                    board[row * 8 + col] = from;
                    board[RCToIndex(hightlight_grid)] = null;
                    ResetGrid();
                    move_made = true;
                }
            }
        }
    } else if (-1 != hightlight_grid.c && -1 != hightlight_grid.r) {
        let from = board[hightlight_grid.r * 8 + hightlight_grid.c];
        if (from.getType() == 1 && Math.abs(hightlight_grid.r - row) == Math.abs(hightlight_grid.c - col)
        && row - hightlight_grid.r == Polarize(from.getColor())) {
            // need to move this into legal moves or else king can attack a pawn that attacks in resulting in a 
            // invalid board.
            if (InBounds({c:col, r: row - Polarize(from.getColor())}) && board[(row - Polarize(from.getColor())) * 8 + col] != null && board[(row - Polarize(from.getColor())) * 8 + col].getType() == 1) {
                board[row * 8 + col] = from;
                board[RCToIndex(hightlight_grid)] = null;
                board[(row - Polarize(from.getColor())) * 8 + col] = null;
                move_made = true;
            }
        } else if (IsMoveValid(from, {r: hightlight_grid.r, c: hightlight_grid.c}, {r: row, c: col}, board)) {
            board[row * 8 + col] = from;
            board[RCToIndex(hightlight_grid)] = null;
            ResetGrid();
            move_made = true;
        }
    }
    if (move_made) {
        turn = turn == 0 ? 1 : 0;
    }
}

window.onload = Main;