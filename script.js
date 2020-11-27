/*
 * SRC: https://stackoverflow.com/questions/17242144/javascript-convert-hsb-hsv-color-to-rgb-accurately#answer-17243070
 *  
 * accepts parameters
 * h  Object = {h:x, s:y, v:z}
 * OR 
 * h, s, v        
 */
function HSVtoRGB(h, s, v) {
	var r, g, b, i, f, p, q, t;
	if (arguments.length === 1) {
		s = h.s, v = h.v, h = h.h;
	}
	i = Math.floor(h * 6);
	f = h * 6 - i;
	p = v * (1 - s);
	q = v * (1 - f * s);
	t = v * (1 - (1 - f) * s);
	switch (i % 6) {
		case 0:
			r = v, g = t, b = p;
			break;
		case 1:
			r = q, g = v, b = p;
			break;
		case 2:
			r = p, g = v, b = t;
			break;
		case 3:
			r = p, g = q, b = v;
			break;
		case 4:
			r = t, g = p, b = v;
			break;
		case 5:
			r = v, g = p, b = q;
			break;
	}
	return {
		r: Math.round(r * 255),
		g: Math.round(g * 255),
		b: Math.round(b * 255)
	};
}


// This will give incremental colors
var prevColorVal = Math.random();
/*
    SRC: https://martin.ankerl.com/2009/12/09/how-to-create-random-colors-programmatically/

    HUE: 
    - use golden ratio for rand()
    - 0.618033988749895
    SAT:
    - use a preffered fixed value
    - Eg: 0.5
    VAL
    - use a preffered fixed value
    - Eg: 0.95
}
*/
function getNiceColor(incremental = true) {
	var golden_ratio_conjugate = 0.618033988749895;

	// For incremental colors	
	prevColorVal += 0.005;
	var randHue = (prevColorVal + golden_ratio_conjugate) % 1;

	if (!incremental) {
		randHue = (Math.random() + golden_ratio_conjugate) % 1;
	}

	// For random colors
	// var randHue = (Math.random() + golden_ratio_conjugate) % 1;  
	var fixedSat = 0.85;
	var fixedVal = 0.95;

	var hsv = HSVtoRGB(randHue, fixedSat, fixedVal);
	return 'rgb(' + hsv.r + ', ' + hsv.g + ', ' + hsv.b + ')';
}

function getRandomRgb() {
	var x = Math.floor((Math.random() * 255));
	var y = Math.floor((Math.random() * 255));
	return 'rgb(' + x + ', ' + y + ', 229)';
}

function clearDivs() {
	[].slice.call(document.getElementsByClassName('newDiv'), 0).forEach(function (e) {
		console.log(e);
		e.remove();
	});
}

// 
function randNum(min, max) {
	return Math.floor(Math.random() * (max - min + 1) + min);
}

function randomPoints() {
	var randId = Math.random();
	var newDiv = createDiv(randNum(10, document.body.clientWidth - 10), randNum(800, document.body.clientHeight), randNum(5, 50));
	newDiv.id = randId;
	//newDiv.style.boxShadow = 'white 0 0 5px';
	newDiv.style.background = getNiceColor(false);
	document.body.appendChild(newDiv);
	createCircle(0, 0, 'v2', randId);
}

function createDiv(x, y, size = 1) {
	var newDiv = document.createElement("div");
	newDiv.style.position = 'absolute';
	newDiv.style.left = x - size / 2 + 'px';
	newDiv.style.top = y - size / 2 + 'px';
	newDiv.style.width = size + 'px';
	newDiv.style.height = size + 'px';
	newDiv.style.border = "2px solid white";
	newDiv.style.borderRadius = '50%';
	return newDiv;
}

var prevX, prevY;

function createCircle(x = 0, y = 0, isv2 = false, id = '') {
	if (!isv2) {
		// create a new div element 
		var newDiv = createDiv(x, y, 50);

		newDiv.style.borderColor = getNiceColor();

		// add the newly created element into the DOM
		document.body.appendChild(newDiv);

		setTimeout(function () {
			newDiv.classList.add('newDiv');
			setTimeout(function () {
				newDiv.classList.add('transparent');
				// Keep this here for a different effect
				//newDiv.remove();
				// Or keep it here for the base effect
				setTimeout(function () {
					newDiv.remove();
				}, 300)
			}, 300);
		}, 100);
		return;
	}

	var id = id || mouseDownTime.toJSON();
	var currentDiv = document.getElementById(id);

	currentDiv.classList.add('falling');
	setTimeout(function () {
		currentDiv.classList.add('fallen');

		var fallenCircles = document.getElementsByClassName('fallen');
		var removeSpeed = fallenCircles.length / 2;
		// var removeSpeed = 200;
		if (fallenCircles.length > 50) {
			Object.assign([], fallenCircles).slice(0, fallenCircles.length - 10).forEach(function (elm, ind, arr) {
				setTimeout(function () {
					elm.classList.add('transparent');
				}, removeSpeed * ind);
				setTimeout(function () {
					elm.remove();
				}, (removeSpeed * ind) + 300);
			});
		}
	}, 2000);
}

function incrementSize(e) {
	var height = parseInt(e.style.height.split('px')[0]);
	var width = parseInt(e.style.width.split('px')[0]);
	var top = parseInt(e.style.top.split('px')[0]);
	var left = parseInt(e.style.left.split('px')[0]);
	e.style.height = height + 2 + 'px';
	e.style.width = width + 2 + 'px';
	e.style.top = top - 1 + 'px';
	e.style.left = left - 1 + 'px';
}

function point(e) {
	var closestContainer = e.target.closest('div');
	if(closestContainer && closestContainer.classList.contains('prohibited-area')) return;
	if (!prevX || (Math.abs(prevX - e.clientX) > 5) || (Math.abs(prevY - e.clientY) > 5)) {
		createCircle(e.clientX, e.clientY);
		prevX = e.clientX;
		prevY = e.clientY;
	}
}

function mousedown(e) {
	mouseDownTime = new Date();

	// create a new div element 
	var newDiv = createDiv(e.clientX, e.clientY);
	newDiv.id = mouseDownTime.toJSON();
	newDiv.style.borderColor = getNiceColor(e.clientX);
	newDiv.style.boxShadow = 'white 0 0 5px';
	document.body.appendChild(newDiv);

	// https://stackoverflow.com/questions/15505272/javascript-while-mousedown
	if (isMouseDown == 0) { //Prevent multiple loops!
		isMouseDown = setInterval(function () {
			incrementSize(newDiv);
		}, 10);
	}
}

function mouseup(e) {
	if (isMouseDown != 0) { // Only stop if exists
		clearInterval(isMouseDown);
		isMouseDown = 0;
		createCircle(e.clientX, e.clientY, true);
	}

}

function dblclick() {
	if (++doubleClicked > 5) {
		if (doubleClicked > 10) {
			if (doubleClicked > 20) {
				if (!alert3) {
					alert('Oh my..');
					alert3 = true;
				}
			}
			if (!alert2) {
				alert("Please stop..");
				alert2 = true;
			}
		}
		if (!alert1) {
			alert("You sure about that? Maybe we shall calm down a little..");
			alert1 = true;
		}
	}

	setTimeout(function () {
		doubleClicked--;
	}, 20000);
	
	for (var i = 0; i < 100; i++) {
		(function () {
			setTimeout(function () {
				for (var j = 0; j < 5; j++) {
					randomPoints();
				}
			}, i * 200)
		})(i)
	}
}

function alert(msg) {
	var newDiv = document.createElement("div");
	newDiv.classList.add('alert');
	newDiv.innerText = msg;
	document.body.appendChild(newDiv);
}

var mouseDownTime = new Date();
var isMouseDown = 0;
var container = document.getElementsByClassName('container')[0];
var doubleClicked = 0;
var alert1, alert2, alert3;

document.addEventListener('mousemove', point, true);
document.addEventListener('mousedown', mousedown, false);
document.addEventListener('mouseup', mouseup, false);
document.addEventListener("dblclick", dblclick, false);
