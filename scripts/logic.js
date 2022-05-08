export function IsMoveValid(piece, from, to, board) {
    if (board[to.r * 8 + to.c] != null) {
        return false;
    }
    function IsCollision() {
        // this function should only be called if the move is deemed otherwise valid
        function Normalize(x) {
            if (x > 0) {
                return 1;
            } else if (x == 0) {
                return 0;
            } else {
                return -1;
            }
        }
        let delta_r = Normalize(to.r - from.r);
        console.log(delta_r);
        let delta_c = Normalize(to.c - from.c);
        console.log(delta_c);
        let start_r = from.r;
        let start_c = from.c;
        while (start_c != to.c || start_r != to.r) {
            console.log("test");
            start_c += delta_c;
            start_r += delta_r;
            console.log(board[start_r * 8 + start_c]);
            if (board[start_r * 8 + start_c] != null) {
                return true;
            }
        }
        return false;
    }
    let move_ok = false;
    let delta_r = Math.abs(from.r - to.r);
    let delta_c = Math.abs(from.c - to.c);
    switch (piece.getType()) {
        case 1:
            // EN PASSANT NEEDED...
            // CHECK IF PAWN HAS MOVED SO IT CAN MOVE 2 SQUARES UP
            move_ok = true;
            break;
        case 2:
            // CHECK IF KING IS IN CHECK TO MOVE...
            // CASLTING NEEDED TOO...
            break;
        case 3: {
            if ((delta_r == 2 && delta_c == 1) || (delta_c == 2 && delta_r == 1)) {
                move_ok = true;
            }
            break;
        }
        case 4: {
            if (delta_r == delta_c && !IsCollision()) {
                move_ok = true;
            }
            break;
        }
        case 5: {
            if ((delta_c == 0 || delta_r == 0) && !IsCollision()) {
                move_ok = true;
            }
            break;
        }
        case 6: {
            if ((delta_c == delta_r || delta_c == 0 || delta_r == 0) && !IsCollision()) {
                move_ok = true;
            }
            break;
        }
    }
    return move_ok;
}

export function IsAttackValid(piece, from, to, board) {
    
}