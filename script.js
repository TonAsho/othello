let field = [ // "1" is black, "-1" is white;
    [0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0],
    [0,0,0,-1,1,0,0,0],
    [0,0,0,1,-1,0,0,0],
    [0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0],
];
let turn = 1; // black
let H = 8, W = 8;
const moveH = [0, 0, 1, -1, 1, 1, -1, -1];
const moveW = [1, -1, 0, 0, 1, -1, -1, 1];
let mark = [], his = [];
let hh, ww, cnt, notPut = false, number = 4;
let can_turn = [], now = []; // ひっくり返せる駒のID
start();
function yech(id) { 
    let h = Math.floor(id / 8), w = id % 8;
    if(w === 0) w = 8, h--;
    w--;
    if(field[h][w] != 0) return; //何もない場所か
    // おいてとれるか
    // ひっくり返す
    if(change(h, w)) {
        if(his.length > 0) getId(his[his.length-1]).style.backgroundColor = "lightgreen";
        delMark(), can_turn.push(id), changeColor();
        his.push(id);
        getId(id).style.backgroundColor = "green";
        if(turn === 1) turn = -1;
        else turn = 1;
        can_turn = [], now = [];
        putMark();
        number++;
        if(number === 64) finish();
    }
    else console.log("NoNoNo! error!"); 

}
function change(h, w) {
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
        if(field[i][j] == 1) add.className = "black", get(i, j).appendChild(add);
        if(field[i][j] == -1) add.className = "white", get(i, j).appendChild(add);
    }
    putMark();
    al("対局開始！");
}
function delMark() {
    mark.forEach(e => {
        document.getElementById(String(e)).className = "ban";
    });
    mark = [];
}
function putMark() {
    for(let i = 0; i < H; ++i) for(let j = 0; j < W; ++j) {
        if(field[i][j] != 0) continue;
        if(change(i, j)) {
            mark.push(8 * i + j + 1);
            get(i, j).className = "banAni";
        }
        can_turn = [], now = [];
    }
    if(mark.length === 0) {
        if(notPut) {
            if(number === 64) return;
            al("試合終了！");
            notPut = false;
            finish();
            return;
        }
        if(turn === 1) turn = -1;
        else turn = 1;
        al("置けまへんのでパスします！");
        notPut = true;
        putMark();
    } else notPut = false;
}
function get(i, j) {
    return document.getElementById(String(8 * i + (j + 1)));
}
function getId(id) {
    return document.getElementById(String(id));
}
function finish() {
    let black = 0, white = 0;
    for(let i = 0; i < H; ++i) for(let j = 0; j < W; ++j) {
        if(field[i][j] === 1) black++;
        else if(field[i][j] === -1) white++;
    }
    if(black < white) al(`黒${black}、白${white}で「白」の${white-black}個勝ち！`);
    else if(white < black) al(`黒${black}、白${white}で「黒」の${black-white}個勝ち！`);
    else al(`黒${black}、白${white}で「引き分け」！`);
}
function al(e) {
    getId("alert").innerHTML = e;
    getId("non").style.display = "flex";
    getId("border").style.pointerEvents = "none";
    getId("border").style.opacity = "0.5";
    new Promise((resolve, reject) => {
        document.getElementById("button").addEventListener("click", (e) => {
            console.log("Ljfd")
            resolve();
        })
    }).then(() => {
        getId("non").style.display = "none";
        getId("border").style.pointerEvents = "auto";
        getId("border").style.opacity = "1.0";
    })
}
