let field = [ // "1" is black, "-1" is white;
    [0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0],
    [0,0,0,1,-1,0,0,0],
    [0,0,0,-1,1,0,0,0],
    [0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0],
];
let turn = 1; // black
let H = 8, W = 8;
start();
const moveH = [0, 0, 1, -1, 1, 1, -1, -1];
const moveW = [1, -1, 0, 0, 1, -1, -1, 1];
let hh, ww, cnt;
let can_turn = [], now = []; // ひっくり返せる駒のID
function yech(id) { 
    let h = Math.floor(id / 8), w = id % 8;
    if(w === 0) w = 8, h--;
    w--;
    if(field[h][w] != 0) return; //何もない場所か
    // おいてとれるか
    // ひっくり返す
    if(change(h, w)) {
        console.log("OKOKOK Goodgod!!!"), can_turn.push(id), changeColor();
        if(turn === 1) turn = -1;
        else turn = 1;
    }
    else console.log("NoNoNo! error!"); 
}
function change(h, w) {
    can_turn = [], now = [];
    for(let i = 0; i < 8; ++i) {
        hh = h, ww = w;
        cnt = 0;
        if(f(moveH[i], moveW[i])) {
            now.forEach(element => {
                can_turn.push(element);
            });
        }
        now = [];
    }
    return (can_turn.length > 0);
}
function f(h, w) {
    hh += h, ww += w;
    if(hh < 0 || hh >= H || ww < 0 || ww >= W) return false;
    if(turn + field[hh][ww] == 0) {
        cnt++;
        now.push(8 * hh + (ww + 1));
        return f(h, w);
    } else if(turn == field[hh][ww]) {
        if(cnt > 0) return true;
        else return false;
    }
}
function changeColor() {
    can_turn.forEach(e => {
        let h = Math.floor(e / 8), w = e % 8;
        if(w === 0) w = 8, h--;
        w--;
        document.getElementById(String(e)).innerHTML = "";
        let add = document.createElement("div");
        if(turn == 1) add.className = "black", document.getElementById(String(e)).appendChild(add), field[h][w] = 1;
        if(turn == -1) add.className = "white", document.getElementById(String(e)).appendChild(add), field[h][w] = -1;
    });
}
function start() {
    for(let i = 0; i < H; ++i) for(let j = 0; j < W; ++j) {
        let add = document.createElement("div");
        if(field[i][j] == 1) add.className = "black", document.getElementById(String(8 * i + (j + 1))).appendChild(add);
        if(field[i][j] == -1) add.className = "white", document.getElementById(String(8 * i + (j + 1))).appendChild(add);
    }
    place();
}
function place() {
    for(let i = 0; i < H; ++i) for(let j = 0; j < W; ++j) {
        if(field[i][j] != 0) continue;
        if(change(i, j) document.getElementById(String(8 * i + (j + 1))).style.backgroundColor = "red";
        else document.getElementById(String(8 * i + (j + 1))).style.backgroundColor = "blue";
    }
}
