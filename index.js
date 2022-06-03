const WIDTH = 640;
const HEIGHT = 480;

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
canvas.width = WIDTH;
canvas.height = HEIGHT;

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getDistance(x1, y1, x2, y2) {
  return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}

class Ball {
  constructor(x, y, radius, velocityX, velocityY) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.velocityX = velocityX;
    this.velocityY = velocityY;
  }

  update() {
    if (this.x <= 0 || this.x >= WIDTH) {
      this.velocityX *= -1;
    }

    if (this.y <= 0 || this.y >= HEIGHT) {
      this.velocityY *= -1;
    }

    this.x += this.velocityX;
    this.y += this.velocityY;
  }

  draw(ctx) {
    ctx.strokeStyle = '#FFF';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.stroke();
  }
}

function metaballs() {
  const balls = Array.from({ length: 10 }, () => {
    const x = getRandomInt(0, WIDTH);
    const y = getRandomInt(0, HEIGHT);
    const r = 2; //getRandomInt(5, 30);
    const velX = getRandomInt(-3, 3);
    const velY = getRandomInt(-3, 3);
    return new Ball(x, y, r, velX, velY);
  });

  const threshold = 0.050;

  const update = () => {
    const canvasData = ctx.createImageData(WIDTH, HEIGHT);
    let { data: pixels } = canvasData;

    for (let ball of balls) {
      ball.update();
      // ball.draw(ctx);
    }
    for (let x = 0; x < WIDTH; x++) {
      for (let y = 0; y < HEIGHT; y++) {
        let volume = 0;
        const pixelIndex = ((y * (WIDTH * 4)) + (x * 4));
        for (const ball of balls) {
          const distance = getDistance(x, y, ball.x, ball.y);
          volume += (1 / distance);
        }

        if (volume > threshold) {
          pixels[pixelIndex] = volume;
          pixels[pixelIndex + 1] = 50;
          pixels[pixelIndex + 2] = 255;
        }
        pixels[pixelIndex + 3] = 255;
      }
    }
    ctx.putImageData(canvasData, 0, 0);
    window.requestAnimationFrame(update);
  }

  update();
}

metaballs();