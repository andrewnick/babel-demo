/******************************************
 * Importing local files
 * import Point from './Point.js';
 * 
 * Importing npm modules
 * http://exploringjs.com/es6/ch_deploying-es6.html#ch_deploying-es6
 * 5.7.3.3 Using npm packages
 * You can install packages via npm and use them from your ES6 code, seamlessly. For example: First    * install lodash.
 * 
 * $ mkdir node_modules
 * $ npm install lodash
 * Then use it anywhere in your ES6 code:
 * 
 * import { zip } from 'lodash';
 * console.log(zip(['1', '2'], ['a', 'b']));
 * 
 *****************************************/


import Point from './Point.js';
import { zip } from 'lodash';	

window.onload = function() {
	var body = document.querySelector('body');
	var sum = document.getElementsByClassName('sum');
	var location = $('.location');

	location.html('Good point: ' + new Point(2, 23));
	sum[0].innerHTML = 'Good point: ' + new Point(2, 24).Sum();

	console.log(zip(['1', '2'], ['a', 'b']));

}