let height = 500;
let width = 500;

let currentCellRow = 1;
let currentCellColumn = 1;
let rows = csv.split('\n');
let cells = rows[0].split(',');
let columnCount = 30;
let rowCount = 50;
let renderRect = {
    firstRow: 1,
    firstColumn: 1,
    lastRow: rowCount,
    lastColumn: columnCount
};
const zebra = false;
const rowHeight = 25;
const scrollbarSize = 16;
let columnWidths = [];
for (let i = 0; i < columnCount/10; i++) {
  columnWidths = columnWidths.concat([25, 75, 50, 25, 30, 100, 50, 20, 80, 45]);
}
let columnPositions = columnWidths.map((sum => value => sum += value)(0));
let columnNames = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];
columnPositions.splice(0, 0, 0);

// CanvasRenderingContext2D.prototype.clip = function () { };

function html(container) {
  let height = container.offsetHeight;
  let width = container.offsetWidth;

  let rowHeaderContainer = document.createElement('div');
  rowHeaderContainer.id = 'row-header-container';
  rowHeaderContainer.className = 'cont';
  rowHeaderContainer.style.height = rowHeight + 'px';
  rowHeaderContainer.style.width = rowHeight + 'px';
  rowHeaderContainer.style.backgroundColor = 'red';
  container.appendChild(rowHeaderContainer);
  let rowHeaderCanvas = document.createElement('canvas');
  rowHeaderCanvas.id = 'row-header-canvas';
  rowHeaderCanvas.width = rowHeight;
  rowHeaderCanvas.height = rowHeight;
  rowHeaderContainer.appendChild(rowHeaderCanvas);
  
  let headerContainer = document.createElement('div');
  headerContainer.id = 'header-container'
  headerContainer.className = 'cont';
  headerContainer.style.left = rowHeight + 'px';
  headerContainer.style.height = rowHeight + 'px';
  headerContainer.style.width = width - rowHeight - scrollbarSize + 'px';
  headerContainer.style.backgroundColor = 'blue';
  container.append(headerContainer);
  let headerCanvas = document.createElement('canvas');
  headerCanvas.id = 'header-canvas';
  // headerCanvas.width = width - rowHeight - scrollbarSize;
  headerCanvas.width = columnPositions[columnPositions.length-1];
  headerCanvas.height = rowHeight;
  headerContainer.appendChild(headerCanvas);
  
  let rowContainer = document.createElement('div');
  rowContainer.id = 'row-container';
  rowContainer.className = 'cont';
  rowContainer.style.top = rowHeight + 'px';
  rowContainer.style.height = height - rowHeight - scrollbarSize + 'px';
  rowContainer.style.width = rowHeight + 'px';
  rowContainer.style.backgroundColor = 'green';
  container.append(rowContainer);
  let rowCanvas = document.createElement('canvas');
  rowCanvas.id = 'row-canvas';
  rowCanvas.width = rowHeight;
  // rowCanvas.height = height - rowHeight - scrollbarSize;
  rowCanvas.height = rowCount * rowHeight;
  rowContainer.appendChild(rowCanvas);
  
  let bodyContainer = document.createElement('div');
  bodyContainer.id = 'body-container';
  bodyContainer.className = 'cont';
  bodyContainer.style.left = rowHeight + 'px';
  bodyContainer.style.top = rowHeight + 'px';
  bodyContainer.style.height = height - rowHeight - scrollbarSize + 'px';
  bodyContainer.style.width = width - rowHeight - scrollbarSize + 'px';
  bodyContainer.style.backgroundColor = 'yellow';
  container.append(bodyContainer);
  let bodyCanvas = document.createElement('canvas');
  bodyCanvas.id = 'body-canvas';
  // bodyCanvas.width = width - rowHeight - scrollbarSize;
  bodyCanvas.width = columnPositions[columnPositions.length-1];
  // bodyCanvas.height = height - rowHeight - scrollbarSize;
  bodyCanvas.height = rowCount * rowHeight;
  bodyContainer.appendChild(bodyCanvas);
  let selectRect = document.createElement('div');
  selectRect.id = "select-rect";
  selectRect.className = 'select-rect';
  bodyContainer.appendChild(selectRect);
}

function drawHeaderRow() {
  let x, y, w, h;
  const ctx = document.getElementById("header-canvas").getContext("2d");
  ctx.font = "10pt Segoe UI";
  let m = ctx.measureText('text');
  // let hf = m.fontBoundingBoxAscent + m.fontBoundingBoxDescent;
  let ha = m.actualBoundingBoxAscent + m.actualBoundingBoxDescent;
  ctx.fillStyle = '#aaa';
  ctx.fillRect(0, 0, 2500, 25);
  ctx.textAlign = "center";
  for (let c = renderRect.firstColumn-1; c <= renderRect.lastColumn-1; c++) {
    x = columnPositions[c]+.5;
    y = 0;
    w = columnWidths[c]-.5;
    h = 25;
    
    ctx.fillStyle = '#ddd';
    ctx.fillRect(x, y, w, h);
    ctx.fillStyle = 'black';
    ctx.fillText(columnNames[c%26], x+(columnWidths[c]/2), y+h/2+ha/2);
  }
}

function drawRowSelector() {
let x, y, w, h;
  const ctx = document.getElementById("row-canvas").getContext("2d");
  ctx.font = "10pt Segoe UI";
  let m = ctx.measureText('text');
  // let hf = m.fontBoundingBoxAscent + m.fontBoundingBoxDescent;
  let ha = m.actualBoundingBoxAscent + m.actualBoundingBoxDescent;
  ctx.fillStyle = '#aaa';
  ctx.fillRect(0, 0, 25, 2500);
  ctx.textAlign = "center";
  let r;
  for (r = renderRect.firstRow-1; r <= renderRect.lastRow-1; r++) {
    x = 0;
    y = r*rowHeight+1;
    w = rowHeight;
    h = rowHeight-.5;
    
    ctx.fillStyle = '#ddd';
    ctx.fillRect(x, y, w, h);
    ctx.fillStyle = 'black';
    ctx.fillText((r+1).toString(), x+13, y+h/2+ha/2);
  }
  console.log(`simon r=${r}`)
}

function drawCellContent() {
  let x, y, w, h;
  const ctx = document.getElementById("body-canvas").getContext("2d");
  ctx.font = "10pt Segoe UI";
  let m = ctx.measureText('text');
  // let hf = m.fontBoundingBoxAscent + m.fontBoundingBoxDescent;
  let ha = m.actualBoundingBoxAscent + m.actualBoundingBoxDescent;
  
  for (let r = renderRect.firstRow-1; r <= renderRect.lastRow-1; r++) {
    for (let c = renderRect.firstColumn-1; c <= renderRect.lastColumn-1 ; c++) {
      
      x = columnPositions[c]+1;
      y = (r*rowHeight)+1;
      w = columnWidths[c]-1;
      h = rowHeight-1;
      
      if (zebra) {
        if (r%2 == 0) {
          ctx.fillStyle = 'white';
        } else {
          ctx.fillStyle = '#eee';
        }
      } else {
        ctx.fillStyle = 'white';
      }
      ctx.fillRect(x, y, w, h);
      ctx.fillStyle = 'black';
      ctx.fillText(cells[((r+1)*(c+1))%10000], x+2, y+h/2+ha/2);
      // console.log(`x=${x}, y=${y}, w=${w}, h=${h}, r=${r}, c=${c}, inde  x=${(r*c)}, text=${cells[(r*c)%10000]}`);
    }
  }
}

// function drawCellContentClip() {
//   let x, y, w, h;
//   const ctx = document.getElementById("canvas").getContext("2d");
//   ctx.font = "10pt Segoe UI";
//   let m = ctx.measureText('text');
//   // let hf = m.fontBoundingBoxAscent + m.fontBoundingBoxDescent;
//   let ha = m.actualBoundingBoxAscent + m.actualBoundingBoxDescent;
//   let cells = rows[0].split(',');
//   for (let c = 0; c < columnCount; c++) {
//     ctx.save();
//     ctx.fillStyle = 'black';
//     x = columnPositions[c%10]+1;
//     y = 0;
//     w = columnWidths[c%10]-1;
//     h = rowCount*rowHeight;
//     ctx.rect(x, y, w, h);
//     ctx.clip();

//     for (let r = 0; r < rowCount; r++) {
//       x = columnPositions[c%10]+1;
//       y = (r*rowHeight)+1;
//       w = columnWidths[c%10]-1;
//       h = rowHeight-1;

//       // ctx.fillRect(x, y, w, h);
//       // ctx.fillStyle = 'white';
//       ctx.fillText(cells[(r*columnCount+c)%10000], x+2, y+h/2+ha/2);
//       // console.log(`x=${x}, y=${y}, w=${w}, h=${h}, r=${r}, c=${c}, index=${r*columnCount+c}, text=${cells[r*columnCount+c]}`);
//     }
//     ctx.restore();
//   }
// }

function drawGrid() {
  const ctx = document.getElementById("body-canvas").getContext("2d");
  ctx.strokeStyle = '#ddd';
  for (let r = 0; r < rowCount; r++) {
    ctx.moveTo(0, (r+1)*rowHeight+0.5);
    ctx.lineTo(columnPositions[columnPositions.length-1], (r+1)*rowHeight+0.5);
  }  
  for (let c = 0; c < columnCount; c++) {
    ctx.moveTo(columnPositions[c]+0.5, 0);
    ctx.lineTo(columnPositions[c]+0.5, rowCount*rowHeight);
  }
  ctx.stroke();
}

function registerMousedownEvent() {
  const canvas = document.getElementById('body-canvas')
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
  let bc = document.getElementById("body-container");
  switch (e.code) {
    case 'ArrowUp':
      if (currentCellRow > 1) {
        currentCellRow--;
        if ((currentCellRow-1) * rowHeight < bc.scrollTop) {
          bc.scrollTop = ((currentCellRow-1) * rowHeight);
        }
      } else {
        return
      }
      break;
    case 'ArrowDown':
      if (currentCellRow < rowCount) {
        currentCellRow++;
        if ((currentCellRow+1) * rowHeight > bc.offsetHeight) {
          bc.scrollTop = (currentCellRow * rowHeight) - bc.offsetHeight + scrollbarSize + 2;
        }
    } else {
        return
      }
      break;
    case 'ArrowLeft':
      if (currentCellColumn > 1) {
        currentCellColumn--;
        if (columnPositions[currentCellColumn-1] < bc.scrollLeft) {
          bc.scrollLeft = columnPositions[currentCellColumn-1];
        }
    } else {
        return
      }
      break;
      case 'ArrowRight':
        if (currentCellColumn < columnCount) {
          currentCellColumn++;
          if (columnPositions[currentCellColumn-1] + columnWidths[currentCellColumn-1] > bc.offsetWidth) {
          // if (columnPositions[currentCellColumn+1] > bc.offsetWidth) {
            bc.scrollLeft = columnPositions[currentCellColumn-1] + columnWidths[currentCellColumn-1] - bc.offsetWidth + scrollbarSize + 2;
          }
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

function registerScroll() {
  const bc = document.getElementById('body-container')
  bc.addEventListener('scroll', function(e) {
    handleScroll(e);
  });
}

function handleScroll(e) {
  let bc = document.getElementById("body-container");
  document.getElementById("row-container").scrollTop = bc.scrollTop;
  document.getElementById("header-container").scrollLeft = bc.scrollLeft;
}

document.onreadystatechange = () => {
  if (document.readyState === "interactive") {
    html(document.getElementById('foo'));
    drawHeaderRow();
    drawRowSelector();
    drawCellContent();
    drawGrid();
    registerMousedownEvent();
    registerKeydown();
    registerScroll();
    updateCurrentCellPosition();
  }
};
