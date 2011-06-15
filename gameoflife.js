var kBoardWidth = 100;
var kBoardHeight= 50;
var kPieceWidth = 10;
var kPieceHeight= 10;
var kPixelWidth = 1 + (kBoardWidth * kPieceWidth);
var kPixelHeight= 1 + (kBoardHeight * kPieceHeight);

var gCanvas;
var gContext;
var gPieces;
var gTimer;

function Cell(row, column) {
    this.row = row;
    this.column = column;
}

function lifeOnClick(e) {
    var cell = getCursorPosition(e);
    clickCell(cell);
}

var clicks = 0;
function clickCell(cell){
    var column = cell.column;
    var row = cell.row;
    gPieces[row * kBoardWidth + column] = 1;
    drawCell(column,row);
    clicks++;
    if(clicks == 3){
	//var timerId = setInterval(animateLife,100);
    }
}

function drawCell(x,y){
    x *= (kPieceWidth);
    y *= (kPieceHeight);
    gContext.fillRect(x,y,kPieceWidth,kPieceHeight);
}

function drawGeneration(){
    var pieces = gPieces;
    drawBoard();
    for(var r = 0, h = kBoardHeight; r < h; ++r){
	for(var c = 0, w = kBoardWidth; c < w; ++c){
	    if(pieces[r * kBoardWidth + c]){
		drawCell(c,r);
	    }
	}
    }
}

function idx(r,c){
    return r * kBoardWidth + c;
}


function valAt(r,c){
    if(gPieces[r * kBoardWidth + c]){
	return 1;
    }else{
	return 0;
    }
}

function nextGeneration(){
	var newPieces = new Array(gPieces.length);
	for(var r = 0, h = kBoardHeight; r < h; ++r){
		for(var c = 0, w = kBoardWidth; c < w; ++c){
			var count = valAt(r-1,c-1) + valAt(r-1,c) + valAt(r-1,c+1) + valAt(r,c-1) + 0 + valAt(r,c+1) + valAt(r+1,c-1) + valAt(r+1,c) + valAt(r+1,c+1);
			//var disp = [valAt(r-1,c-1),valAt(r-1,c),valAt(r-1,c+1),valAt(r,c-1),0,valAt(r,c+1),valAt(r+1,c-1),valAt(r+1,c),valAt(r+1,c+1)];
			if((count == 2 && valAt(r,c)==1) || (count == 3)){
				newPieces[idx(r,c)] = 1;
			}
		}
	}
	gPieces = newPieces;
	//alert(gPieces);
}

function getCursorPosition(e) {
    /* returns Cell with .row and .column properties */
    var x;
    var y;
    if (e.pageX != undefined && e.pageY != undefined) {
	x = e.pageX;
	y = e.pageY;
    }
    else {
	x = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
	y = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
    }
    x -= gCanvas.offsetLeft;
    y -= gCanvas.offsetTop;
    x = Math.min(x, kBoardWidth * kPieceWidth);
    y = Math.min(y, kBoardHeight * kPieceHeight);
    var cell = new Cell(Math.floor(y/kPieceHeight), Math.floor(x/kPieceWidth));
    return cell;
}


function drawBoard() {
    gContext.clearRect(0, 0, kPixelWidth, kPixelHeight);
    setTimeout(null,1000);
    gContext.beginPath();
    
    /* vertical lines */
    for (var x = 0; x <= kPixelWidth; x += kPieceWidth) {
	gContext.moveTo(0.5 + x, 0);
	gContext.lineTo(0.5 + x, kPixelHeight);
    }
    
    /* horizontal lines */
    for (var y = 0; y <= kPixelHeight; y += kPieceHeight) {
	gContext.moveTo(0, 0.5 + y);
	gContext.lineTo(kPixelWidth, 0.5 +  y);
    }
    
    /* draw it! */
    gContext.strokeStyle = "#ccc";
    gContext.stroke();
}


function initGame(canvasElement){
    if(!canvasElement){
	canvasElement = document.createElement("canvas");
	canvasElement.Id = "gameoflife_canvas";
	document.body.appendChild(canvasElement);
    }
    
    gCanvas = canvasElement;
    gContext = gCanvas.getContext("2d");
    gCanvas.width = kPixelWidth;
    gCanvas.height = kPixelHeight;
    gCanvas.addEventListener("click", lifeOnClick, false);
    gPieces = new Array(kBoardWidth * kBoardHeight);
    for(var i = 0, l = gPieces.length; i < l; ++i){
	gPieces[i] = getRandomInt(0,1);
    }
    drawBoard();
}

function getRandomInt(min, max)
{
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pauseGame(){
    // clear timer
    clearInterval(gTimer);
    gTimer = null;
}

function playGame(){
    if(!gTimer){
        gTimer = setInterval(animateLife,100);    
    }
}

function animateLife(){
    nextGeneration();
    drawGeneration();
}


