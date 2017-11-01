"use strict";
console.clear();
const fps = 250;

const lineWidth = 10;
const lineSpacing = lineWidth / 2;

const backgroundColour = "black";

const colourGuides = "#8A0808";
const colourHours = "#FA5858";
const colourMins = "#F79F81";
const colourSecs = "#F5ECCE";
const colourMilSecs = "#FBFBEF";

const showGuides = true;
const showHours = true;
const showMins = true;
const showSecs = true;
const showMilSecs = true;

const guideIntervals = 5; // Odd numbers only
const intervalGuideType = 0; // 0 or 1 only

const circle = Math.PI * 2;

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let x, y, radiusMiddle, radiusGuide, radiusH, radiusM, radiusS, radiusMS, timer;

const drawCircle = (radius, colour, start, end) => {
  ctx.beginPath();
  ctx.arc(x, y, radius, start - Math.PI / 2, end - Math.PI / 2);
  ctx.lineWidth = lineWidth;
  ctx.strokeStyle = colour;
  ctx.stroke();
  return Promise.resolve("c");
};

const drawGuides = () => {
  for (let i = 0; i < 60; i += guideIntervals) {
    if (i % 2 == intervalGuideType) {
      let start = circle * i / 60;
      let end = circle * (i + guideIntervals) / 60;
      drawCircle(radiusGuide, colourGuides, start, end);
    }
  }
  return Promise.resolve("g");
};

const drawH = (now) => { // 0-23
  let start, end;
  if (now.getHours() > 11) {
    start = 0;
    end = circle * (now.getHours() - 12) / 12;
  } else {
    start = circle * now.getHours() / 12;
    end = circle;
  }
  return drawCircle(radiusH, colourHours, start, end);
};

const drawM = (now) => { // 0-59
  let start, end;
  if (now.getHours() % 2 === 0) {
    start = 0;
    end = circle * now.getMinutes() / 60;
  } else {
    start = circle * now.getMinutes() / 60;
    end = circle;
  }
  return drawCircle(radiusM, colourMins, start, end);
};

const drawS = (now) => { // 0-59
  let start, end;
  if (now.getMinutes() % 2 === 0) {
    start = 0;
    end = circle * now.getSeconds() / 60;
  } else {
    start = circle * now.getSeconds() / 60;
    end = circle;
  }
  return drawCircle(radiusS, colourSecs, start, end);
};

const drawMS = (now) => { // 0-999
  let start, end;
  if (now.getSeconds() % 2 === 0) {
    start = 0;
    end = circle * now.getMilliseconds() / 1000;
  } else {
    start = circle * now.getMilliseconds() / 1000;
    end = circle;
  }
  return drawCircle(radiusMS, colourMilSecs, start, end);
};

const drawClock = (now) => {
  ctx.fillStyle = backgroundColour;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  return  Promise.all([showGuides && drawGuides(), showHours && drawH(now), showMins && drawM(now), showSecs && drawS(now), showMilSecs && drawMS(now)]);
};

const startClock = () => {
  drawClock(new Date()).then(
    (response) => {
      timer = setTimeout(startClock, ~~(999 / fps));
    }, (response) => {}
  );
};

const resize = () => {

  if (!!timer) {
    clearTimeout(timer);
  }

  canvas.width = document.body.clientWidth;
  canvas.height = document.body.clientHeight;

  x = canvas.width / 2;
  y = canvas.height / 2;

  if (y <= x) {
    radiusMiddle = y / 2;
  } else {
    radiusMiddle = x / 2;
  }

  radiusMS = radiusMiddle - 2 * (lineWidth + lineSpacing);
  radiusS = radiusMiddle - (lineWidth + lineSpacing);
  radiusM = radiusMiddle;
  radiusH = radiusMiddle + (lineWidth + lineSpacing);
  radiusGuide = radiusMiddle + 2 * (lineWidth + lineSpacing);

  startClock();

};

resize();

window.addEventListener("resize", resize);
