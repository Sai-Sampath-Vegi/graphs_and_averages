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

function calcBarHeight(world, dataIndex) {
  return Math.trunc(world.heightScale * world.data[dataIndex]);
}

function vector2(x, y) { return { x, y }; }

function init() {
  const WIDTH = r.GetScreenWidth();
  const HEIGHT = r.GetScreenHeight();

  const data = graphData.randomData(150, 100);

  const barWidth = 4;
  const gapWidth = 2;

  const highestValueRelativeHeight = 90;
  const heightScale = calcHeightScale(data, HEIGHT, highestValueRelativeHeight);
  const average = Math.trunc(calcAverage(data));

  const averageLineThickness = 3;

  const palette = {
    barColor: r.DARKBLUE,
    averageLineColor: r.RED,
    bg: r.WHITE,
  };

  return {
    WIDTH,
    HEIGHT,
    data,
    barWidth,
    gapWidth,
    highestValueRelativeHeight,
    heightScale,
    average,
    averageLineThickness,
    palette,
  };
}

function setup() {
  r.SetTraceLogLevel(r.LOG_NONE);
  r.InitWindow(800, 600, "Average Graph");
  r.SetTargetFPS(60);

  const world = init();

  return world;
}

function update() { }

function drawBar(world, dataIndex) {
  const x = (world.barWidth + world.gapWidth) * dataIndex;
  const y = calcY(world.HEIGHT, world.heightScale, world.data[dataIndex]);

  const barHeight = calcBarHeight(world, dataIndex);

  r.DrawRectangle(x, y, world.barWidth, barHeight, world.palette.barColor);
}

function drawBarGraph(world) {
  for (const dataIndex in world.data) {
    drawBar(world, dataIndex);
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

function draw(world) {
  r.BeginDrawing();

  r.ClearBackground(world.palette.bg);

  drawBarGraph(world);
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
