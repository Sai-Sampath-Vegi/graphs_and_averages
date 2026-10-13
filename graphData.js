function unorderedData() {
  return [12, 45, 78, 23, 91, 56, 34, 67, 89, 40];
}

function constantlyAscendingData() {
  return [12, 23, 34, 40, 45, 56, 67, 78, 89, 91];
}

function constantlyDescendingData() {
  return [91, 89, 78, 67, 56, 45, 40, 34, 23, 12];
}

function randomData(dataLength, maxNumber) {
  const data = [];

  for (let i = 0; i < dataLength; i++) {
    const randomDataItem = Math.random() * maxNumber;
    data.push(randomDataItem);
  }

  return data;
}

module.exports = {
  unorderedData,
  constantlyAscendingData,
  constantlyDescendingData,
  randomData,
};
