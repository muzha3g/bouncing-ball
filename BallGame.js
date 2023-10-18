const canvas = document.querySelector("#canvas");
const ctx = canvas.getContext("2d");
const canvasHeight = canvas.clientHeight;
const canvasWidth = canvas.clientWidth;
let circleX = 160;
let circleY = 60;
let radius = 20;
let xSpeed = 20;
let ySpeed = 20;
let groundX = 200;
let groundY = 325;
let groundHeight = 5;
let count = 0;
let brickArray = [];
function getRandom(min, max) {
  let random = min + Math.floor(Math.random() * (max - min));
  return random;
}

//做磚塊模板
class Brick {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = 30;
    this.height = 30;
    brickArray.push(this);
    this.visible = true;
  }
  drawBrick() {
    ctx.fillStyle = "pink";
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
  touchBall(ballX, ballY) {
    return (
      ballX >= this.x - radius &&
      ballX <= this.x + this.width + radius &&
      ballY >= this.y - radius &&
      ballY <= this.y + this.height + radius
    );
  }
}

//製作所有的磚塊
for (let i = 0; i < 10; i++) {
  new Brick(getRandom(0, 1225), getRandom(0, 375));
}

//設定時間
let game = setInterval(drawCircle, 25);

// 設定可拖曳的地板
canvas.addEventListener("mousemove", (e) => {
  groundX = e.clientX;
});

//遊戲結束畫面
function displayGameOver() {
  ctx.font = "2rem MV Boli";
  ctx.fillStyle = "white";
  ctx.textAlign = "center";
  ctx.fillText("GAME OVER!", canvasWidth / 2, canvasHeight / 2);
}

function drawCircle() {
  //確認球是否打到磚塊
  brickArray.forEach((brick, index) => {
    if (brick.visible && brick.touchBall(circleX, circleY)) {
      count++;
      brick.visible = false;
      //改變x y 方向速度，將磚塊從brickArray中移出
      //從下方撞擊+從上方撞擊
      if (circleY >= brick.y + brick.height || circleY <= brick.y) {
        ySpeed *= -1;
      } else if (circleX <= brick.x || circleX >= brick.x + brick.width) {
        xSpeed *= -1;
      }

      if (count === 10) {
        alert("Game Over");
        clearInterval(game);
      }
    }
  });

  //確認球是否打到地板
  if (
    circleX <= groundX + 200 + radius &&
    circleX >= groundX - radius &&
    circleY <= groundY + radius &&
    circleY >= groundY - radius
  ) {
    if (ySpeed > 0) {
      circleY -= 40;
    } else {
      circleY += 40;
    }
    ySpeed *= -1;
  }
  //確認球是否有打到邊界
  if (circleX >= canvasWidth - radius) {
    xSpeed *= -1;
  } else if (circleX <= radius) {
    xSpeed *= -1;
  } else if (circleY >= canvasHeight - radius) {
    ySpeed *= -1;
  } else if (circleY <= radius) {
    ySpeed *= -1;
  }

  //更動圓座標
  circleX += xSpeed;
  circleY += ySpeed;

  //畫出背景
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);

  //畫出所有的磚塊
  brickArray.forEach((brick) => {
    if (brick.visible) {
      brick.drawBrick();
    }
  });

  //畫出球
  //參數(x(圓心位置),y,radius,startAngle(圓弧以x軸為起點),endAngle)
  ctx.beginPath();
  ctx.arc(circleX, circleY, radius, 0, Math.PI * 2);
  //畫出路線
  ctx.stroke();
  //設定填入的顏色
  ctx.fillStyle = "yellow";
  //填入顏色
  ctx.fill();

  //設定地板
  ctx.fillStyle = "white";
  ctx.fillRect(groundX, groundY, 200, groundHeight);
}
