let currentCellRow = 1;
let currentCellColumn = 1;
let rows = csv.split('\n');
let columnCount = 1000;
let rowCount = 10000;
const rowHeight = 25;
const columnWidths = [
  25, 75, 50, 25, 30, 100, 50, 20, 80, 45,
  25, 75, 50, 25, 30, 100, 50, 20, 80, 45,
  25, 75, 50, 25, 30, 100, 50, 20, 80, 45,
  25, 75, 50, 25, 30, 100, 50, 20, 80, 45,
  25, 75, 50, 25, 30, 100, 50, 20, 80, 45,
  25, 75, 50, 25, 30, 100, 50, 20, 80, 45,
  25, 75, 50, 25, 30, 100, 50, 20, 80, 45,
  25, 75, 50, 25, 30, 100, 50, 20, 80, 45,
  25, 75, 50, 25, 30, 100, 50, 20, 80, 45,
  25, 75, 50, 25, 30, 100, 50, 20, 80, 45,
];
let columnPositions = columnWidths.map((sum => value => sum += value)(0));
columnPositions = [
  0, 25, 100, 150, 175, 205, 305, 355, 375, 455,
  500, 525, 600, 650, 675, 705, 805, 855, 875, 955, 1000, 1025, 1100, 1150, 1175, 1205, 1305, 1355, 1375, 1455, 1500, 1525, 1600, 1650, 1675, 1705, 1805, 1855, 1875, 1955, 2000, 2025, 2100, 2150, 2175, 2205, 2305, 2355, 2375, 2455, 2500, 2525, 2600, 2650, 2675, 2705, 2805, 2855, 2875, 2955, 3000, 3025, 3100, 3150, 3175, 3205, 3305, 3355, 3375, 3455, 3500, 3525, 3600, 3650, 3675, 3705, 3805, 3855, 3875, 3955, 4000, 4025, 4100, 4150, 4175, 4205, 4305, 4355, 4375, 4455, 4500, 4525, 4600, 4650, 4675, 4705, 4805, 4855, 4875, 4955, 5000]


// CanvasRenderingContext2D.prototype.clip = function () { };

function drawCellContent() {
  let x, y, w, h;
  const ctx = document.getElementById("canvas").getContext("2d");
  ctx.font = "10pt helvetica";
  let m = ctx.measureText('text');
  // let hf = m.fontBoundingBoxAscent + m.fontBoundingBoxDescent;
  let ha = m.actualBoundingBoxAscent + m.actualBoundingBoxDescent;
  let cells = rows[0].split(',');
  for (let c = 0; c < columnCount; c++) {
    ctx.save();
    ctx.fillStyle = 'black';
    x = columnPositions[c]+1;
    y = 0;
    w = columnWidths[c]-1;
    h = rowCount*rowHeight;
    ctx.rect(x, y, w, h);
    ctx.clip();

    for (let r = 0; r < rowCount; r++) {
      x = columnPositions[c]+1;
      y = (r*rowHeight)+1;
      w = columnWidths[c]-1;
      h = rowHeight-1;

      // ctx.fillRect(x, y, w, h);
      // ctx.fillStyle = 'white';
      ctx.fillText(cells[(r*columnCount+c)%10000], x+2, y+h/2+ha/2);
      // console.log(`x=${x}, y=${y}, w=${w}, h=${h}, r=${r}, c=${c}, index=${r*columnCount+c}, text=${cells[r*columnCount+c]}`);
    }
    ctx.restore();
  }
}

function drawCellContent2() {
  let x, y, w, h;
  const ctx = document.getElementById("canvas").getContext("2d");
  ctx.font = "10pt helvetica";
  let m = ctx.measureText('text');
  // let hf = m.fontBoundingBoxAscent + m.fontBoundingBoxDescent;
  let ha = m.actualBoundingBoxAscent + m.actualBoundingBoxDescent;
  let cells = rows[0].split(',');
  for (let c = 0; c < columnCount; c++) {
    x = columnPositions[c]+1;
    y = 0;
    w = columnWidths[c]-1;
    h = rowCount*rowHeight;
    ctx.fillStyle = 'white';
    ctx.fillRect(x, y, w, h);
    
    for (let r = 0; r < rowCount; r++) {
      x = columnPositions[c]+1;
      y = (r*rowHeight)+1;
      w = columnWidths[c]-1;
      h = rowHeight-1;
      
      ctx.fillStyle = 'black';
      ctx.fillText(cells[r*columnCount+c], x+2, y+h/2+ha/2);
      // console.log(`x=${x}, y=${y}, w=${w}, h=${h}, r=${r}, c=${c}, index=${(r*columnCount+c)%10000}, text=${cells[(r*columnCount+c)%10000]}`);
    }
    ctx.restore();
  }
}

function drawGrid() {
  const ctx = document.getElementById("canvas").getContext("2d");
  ctx.strokeStyle = '#ddd';
  for (let r = 0; r < 1000; r++) {
    ctx.moveTo(0, (r+1)*rowHeight+0.5);
    ctx.lineTo(columnPositions[columnPositions.length-1], (r+1)*rowHeight+0.5);
    // ctx.stroke();
  }  
  for (let c = 0; c < columnPositions.length; c++) {
    ctx.moveTo(columnPositions[c]+0.5, 0);
    ctx.lineTo(columnPositions[c]+0.5, rowCount*rowHeight);
    // ctx.stroke();
  }
  ctx.stroke();
}

function drawZebra() {
  const ctx = document.getElementById("canvas").getContext("2d");
  ctx.fillStyle = "#eee";
  for (let r=0; r < rowCount; r+= 2) {
    ctx.fillRect(0+1, r*rowHeight, columnPositions[columnPositions.length-1], rowHeight)

  }
}

function registerMousedownEvent() {
  const canvas = document.getElementById('canvas')
  canvas.addEventListener('mousedown', function(e) {
      handleMousedown(canvas, e)
  });
}

function handleMousedown(canvas, event) {
  const rect = canvas.getBoundingClientRect()
  const x = event.clientX - rect.left
  const y = event.clientY - rect.top
  let selectRect = document.getElementById("select-rect");
  let r, c;
  for (r = 0; r < rowCount; r++) {
    if (y >= r*rowHeight && y <= (r+1)*rowHeight)
    break;
  }
  for (c = 0; c < columnCount; c++) {
    if (x >= columnPositions[c] && x <= columnPositions[c]+columnWidths[c])
    break;
  }
  console.debug(`click: x=${x}, y=${y}, row=${r}, column=${c}`);
  currentCellRow = r+1;
  currentCellColumn = c+1;
  updateCurrentCellPosition();
}

function registerKeydown() {
  const body = document.querySelector('body')
  body.addEventListener('keydown', function(e) {
    handleKeydown(e);
  });
}

function handleKeydown(e) {
  switch (e.code) {
    case 'ArrowUp':
      if (currentCellRow > 1) {
        currentCellRow--;
      } else {
        return
      }
      break;
    case 'ArrowDown':
      if (currentCellRow < rowCount) {
        currentCellRow++;
      } else {
        return
      }
      break;
    case 'ArrowLeft':
      if (currentCellColumn > 1) {
        currentCellColumn--;
      } else {
        return
      }
      break;
    case 'ArrowRight':
      if (currentCellColumn < columnCount) {
        currentCellColumn++;
      } else {
        return
      }
      break;
    default:
        return;
  }
  e.preventDefault();
  updateCurrentCellPosition();
}

function updateCurrentCellPosition() {
  let selectRect = document.getElementById("select-rect");
  selectRect.style.left = columnPositions[currentCellColumn-1] + "px";
  selectRect.style.width = columnWidths[currentCellColumn-1]-5 + "px";;
  selectRect.style.top = (currentCellRow-1)*25 + "px";;
  selectRect.style.height = rowHeight-5 + "px";;
  console.debug(
    `currentCell: ` +
    `row=${currentCellRow}, ` +
    `column=${currentCellColumn}`
  );
}

document.onreadystatechange = () => {
  if (document.readyState === "interactive") {
    let d1 = new Date();
    // drawZebra();
    drawCellContent2();
    drawGrid();
    registerMousedownEvent();
    registerKeydown();
    updateCurrentCellPosition();
  }
};
