var today = new Date();
// var today_pst = today.toLocaleString("en-US", {timeZone: "America/Los_Angeles"})
var year = today.getUTCFullYear();
var month = today.getUTCMonth();
var day = today.getUTCDate();
var hour = today.getHours();
var minute = today.getMinutes();
var second = today.getSeconds();

// var year_pst = today.getFullYear();
// var month_pst = today_pst.getMonth();
// var day = today.getDate();
// var hour_pst = today.getHours();
// var minute = today_pst.getMinutes();
// var second = today_pst.getSeconds();
// $('#time').text(day_pst);

// var timeish = hour + '.' + (minute * 60);

// var timeDiff = {
// 	setStartTime : function () {
// 		d = new Date();
// 		time  = d.getTime();
// 	},

// 	getDiff : function () {
// 		d = new Date();
// 		return (d.getTime()-time);
// 	}
// }

function pad(num, size) {
    num = num.toString();
    while (num.length < size) num = "0" + num;
    return num;
}
var month_padded = pad(today.getMonth()+1, 2);
var day_padded = pad(today.getDate(), 2);
var today_str = month_padded+day_padded+today.getFullYear().toString();


var mtbl  = new Array(31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31);
var mnames = new Array("Jan", "Feb", "Mar", "Apr", "May", "Jun",
	"Jul", "Aug", "Sep", "Oct", "Nov", "Dec");

// End-of-month Julian Day lookup tables for normal and leap years
var jdtbln = new Array(0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334);
var jdtbll = new Array(0, 31, 60, 91, 121, 152, 182, 213, 244, 274, 305, 335);

var leap = false;
var jdtbl = jdtbln;
var yearpattern = /^\d{4,5}$/;
var displayStyle = "std";
var abtlinkhidden = true;

function isLeap(year) {
	return (year % 100 != 0) && (year % 4 == 0) || (year % 400 == 0);
}
function julianDay(day, month) {
	return day + jdtbl[month-1];
}

// returns the day of week as an integer: 1=Sun, 2=Mon, ..., 7=Sat
function dayOfWeek(day, month, year) {
	leap = isLeap(year);
	jdtbl = leap? jdtbll : jdtbln;
	var dow = (year + julianDay(day, month)
		+ Math.floor((year-1)/4) - Math.floor((year-1)/100)
		+ Math.floor((year-1)/400)) % 7;
	return dow == 0? 7: dow;
}


function renderMonth(parent, month, year) {
	let dateCells = $(parent + " div.dt");
	let cellid = dayOfWeek(1, month, year) - 1;
	let max = mtbl[month-1];
	// let msg = ""
	if (max == 28 && leap) max = 29;

	// dateCells.eq(cellid++).html(1);
	for (let ix = 1; ix <= max; ix++) {

		if (Number(today_str) != Number(""+month+ix+year)) {
			btn = "<button class=\"unstyled-button\">"+ix+"</button>";
		} else {
			btn = "<button class=\"unstyled-button\" style=\"font-weight:bold;\">"+ix+"</button>";
		}
		dateCells.eq(cellid).html(btn);

		(function(m,d,y){
	        dateCells.eq(cellid++).on('click', function () {
	        	// alert(today_str)
	        	// alert(""+m+d+y)
	        	if (Number(today_str) < Number(""+m+d+y)) {
	        		alert(learned['future']);
	        	}
	        	else {
		        	// alert(today_str);
		        	try{ 
		        		let disp_str = "";
		        		for (const s of learned[""+m+d+y]) {
		        			disp_str += "\u2022" + s + "\n";
		        		}
		        		alert(disp_str);
						// alert(learned[""+m+d+y][0]);
					} catch (error) {
						alert(learned['empty']);
					}
				}
	           // alert(""+m+d+y); // index === the value that was passed
	        });
    	})(pad(month, 2),pad(ix,2),year);
	
	}
	$(parent + " div.mo").html(mnames[month-1]);
}



function getMonthSequence(mainMonth) {
	let tmp = new Array(0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11);
	if (mainMonth == 0) return tmp;
	
	let monthseq = new Array();
	monthseq.push(mainMonth);
	if (mainMonth == 11) {
		// n+1 isn't possible
		monthseq.push(9);
		monthseq.push(10);
		tmp.splice(9, 3);
	} else {
		monthseq.push(mainMonth-1);
		monthseq.push(mainMonth+1);
		tmp.splice(mainMonth-1, 3);
	}
	return monthseq.concat(tmp);
}

function getIdPrefix(ix) {
	return "#p";
}

function showSelective() {
	$("div#cal").show();
	$("p.prinvis").show();
	$("#mtoprow").show();
}

function renderCalendar(startMonth, stopMonth, year) {
	year = parseInt(year);

	// timeDiff.setStartTime();
	let d = new Date();
	let seqargs = 0;
	let monthHtml = $("span#m0").html();
	let monthseq = getMonthSequence(seqargs);

	$("#caltitle").text(year);
	// $("#title").text(year);
	$('#prev').attr('href', '#' + (year-1)).text(year-1);
	$('#next').attr('href', '#' + (year+1)).text(year+1);


	for (let ix = startMonth-1; ix < stopMonth; ix++) {
		let newId = getIdPrefix(ix) + ix;
		if ($(newId).length == 1) {
			$(newId).html(monthHtml);
			renderMonth(newId, monthseq[ix]+1, year);
		}
	}

	showSelective();

}

// Clock
// function convertToHHMM(info) {
// 	var hrs = parseInt(Number(info));
// 	var min = Math.round((Number(info)-hrs) * 60);
// 	return hrs+':'+min;
// }



// function startTime() {
// 	var today = new Date();
// 	var hour = today.getHours();
// 	var minute = today.getMinutes();
// 	var second = today.getSeconds();

// 	if (hour > 12) {
// 		hour -= 12;
// 	} else if (hour === 0) {
// 		hour = 12;
// 	}

// 	minute = checkTime(minute);
// 	second = checkTime(second);
// 	$('#time').text(mnames[month] + " " + day + ", " + year); //hour + ":" + minute + ":" + second);
// 	// t = setTimeout(function(){startTime()},500);
// }

// function checkTime(i) {
// 	if (i < 10) {
// 		i = "0" + i;
// 	}
// 	return i;
// }

$(window).on('hashchange', function() {
	if (window.location.hash) {
		var hash = window.location.hash.replace('#', '');
	}

	if(/^\d{4}$/.test(hash)) {
		renderCalendar(1, 12, hash);
	} else {
		renderCalendar(1, 12, year);
	}
});


// Lets get this shit started
$(document).ready(function () {

	if (window.location.hash) {
		var hash = window.location.hash.replace('#', '');
	}

	if(/^\d{4}$/.test(hash)) {
		renderCalendar(1, 12, hash);
	} else {
		renderCalendar(1, 12, new Date().getFullYear());
	}

	// startTime();
	
});