let cnv = document.getElementById('canvas');
let ctx = cnv.getContext('2d');

cnv.height = 400;

const zoomX = 0.005;
const zoomY = 0.01;
const middle = 200;

let chartValues;
let xmlhttp = new XMLHttpRequest();

xmlhttp.open('GET', 'output.csv', false);
xmlhttp.send();
chartValues = xmlhttp.responseText.split(',');

cnv.width = chartValues.length * zoomX;

let x = 0;

ctx.beginPath();
ctx.moveTo(0, middle);

chartValues.forEach((element, index) => {
   ctx.lineTo(x * zoomX, middle - +element * zoomY);
   x++;
});
ctx.stroke();
