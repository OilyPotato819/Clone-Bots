let cnv = document.getElementById('canvas');
let ctx = cnv.getContext('2d');

fetch('http://localhost:3000/getData')
   .then((response) => response.json())
   .then((data) => {
      cnv.height = 400;

      const zoomX = 0.005;
      const zoomY = 0.006;
      const middle = 200;

      console.log(data.frequencies);
   });
