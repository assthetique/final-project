// untuk menyeleksi elemen canvas
const canvas = document.getElementById("pong");

// getContext dari kanvas = methods & properties untuk gambar dan melakukan apa saja pada canvas
const ctx = canvas.getContext('2d');

// Ball object
const ball = {
    x : canvas.width/2,
    y : canvas.height/2,
    radius : 10,
    velocityX : 5,
    velocityY : 5,
    speed : 7,
    color : "WHITE"
}

// User Paddle
const user = {
    x : 0, // sisi kiri canvas
    y : (canvas.height - 100)/2, // -100 tinggi paddle
    width : 10,
    height : 100,
    score : 0,
    color : "BLUE"
}

// COM Paddle
const com = {
    x : canvas.width - 10, // - lebar paddle
    y : (canvas.height - 100)/2, // -100 tinggi paddle
    width : 10,
    height : 100,
    score : 0,
    color : "RED"
}

// NET
const net = {
    x : (canvas.width - 2)/2,
    y : 0,
    height : 10,
    width : 2,
    color : "GREEN"
}


function pauseGame() {
  if (!gamePaused) {
    game = clearTimeout(game);
    gamePaused = true;
  } else if (gamePaused) {
    game = setTimeout(gameLoop, 1000 / 30);
    gamePaused = false;
  }
}

// gambar persgi panjang, for paddles
function drawRect(x, y, w, h, color){
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
}

// gambar lingkaran untuk bola
function drawArc(x, y, r, color){
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x,y,r,0,Math.PI*2,true);
    ctx.closePath();
    ctx.fill();
}

// listening to the mouse
canvas.addEventListener("mousemove", getMousePos);

function getMousePos(evt){
    let rect = canvas.getBoundingClientRect();
    
    user.y = evt.clientY - rect.top - user.height/2;
}

// saat USER or COM score, ball direset
function resetBall(){
    ball.x = canvas.width/2;
    ball.y = canvas.height/2;
    ball.velocityX = -ball.velocityX;
    ball.speed = 7;
}

// gambar net
function drawNet(){
    for(let i = 0; i <= canvas.height; i+=15){
        drawRect(net.x, net.y + i, net.width, net.height, net.color);
    }
}

// gambar text
function drawText(text,x,y){
    ctx.fillStyle = "#FFF";
    ctx.font = "70px andale mono";
    ctx.fillText(text, x, y);
}

// deteksi tabrakan
function collision(b,p){
    p.top = p.y;
    p.bottom = p.y + p.height;
    p.left = p.x;
    p.right = p.x + p.width;
    
    b.top = b.y - b.radius;
    b.bottom = b.y + b.radius;
    b.left = b.x - b.radius;
    b.right = b.x + b.radius;
    
    return p.left < b.right && p.top < b.bottom && p.right > b.left && p.bottom > b.top;
}

// update function, melakukan semua kalkukasi
function update(){
    
    // ganti score players, jika bola ke kiri "ball.x<0" com win, else if "ball.x > canvas.width" user win
    if( ball.x - ball.radius < 0 ){
        user.score++;
        resetBall();
    }else if (ball.x + ball.radius > canvas.width){
        com.score++;
        resetBall();
    }
    
    // velocity bola
    ball.x += ball.velocityX;
    ball.y += ball.velocityY;
    
    // com jalan sendiri, cara ngalahinnya
    // simple AI
    com.y += ((ball.y - (com.y + com.height/2)))*0.1;
    
    // bola nabral atap atas bawah, inverse velocity y.
    if(ball.y - ball.radius < 0 || ball.y + ball.radius > canvas.height){
        ball.velocityY = -ball.velocityY;
    }
    
    // cek paddle kena user atau paddle com
    let player = (ball.x + ball.radius < canvas.width/2) ? user : com;
    
    // jika bola kena paddle
    if(collision(ball,player)){
        // cek dimana bola kena paddle
        let collidePoint = (ball.y - (player.y + player.height/2));
        // normalisasi value collidePoint, harus dapetin angka antara -1 & 1.
        // -player.height/2 < collide Point < player.height/2
        collidePoint = collidePoint / (player.height/2);
        
        // bola kena atas paddle, ball -45degees angle
        // bola kena tengah paddle, ball 0degrees angle
        // bola kena bawah paddle, ball 45degrees
        // Math.PI/4 = 45degrees
        let angleRad = (Math.PI/4) * collidePoint;
        
        // ganti X and Y velocity direction
        let direction = (ball.x + ball.radius < canvas.width/2) ? 1 : -1;
        ball.velocityX = direction * ball.speed * Math.cos(angleRad);
        ball.velocityY = ball.speed * Math.sin(angleRad);
        
        // cepetin bola tiap kena paddle.
        ball.speed += 0.1;
    }
}

// render function,function untuk al drawing
function render(){
    
    // clear canvas
    drawRect(0, 0, canvas.width, canvas.height, "#000");
    
    // draw user score to the left
    drawText(user.score,canvas.width/4,canvas.height/5);
    
    // draw com score to the right
    drawText(com.score,3*canvas.width/4,canvas.height/5);
    
    // draw net
    drawNet();
    
    // draw user's paddle
    drawRect(user.x, user.y, user.width, user.height, user.color);
    
    // draw com's paddle
    drawRect(com.x, com.y, com.width, com.height, com.color);
    
    // draw ball
    drawArc(ball.x, ball.y, ball.radius, ball.color);
}

function game(){
    update();
    render();
}
// number of frames per second
let framePerSecond = 50;


let loop = setInterval(game,1000/framePerSecond);
