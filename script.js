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
const WaitForClick = () => new Promise(resolve => document.getElementById("button").addEventListener("click", (e) => {
    resolve();
}));
let turn = 1; // black
let H = 8, W = 8;
const moveH = [0, 0, 1, -1, 1, 1, -1, -1];
const moveW = [1, -1, 0, 0, 1, -1, -1, 1];
let mark = [], his = [];
let hh, ww, cnt, notPut = false, number = 4;
let can_turn = [], now = []; // ひっくり返せる駒のID
let p1m = 0, p2m = 0, p1s = 0, p2s = 0; //second
let interval1, interval2, timeou = false, countTime = true;;
start();
function yech(id) { 
    let h = Math.floor(id / 8), w = id % 8;
    if(w === 0) w = 8, h--;
    w--;
    if(field[h][w] != 0) return; //何もない場所か
    // おいてとれるか
    // ひっくり返す
    if(change(h, w)) {
        if(countTime) {
            if(turn == -1) startTimer(-1), stopTimer(1);
            else startTimer(1), stopTimer(-1);
        }
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
    else {
        let input = ["そこには置けません！"];
        al(input);
    } 

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
    let input = ["対局開始！", "持ち時間設定", "駒を置いたら時計がスタートします。"];
    al(input);
}
function delMark() {
    mark.forEach(e => {
        //document.getElementById(String(e)).className = "ban";
        document.getElementById(String(e)).innerHTML = "";
    });
    mark = [];
}
function putMark() {
    for(let i = 0; i < H; ++i) for(let j = 0; j < W; ++j) {
        if(field[i][j] != 0) continue;
        if(change(i, j)) {
            mark.push(8 * i + j + 1);
            let add = document.createElement("div");
            add.className = "banMark";
            get(i, j).appendChild(add);
        }
        can_turn = [], now = [];
    }
    if(mark.length === 0) {
        if(notPut) {
            if(number === 64) return;
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
    let input = ["試合終了！"];
    if(timeou && turn == 1) input.push("時間切れにより白の勝ち！");
    else if(timeou && turn == -1) input.push("時間切れにより黒の勝ち！");
    else if(black < white) input.push(`黒${black}、白${white}で「白」の勝ち！`);
    else if(white < black) input.push(`黒${black}、白${white}で「黒」の勝ち！`);
    else input.push(`黒${black}、白${white}で「引き分け」！`);
    al(input);
    countTime = false;
    stopTimer(turn);
    timeou = false;
}
async function al(e) {
    for(let i = 0; i < e.length; ++i) {
        getId("alert").innerHTML = e[i];
        getId("non").style.display = "flex";
        getId("border").style.pointerEvents = "none";
        getId("border").style.opacity = "0.5";
        if(e[i] == "持ち時間設定") getId("num").style.display = "block";
        await WaitForClick();
        getId("non").style.display = "none";
        getId("border").style.pointerEvents = "auto";
        getId("border").style.opacity = "1.0";  
        if(e[i] == "持ち時間設定") getId("num").style.display = "none";
    }
}
document.getElementById("minute").addEventListener("input", (e) => {
    p1m = e.target.value;
    p2m = e.target.value;
    if(0 <= p1s && p1s <= 9) getId("p1").innerHTML = `${p1m}:0${p1s}`;
    else getId("p1").innerHTML = `${p1m}:${p1s}`;
    if(0 <= p2s && p2s <= 9) getId("p2").innerHTML = `${p2m}:0${p2s}`;
    else getId("p2").innerHTML = `${p2m}:${p2s}`;
})
document.getElementById("second").addEventListener("input", (e) => {
    p1s = e.target.value * 10;
    p2s = e.target.value * 10;
    if(0 <= p1s / 10 && n(p1s) <= 9) getId("p1").innerHTML = `${p1m}:0${n(p1s)}`;
    else getId("p1").innerHTML = `${p1m}:${n(p1s)}`;
    if(0 <= p2s / 10 && n(p2s) <= 9) getId("p2").innerHTML = `${p2m}:0${n(p2s)}`;
    else getId("p2").innerHTML = `${p2m}:${n(p2s)}`;
})
function startTimer(whi) {
    if(whi == 1) {
        interval1 = setInterval(() => {
            p1s--;
            set();
        }, 100);
    } else {
        interval2 = setInterval(() => {
            p2s--;
            set();
        }, 100);
    }

}
function stopTimer(e) {
    if(e == 1) clearInterval(interval1);
    else clearInterval(interval2);
}
function set() {
    let timoff = false, c;
    if(p1m == 0 && p1s <= 0) {
        timoff = true;
        c = 1;
    } else if(p1s < 0) {
        p1s = 590;
        p1m--;
    }
    if(p2m == 0 && p2s <= 0) {
        timoff = true;
        c = -1;
    } else if(p2s < 0) {
        p2s = 590;
        p2m--;
    }
    if(0 <= p1s / 10 && n(p1s) <= 9) getId("p1").innerHTML = `${p1m}:0${n(p1s)}`;
    else getId("p1").innerHTML = `${p1m}:${n(p1s)}`;
    if(0 <= p2s / 10 && n(p2s) <= 9) getId("p2").innerHTML = `${p2m}:0${n(p2s)}`;
    else getId("p2").innerHTML = `${p2m}:${n(p2s)}`;
    if(timoff) timeou = true, stopTimer(c), finish();
}
function n(e) {
    return Math.floor(e / 10);
}
