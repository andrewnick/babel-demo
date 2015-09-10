import Point from './Point.js';
var body = document.querySelector('body');
body.textContent = 'Good point: ' + new Point(2, 23);
body.textContent = 'Good point: ' + new Point(2, 23).Sum();
