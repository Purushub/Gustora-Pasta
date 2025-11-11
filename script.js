// === HEADER ANIMATION ===
gsap.from("header", { y: -100, opacity: 0, duration: 1.2, ease: "bounce.out" });

// === PARTICLE EMISSION ===
const pastaShapes = Array.from(document.querySelectorAll("svg[id^='pasta-']")).map(svg => svg.outerHTML);
const container = document.getElementById("particle-container");
const emitters = new Map();

function startEmission(el) {
  if (emitters.has(el)) return;
  let lastX = 0, lastY = 0;
  const interval = setInterval(() => { if (lastX && lastY) createPastaParticle(lastX, lastY); }, 70);
  const onMove = e => { lastX = e.clientX; lastY = e.clientY; };
  el.addEventListener("mousemove", onMove);
  emitters.set(el, { interval, onMove });
}

function stopEmission(el) {
  const d = emitters.get(el);
  if (d) {
    clearInterval(d.interval);
    el.removeEventListener("mousemove", d.onMove);
    emitters.delete(el);
  }
}

function createPastaParticle(x, y) {
  const div = document.createElement("div");
  div.innerHTML = pastaShapes[Math.floor(Math.random() * pastaShapes.length)];
  const svg = div.querySelector("svg");
  const size = 24 + Math.random() * 20;
  svg.style.width = size + "px";
  div.style.position = "absolute";
  div.style.left = x + "px";
  div.style.top = y + "px";
  div.style.pointerEvents = "none";
  div.style.zIndex = "9999";
  container.appendChild(div);

  const angle = 180 + (Math.random() - 0.5) * 140;
  const vel = 250 + Math.random() * 250;
  const vx = Math.cos(angle * Math.PI / 180) * vel;
  const vy = Math.sin(angle * Math.PI / 180) * vel;

  gsap.fromTo(div, { scale: 0.3, rotation: Math.random() * 360, opacity: 1 },
    { x: "+=" + vx, y: "+=" + vy, scale: 0, opacity: 0, rotation: "+=1000", duration: 1.8, ease: "power2.out", onComplete: () => div.remove() });
}

document.querySelectorAll(".heading-bar").forEach(el => {
  el.addEventListener("mouseenter", () => startEmission(el));
  el.addEventListener("mouseleave", () => stopEmission(el));
});

// === 3D POPUP ===
const modal = document.getElementById('modal');
const modalContent = document.querySelector('.modal-content');
const threeDContainer = document.querySelector('.3d-container');
const threeDImg = document.querySelector('.3d-img');
const threeDText = document.querySelector('.3d-text');
const closeBtn = document.querySelector('.close-btn');
let autoRotate;

document.querySelectorAll('.flip-container').forEach(container => {
  container.addEventListener('click', () => {
    const front = container.querySelector('.front');
    const imgSrc = front.querySelector('img').src;
    const pastaName = front.querySelector('span').textContent;
    const backH4 = container.querySelector('.back h4').textContent;
    const backP = container.querySelector('.back p').textContent;
    threeDImg.src = imgSrc;
    threeDText.textContent = `${pastaName}: ${backH4} - ${backP}`;
    modal.style.display = 'flex';
    gsap.from(modalContent, { scale: 0.5, opacity: 0, duration: 0.5, ease: "back.out(1.7)" });
    autoRotate = gsap.to(threeDContainer, { rotationY: "+=360", duration: 20, repeat: -1, ease: "none" });
  });
});

closeBtn.addEventListener('click', () => {
  modal.style.display = 'none';
  if (autoRotate) autoRotate.kill();
});

modal.addEventListener('click', (e) => {
  if (e.target === modal) {
    modal.style.display = 'none';
    if (autoRotate) autoRotate.kill();
  }
});

modalContent.addEventListener('mouseenter', () => {
  if (autoRotate) autoRotate.pause();
});

modalContent.addEventListener('mouseleave', () => {
  if (autoRotate) autoRotate.play();
  threeDContainer.style.transform = 'rotateY(0deg) rotateX(0deg)';
});

modalContent.addEventListener('mousemove', (e) => {
  const rect = modalContent.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  const centerX = rect.width / 2;
  const centerY = rect.height / 2;
  const rotateY = (x - centerX) / centerX * 20;
  const rotateX = (centerY - y) / centerY * 20;
  gsap.to(threeDContainer, { rotationY: rotateY, rotationX: rotateX, duration: 0.2, ease: "power1.out" });
});