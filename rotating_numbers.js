var oldnum = 0;
var newnum;
var is_rotating = false;

window.addEventListener('load', function() {
	addWheel(0, 0);
});

function normalizeNumbers() {
	//preventing excess of minimum or maximum values
	var value = parseFloat(document.querySelector('#input').value);
	var min = parseFloat(document.querySelector('#input').getAttribute('data-min'));
	var max = parseFloat(document.querySelector('#input').getAttribute('data-max'));
	
	if(value > max) {
		document.querySelector('#input').value = max;
	} else if (value < min) {
		document.querySelector('#input').value = min;
	}
	
	//preventing the typing of characters different from integers
	var value_string = document.querySelector('#input').value;
	if(isNaN(value_string.substring(value_string.length - 1))) {
		document.querySelector('#input').value = value_string.substring(0, value_string.length - 1);
	}
	
}

function addWheel(num, pos) {
	var html = `
		<div class='wheel-container' id='wheel-container_${pos}'>
			<div class='wheel-cover'></div>
			<div class='wheel-window'>
				<div class='wheel' id='wheel_${pos}'>`;
	for(i = 0; i < 10; i++) {
		html += `	<div class='number'>${i}</div>`;
	}
	html += `	</div>
			</div>
		</div>
	`;
	
	document.querySelector('#display').insertAdjacentHTML('beforeend', html);
	document.querySelector(`#wheel_${pos}`).style.transform = `translateY(-${num * 50}px)`;
}

function removeWheel(pos) {
	document.querySelector('#display').removeChild(document.querySelector(`#wheel-container_${pos}`));
}

function refreshDisplay() {
	//preventing the accidental double click and emptying the display area
	document.querySelector('#button').setAttribute('onclick', '');
	document.querySelector('#display').innerHTML = '';
	
	//handling the old and new number
	newnum = document.querySelector('#input').value;
	var newnum_arr = newnum.toString().split('');
	var oldnum_arr = oldnum.toString().split('');	
	var length_diff = newnum_arr.length - oldnum_arr.length;
	
	//if the new number has less positional notations than the old one
	if(length_diff < 0) {

		//making sure that after the wheels have been rotated, the indexes in the id's will be counted from 0
		var oldindex = 0;
		var id_indexes = [];
		
		//displaying the supplementary place-values of the old number
		for(n = length_diff; n < 0; n++) {
			addWheel(oldnum_arr[oldindex], n);
			id_indexes.push(n);
			oldindex++;			
		}
		//displaying the part of the old number with the place-values existing in the new number
		for(l = 0; l < newnum_arr.length; l++) {
			addWheel(oldnum_arr[l - length_diff], l);
			id_indexes.push(l);
		}
		//calculating how much delay is needed for the individual wheels
		id_indexes.forEach(function(e, i) {
			document.querySelector(`#wheel_${e}`).style.transition = `${3 / (i + 1)}s`;
		});

		//rotating the wheels
		setTimeout(function() {
			//rotating the supplementary place-values to zero
			for(m = length_diff; m < 0; m++) {
				document.querySelector(`#wheel_${m}`).style.transform = 'translateY(0)';
			}
			//rotating the remaining place-values to represent the new number
			newnum_arr.forEach(function(el, ind) {
				document.querySelector(`#wheel_${ind}`).style.transform = `translateY(-${newnum_arr[ind] * 50}px)`;
			});
			//removing the superfluous zeros from the beginning of the number
			setTimeout(function() {
				for(n = length_diff; n < 0; n++) {
					removeWheel(n);
				}
			}, 3000);

		}, 15);
	//if the new number has more or as many positional notations than the old one
	} else {
		//adding zeros for the new positional notations if there are any
		for(j = 0; j < length_diff; j++) {
			addWheel(0, j);
		}
		//adding the old number to the display
		for(k = 0; k < oldnum_arr.length; k++) {
			addWheel(oldnum_arr[k], length_diff + k);
		}
		
		//calculating the delay for each wheel
		newnum_arr.forEach(function(e, i) {
			document.querySelector(`#wheel_${i}`).style.transition = `${3 / (i + 1)}s`;
		});
		
		//rotating the wheels to the appropriate number
		setTimeout(function() {
			newnum_arr.forEach(function(el, ind) {
				document.querySelector(`#wheel_${ind}`).style.transform = `translateY(-${newnum_arr[ind] * 50}px)`;
			});
		}, 15);
	}
	
	oldnum = document.querySelector('#input').value;
	
	//enabling the button again
	setTimeout(function() {
		document.querySelector('#button').setAttribute('onclick', 'refreshDisplay()');
	}, 3100);
}