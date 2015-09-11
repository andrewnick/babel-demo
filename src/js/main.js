import Point from './Point.js';

window.onload = function() {
	var body = document.querySelector('body');
	var sum = document.getElementsByClassName('sum');
	var location = document.getElementsByClassName('location');

	location[0].innerHTML = 'Good point: ' + new Point(2, 23);
	sum[0].innerHTML = 'Good point: ' + new Point(2, 24).Sum();

}