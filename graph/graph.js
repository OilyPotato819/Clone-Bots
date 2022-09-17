let cnv = document.getElementById('canvas');
let ctx = cnv.getContext('2d');

cnv.width = 10000;
cnv.height = 400;

let chartValues;
let xmlhttp = new XMLHttpRequest();

xmlhttp.open('GET', 'output.csv', false);
xmlhttp.send();

if (xmlhttp.status == 200) {
   chartValues = xmlhttp.responseText;
}

const valueArray = chartValues.split(',');

const zoomX = 0.005;
const zoomY = 0.01;

const middle = 200;
let x = 0;

ctx.moveTo(0, middle);
valueArray.forEach((element, index) => {
   x++;
   ctx.lineTo(x * zoomX, middle - +element * zoomY);
});
ctx.stroke();
