export function IsMoveValid(piece, from, to, board, flag) {
    if (!flag && board[to.r * 8 + to.c] != null) {
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
        let delta_c = Normalize(to.c - from.c);
        let start_r = from.r;
        let start_c = from.c;
        while (start_c != to.c || start_r != to.r) {
            start_c += delta_c;
            start_r += delta_r;
            if (board[start_r * 8 + start_c] != null) {
                if (flag) {
                    if (start_r == to.r && start_c == to.c) {
                        return false;
                    }
                }
                return true;
            }
        }
        return false;
    }
    function IsKingExposed() {
        // stub
        return false;
    }
    let move_ok = false;
    let delta_r = Math.abs(from.r - to.r);
    let delta_c = Math.abs(from.c - to.c);
    switch (piece.getType()) {
        case 1:
            if (delta_c == 0) {
                if (piece.getSpecial()[0]) {
                    if (from.r - to.r == -Polarize(piece.getColor()) || from.r - to.r == -2 * Polarize(piece.getColor())) {
                        move_ok = true;
                        piece.getSpecial()[0] = false;
                    }
                    piece.getSpecial()[1] =  !(from.r - to.r == -2 * Polarize(piece.getColor()));
                } else if (from.r - to.r == -Polarize(piece.getColor())) {
                    move_ok = true;
                    piece.getSpecial()[1] = true;
                }
            }
            // need promotion mechanics
            break;
        case 2:
            // CHECK IF KING IS IN CHECK TO MOVE...
            // CASLTING NEEDED TOO..
            break;
        case 3: {
            if ((delta_r == 2 && delta_c == 1) || (delta_c == 2 && delta_r == 1)) {
                move_ok = true;
            }
            break;
        }
        case 4: {
            if (delta_r == delta_c && !IsCollision() && !IsKingExposed()) {
                move_ok = true;
            }
            break;
        }
        case 5: {
            if ((delta_c == 0 || delta_r == 0) && !IsCollision() && !IsKingExposed()) {
                move_ok = true;
            }
            break;
        }
        case 6: {
            if ((delta_c == delta_r || delta_c == 0 || delta_r == 0) && !IsCollision() && !IsKingExposed()) {
                move_ok = true;
            }
            break;
        }
    }
    return move_ok;
}

export function IsAttackValid(piece, from, to, board) {
    if (piece.getType() == 1) {
        if (Math.abs(from.c - to.c) == 1) {
            return to.r - from.r == Polarize(piece.getColor()) && to.r - from.r == -1;
        } else {
            return false;
        }
    }
    return IsMoveValid(piece, from, to, board, true);
}

export function InBounds(rowcol) {
    return rowcol.r <= 7 && rowcol.r >= 0 && rowcol.c >= 0 && rowcol.c <= 7;
}

export function Polarize(x) {
    return (x == 0) ? -1 : 1;
}

export function KingIsInCheck(board) {
    
}