const r = require("raylib");
const graphData = require("./graphData");

function running() { return !r.WindowShouldClose(); }

function calcAverage(numbers) {
  let total = 0;
  for (const number of numbers) {
    total += number;
  }

  return total / numbers.length;
}

function findHighestValue(arr) {
  let highest = -Infinity;

  for (const item of arr) {
    highest = Math.max(highest, item);
  }

  return highest;
}

function calcHeightScale(data, height, highestValueRelativeHeight) {
  return (
    ((highestValueRelativeHeight / 100) * height) /
    findHighestValue(data)
  );
}

function calcY(height, heightScale, data) {
  return Math.trunc(height - heightScale * data);
}

function isPeak(data, dataIndex) {
  if ((dataIndex === 0) || (dataIndex === (data.length - 1)))
    return false;

  return (
    (data[dataIndex] > data[dataIndex - 1]) &&
    (data[dataIndex] > data[dataIndex + 1])
  );
}

function findPeaks(data) {
  const peaks = [];

  for (let dataIndex = 0; dataIndex < data.length; dataIndex++) {
    if (isPeak(data, dataIndex)) peaks.push(dataIndex);
  }

  return peaks;
}

function vector2(x, y) { return { x, y }; }

function init() {
  const WIDTH = r.GetScreenWidth();
  const HEIGHT = r.GetScreenHeight();

  const data = graphData.randomData(40, 200);

  const gapWidth = 20;

  const highestValueRelativeHeight = 90;
  const heightScale = calcHeightScale(data, HEIGHT, highestValueRelativeHeight);
  const average = Math.trunc(calcAverage(data));

  const peakCircleRadius = 3;
  const averageLineThickness = 3;
  const lineThickness = 2;

  const palette = {
    barColor: r.DARKBLUE,
    averageLineColor: r.ColorAlpha(r.RED, 0.5),
    lineColor: r.DARKGRAY,
    peaksColor: r.ColorAlpha(r.RED, 0.5),
    bg: r.WHITE,
  };

  return {
    WIDTH,
    HEIGHT,
    data,
    gapWidth,
    highestValueRelativeHeight,
    heightScale,
    average,
    peakCircleRadius,
    averageLineThickness,
    lineThickness,
    palette,
  };
}

function setup() {
  r.SetTraceLogLevel(r.LOG_NONE);
  r.InitWindow(800, 600, "Average Graph");
  r.SetTargetFPS(60);

  const world = init();

  world.peaks = findPeaks(world.data);

  return world;
}

function update() { }

function getPoint(world, dataIndex) {
  const x = world.gapWidth * dataIndex;
  const y = calcY(world.HEIGHT, world.heightScale, world.data[dataIndex]);

  return { x, y };
}

function connectPoints(world, dataIndex) {
  const point1 = getPoint(world, dataIndex);
  const point2 = getPoint(world, dataIndex + 1);

  r.DrawLineEx(point1, point2, world.lineThickness, world.palette.lineColor);
}

function drawLine(world, dataIndex) {
  connectPoints(world, dataIndex);
}

function drawLineGraph(world) {
  for (let dataIndex = 0; dataIndex < world.data.length; dataIndex++) {
    drawLine(world, dataIndex);
  }
}

function drawAverageLine(world) {
  const averageLineY = calcY(world.HEIGHT, world.heightScale, world.average);
  r.DrawLineEx(
    vector2(0, averageLineY),
    vector2(world.WIDTH, averageLineY),
    world.averageLineThickness,
    world.palette.averageLineColor
  );
}

function markPeaks(world) {
  for (const peakIndex of world.peaks) {
    r.DrawCircleV(
      getPoint(world, peakIndex),
      world.peakCircleRadius,
      world.palette.peaksColor
    );
  }
}

function draw(world) {
  r.BeginDrawing();

  r.ClearBackground(world.palette.bg);

  drawLineGraph(world);
  markPeaks(world);
  drawAverageLine(world);

  r.EndDrawing();
}

function loop(world) {
  while (running()) {
    update(world);
    draw(world);
  }
}

function teardown() { }

function main() {
  const world = setup();
  loop(world);
  teardown();
}

main();
