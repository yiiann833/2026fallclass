let particles = [];

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  noStroke();
}

function draw() {
  background(0); // 全黑背景

  // 允許滑鼠拖曳旋轉與滾輪縮放 3D 視角
  orbitControl();

  let t = frameCount * 0.05;

  // --- 燈光設定（強化銀色金屬反光與半透明空靈感）---
  ambientLight(100, 105, 120);
  directionalLight(255, 255, 255, -0.5, 0.4, -1);
  pointLight(220, 235, 255, 120, -80, 180);
  pointLight(180, 200, 255, -120, 100, -150);

  // --- 計算小精靈飛行與漂浮姿態 ---
  let floatX = sin(t * 0.7) * 35;
  let floatY = sin(t * 1.4) * 20;
  let floatZ = cos(t * 0.7) * 20;

  // 產生星光仙塵粒子
  if (frameCount % 2 === 0) {
    particles.push(new PixieDust(floatX, floatY, floatZ));
  }

  // 更新並繪製仙塵
  for (let i = particles.length - 1; i >= 0; i--) {
    particles[i].update();
    particles[i].display();
    if (particles[i].isDead()) {
      particles.splice(i, 1);
    }
  }

  // --- 繪製立體小精靈本體 ---
  push();
  translate(floatX, floatY, floatZ);
  // 飛行時的身體微傾與轉動
  rotateY(sin(t * 0.6) * 0.45);
  rotateZ(cos(t * 0.7) * 0.12);
  rotateX(0.15 + sin(t * 1.4) * 0.08);

  // 先繪製銀色連身袍，再繪製半透明身體與翅膀以維持良好的透明疊加效果
  drawSilverRobe(t);
  drawHead(t);
  drawLimbs(t);
  drawWings(t);
  pop();
}

// ==================== 半透明身體材質設定 ====================
function applyTranslucentBodyMaterial() {
  noStroke();
  // 帶有微光澤的半透明空靈身體
  fill(235, 245, 255, 115);
  emissiveMaterial(65, 85, 110);
  specularMaterial(255, 255, 255);
  shininess(40);
}

// ==================== 銀色連身袍 ====================
function drawSilverRobe(t) {
  push();
  noStroke();

  // 銀色絲綢金屬質感
  fill(210, 220, 235, 225);
  emissiveMaterial(45, 50, 65);
  specularMaterial(255, 255, 255);
  shininess(120);

  // 連身袍上半身（合身剪裁）
  push();
  translate(0, -14, 0);
  rotateX(PI);
  cone(19, 42);
  pop();

  // 連身袍長裙擺（隨飛行微微飄動）
  push();
  translate(0, 12, -2);
  rotateX(PI + sin(t * 1.8) * 0.05);
  cone(29, 72);
  pop();

  // 領口銀白光圈滾邊
  push();
  translate(0, -30, 0);
  rotateX(HALF_PI);
  fill(245, 250, 255, 240);
  emissiveMaterial(100, 110, 130);
  torus(10.5, 1.8);
  pop();

  // 裙擺底部銀白流線滾邊
  push();
  translate(0, 47, -2);
  rotateX(HALF_PI + sin(t * 1.8) * 0.05);
  fill(240, 248, 255, 210);
  emissiveMaterial(90, 100, 125);
  torus(28.5, 1.5);
  pop();

  pop();
}

// ==================== 半透明頭部與五官 ====================
function drawHead(t) {
  push();
  translate(0, -55, 0);
  rotateY(sin(t * 0.8) * 0.12);

  // 半透明臉部與頭顱
  applyTranslucentBodyMaterial();
  sphere(23);

  // 半透明尖尖精靈耳朵（左右）
  for (let side of [-1, 1]) {
    push();
    translate(side * 22, 0, -2);
    rotateZ(side * -1.1);
    rotateX(0.2);
    applyTranslucentBodyMaterial();
    cone(5.5, 20);
    pop();
  }

  // 空靈發光的雙眼
  for (let side of [-1, 1]) {
    push();
    translate(side * 8, -2, 20);
    fill(200, 240, 255, 210);
    emissiveMaterial(140, 210, 255);
    sphere(3.0);
    // 眼神核心亮點
    translate(side * 0.8, -0.8, 2.2);
    fill(255, 255, 255, 240);
    emissiveMaterial(255, 255, 255);
    sphere(1.2);
    pop();
  }

  // 半透明鼻子
  push();
  translate(0, 3, 23);
  rotateX(HALF_PI);
  applyTranslucentBodyMaterial();
  cone(2.8, 6.5);
  pop();

  pop();
}

// ==================== 半透明四肢（無靴子與袖子） ====================
function drawLimbs(t) {
  // 左右半透明手臂與手掌
  for (let side of [-1, 1]) {
    push();
    translate(side * 15, -24, 0);
    rotateZ(side * (0.42 + sin(t * 1.4) * 0.2));
    rotateX(cos(t * 1.4 + side) * 0.35 - 0.25);

    applyTranslucentBodyMaterial();

    // 肩膀圓潤關節
    sphere(5);

    // 修長半透明手臂
    translate(0, 17, 0);
    cylinder(4.2, 32);

    // 半透明手掌
    translate(0, 18, 0);
    ellipsoid(4.5, 6, 3);
    pop();
  }

  // 左右半透明雙腿與赤足（從銀色連身袍下擺延伸出來）
  for (let side of [-1, 1]) {
    push();
    translate(side * 9, 32, -2);
    // 飛行時雙腿輕微前後擺動
    rotateX(sin(t * 1.8 + (side === 1 ? 0 : PI)) * 0.3 + 0.22);

    applyTranslucentBodyMaterial();

    // 半透明小腿
    translate(0, 18, 0);
    cylinder(4.5, 34);

    // 半透明赤足
    translate(0, 18, 4);
    rotateX(0.35);
    ellipsoid(4.2, 3.5, 9);
    pop();
  }
}

// ==================== 半透明發光翅膀 ====================
function drawWings(t) {
  push();
  translate(0, -18, -14);

  // 高速拍動角度
  let flap = sin(t * 7.5) * 0.55;

  for (let side of [-1, 1]) {
    // --- 上方大翅膀 ---
    push();
    translate(side * 5, -4, 0);
    rotateY(side * (-0.5 - flap));
    rotateZ(side * 0.28);
    drawSingleWing(side, 1.0);
    pop();

    // --- 下方小翅膀 ---
    push();
    translate(side * 4, 8, -2);
    rotateY(side * (-0.4 - flap * 0.85));
    rotateZ(side * -0.25);
    drawSingleWing(side, 0.65);
    pop();
  }
  pop();
}

function drawSingleWing(side, scaleFactor) {
  push();
  scale(side * scaleFactor, scaleFactor, scaleFactor);

  // 發光半透明翼膜
  stroke(210, 245, 255, 200);
  strokeWeight(1.5);
  fill(180, 235, 255, 85);
  emissiveMaterial(80, 160, 200);

  beginShape();
  vertex(0, 0, 0);
  bezierVertex(25, -45, 0, 75, -55, 0, 90, -15, 0);
  bezierVertex(95, 20, 0, 45, 30, 0, 0, 8, 0);
  endShape(CLOSE);

  // 翅膀內部紋路
  noFill();
  stroke(240, 250, 255, 150);
  strokeWeight(1);
  beginShape();
  vertex(0, 0, 0);
  bezierVertex(30, -20, 0, 55, -22, 0, 80, -12, 0);
  endShape();

  beginShape();
  vertex(25, -12, 0);
  bezierVertex(40, 2, 0, 52, 8, 0, 65, 10, 0);
  endShape();

  noStroke();
  pop();
}

// ==================== 仙塵粒子系統 ====================
class PixieDust {
  constructor(x, y, z) {
    this.pos = createVector(
      x + random(-25, 25),
      y + random(-30, 30),
      z + random(-25, 10)
    );
    this.vel = createVector(
      random(-0.8, 0.8),
      random(0.4, 1.5),
      random(-1.2, 0.5)
    );
    this.life = 255;
    this.size = random(2, 5.5);
  }

  update() {
    this.pos.add(this.vel);
    this.life -= 4.5;
  }

  display() {
    push();
    translate(this.pos.x, this.pos.y, this.pos.z);
    noStroke();
    // 閃爍銀白與淡金星光
    let flicker = random(0.75, 1.0);
    fill(235, 245 * flicker, 255, this.life);
    emissiveMaterial(180 * flicker, 210 * flicker, 255);
    sphere(this.size * (this.life / 255));
    pop();
  }

  isDead() {
    return this.life <= 0;
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
