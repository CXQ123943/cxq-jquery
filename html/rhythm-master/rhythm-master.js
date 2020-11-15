let song = [];  // 获取到的歌曲的二维数组
let directionArr = []; // 每一行的方向数组
let ball;  // 节奏球
let timer; // 定时器
let speed = 10; // 定时器速度
const period = 50; // 定时器周期
let abscissa = 0; // 获取曲库的第一行: 横坐标
let ordinate = 0; // 获取的每一个横坐标中的每一个方向：纵坐标
let arrowKeys; // 获取的方向键
let direction; // 方向箭头
let screen; // 游戏屏幕
let score = 0; // 游戏得分

$(() => {
    initMusic();
    $("#startBtn").one("click", startGame);
    $("#resetBtn").click(() => location.reload());
    $("#optionBtn").click(() => alert("未开放！"));
});

function initMusic() {
    $.ajax({
        url: "song001.json",
        success: response => song = response
    });
}

function startGame() {
    screen = $(".screen");
    screen.html("Let's Go").css("color", "green");
    ballMove();
    buttonMonitoring();
    getDirections();

}

function ballMove() {
    ball = $(".ball");
    clearTimeout(timer);
    timer = setInterval(() => {
        ball.css("left", ball.position().left + speed);
        if (ball.position().left >= 180 || ball.position().left <= 0) {
            speed = -speed;
        }
    }, period);
}

function buttonMonitoring() {
    $(document).keydown(ev => {
        ev = ev || event;
        if (ev.which === 32) {
            thisSettlement();
            getDirections();
            abscissa++;
            if (abscissa > song.length - 1) {
                gameOver();
            }
        } else {
            if (directionArr[ordinate] === ev.which) {
                $("div").eq(ordinate).css("color", "red");
                ordinate++;
            }
        }
    });
}

function getDirections() {
    directionArr = song[abscissa];
    for (let i = 0, j = directionArr.length; i < j; i++) {
        if (directionArr[i] === 37) {
            direction = "←";
        } else if (directionArr[i] === 38) {
            direction = "↑";
        } else if (directionArr[i] === 39) {
            direction = "→";
        } else if (directionArr[i] === 40) {
            direction = "↓";
        }
        $("div").eq(i).removeClass().html(direction).css("color", "white");
    }
}

function thisSettlement() {
    screen = $(".screen");
    let color = "red";
    let grade = "JUST SO SO 一般般！";
    if (ordinate > directionArr.length - 1) {
        if (ball.position().left >= 120 && ball.position().left < 130) {
            grade = "PERFECT 完美！";
            color = "red";
            score += 500;
        } else if (ball.position().left >= 110 && ball.position().left < 140) {
            grade = "UNBELIEVABLE 不可思议！";
            color = "green";
            score += 300;
        } else if (ball.position().left >= 100 && ball.position().left < 150) {
            grade = "JUST SO SO 一般般！";
            color = "yellow";
            score += 100;
        } else {
            grade = "RUBBISH 辣鸡！";
            color = "white";
            score += 0;
        }
    }
    screen.html(grade).css("color", color);
    $(".score").html(score);
    ordinate = 0;
}

function gameOver() {
    screen.html("游戏结束，最终得分：" + score + "分").css("color", "green");
    clearTimeout(timer);
    $(document).off();
}