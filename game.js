(function () { 

var scoo = {
	frame: 0,
	points: 0,
	total_points: 0,
	steam: 0,
	points_increment: 1,
	steam_increment: 2,
	steam_cap: 20,
	achievements: [],
	upgrades: [],
	upgrades_to_show: 1,
	start_time: new Date(),
	multiplier_width: 25,
	multiplier_bonus: 0.5,
	is_showing_multiplier: false
};
var upgrades = [
	{
		name: 'Clicker Lv1',
		cost: 10,
		click_bonus: 1,
		achievement: 'First upgrade unlocked',
		tooltip: 'Increased your bonus for clicking by 1'
	},
	{
		name: 'Upgrade Amount Lv1',
		cost: 15,
		upgrade_bonus: 2,
		tooltip: 'Increases the number of upgrades available by 1'
	},
	{
		name: 'Multiplier bar Lv1',
		cost: 20,
		upgrade_multi_bar: 10,
		tooltip: 'Increased the width of the multiplier bar by 10%'
	},
	{
		name: 'Capacity Lv1',
		cost: 10,
		capacity_bonus: 5,
		tooltip: 'Increases Scoo\'s maximum capacity by 5'
	},
	{
		name: 'Capacity Rate Lv1',
		cost: 30,
		capacity_rate_bonus: 0.25,
		tooltip: 'Capacity will cool off quicker (0.25/s)'
	},
	{
		name: 'Multiplier bonus Lv1',
		cost: 50,
		upgrade_multi_bonus: 0.5,
		tooltip: 'Increases the bonus while in the multiplier zone'
	},
	{
		name: 'Clicker Lv2',
		cost: 25,
		click_bonus: 1,
		tooltip: 'Increased your bonus for clicking by 1'
	},
	{
		name: 'Clicker Lv3',
		cost: 50,
		click_bonus: 1,
		tooltip: 'Increased your bonus for clicking by 1'
	},
		{
		name: 'Capacity Lv2',
		cost: 50,
		capacity_bonus: 5,
		tooltip: 'Increases Scoo\'s maximum capacity by 5'
	},
	{
		name: 'Capacity Rate Lv2',
		cost: 60,
		capacity_rate_bonus: 0.25
	},
	{
		name: 'Multiplier bonus Lv2',
		cost: 75,
		upgrade_multi_bonus: 0.5,
	},
	{
		name: 'Clicker Lv4',
		cost: 100,
		click_bonus: 1,
		achievement: 'First upgrade unlocked'
	},
	{
		name: 'Capacity Lv3',
		cost: 100,
		capacity_bonus: 5
	},
	{
		name: 'Upgrade Amount Lv2',
		cost: 200,
		upgrade_bonus: 1,
	},
	{
		name: 'Capacity Rate Lv3',
		cost: 80,
		capacity_rate_bonus: 0.25
	},
	{
		name: 'Clicker Lv5',
		cost: 150,
		click_bonus: 1
	},
	{
		name: 'Multiplier bonus Lv3',
		cost: 175,
		upgrade_multi_bonus: 0.5,
	},
	{
		name: 'Clicker Lv6',
		cost: 200,
		click_bonus: 1
	},
		{
		name: 'Multiplier bar Lv2',
		cost: 210,
		upgrade_multi_bar: 10,
	},
	{
		name: 'Capacity Lv4',
		cost: 250,
		capacity_bonus: 5
	},
	{
		name: 'Capacity Rate Lv4',
		cost: 300,
		capacity_rate_bonus: 0.25
	},
	{
		name: 'Clicker Lv7',
		cost: 300,
		click_bonus: 1,
		achievement: 'First upgrade unlocked'
	},
	{
		name: 'Multiplier bonus Lv4',
		cost: 325,
		upgrade_multi_bonus: 0.5,
	},
	{
		name: 'Capacity Lv5',
		cost: 300,
		capacity_bonus: 5
	},
	{
		name: 'Upgrade Amount Lv3',
		cost: 500,
		upgrade_bonus: 1,
	},
	{
		name: 'Capacity Rate Lv5',
		cost: 400,
		capacity_rate_bonus: 0.25
	},
	{
		name: 'Clicker Lv8',
		cost: 450,
		click_bonus: 1
	},
	{
		name: 'Multiplier bonus Lv5',
		cost: 500,
		upgrade_multi_bonus: 0.5,
	},
	{
		name: 'Clicker Lv9',
		cost: 600,
		click_bonus: 1
	},
		{
		name: 'Capacity Lv6',
		cost: 500,
		capacity_bonus: 5
	},
	{
		name: 'Capacity Rate Lv6',
		cost: 600,
		capacity_rate_bonus: 0.25
	},
	{
		name: 'Scoo\'s Soul',
		cost: 2000,
		capacity_rate_bonus: 2,
		capacity_bonus: 2,
		click_bonus: 2,
		is_win: true,
		achievement: 'You Win!'
	},
];
var steam_multiplier = 1;
var is_stickied = false;
var alert_queue = [];
var bar_colors = ['#01579B', '#764E7F', '#D50000'];

$(function () {
	load_game();
	if (scoo.total_points === 0) {
		alert('Click Me!');
		$('.scoo_steam_container').hide();
	}
	setInterval(update_frame, 1000);
	setInterval(save_game, 5000);
	setInterval(update, 100);
	$('.clear').click(function () {
		clear_game();
	});
	$('.stats').click(function () {
		alert('Scoo has earned ' + scoo.total_points + ' points', true);
		alert('Scoo has unlocked ' + scoo.upgrades.length + ' upgrades', true);
		var d = new Date();
		var diff = (d - new Date(scoo.start_time) ) / 1000 / 60 / 60;
		alert('You have played for ' + (diff).toFixed(3) + ' hours', true);
	});
	$('body').on('click', '.tooltip', function () {
		alert_dismiss();
	});
	$('.scoo').click(function () {
		click();
		ga._trackEvent('Scoo', 'Click');
		return false;
	});
	$('body').on('click', '.upgrade', function () {
		var id = Number($(this).attr('x-id'));
		upgrade_click( id );
		ga._trackEvent('Scoo', 'Upgrade', 'Unlock', id);
		return false;
	});
});

function update_frame() {
	if (is_stickied) return false;

	scoo.frame++;
	if (scoo.frame > 1) scoo.frame = 0;
	if (scoo.steam + scoo.points_increment >= scoo.steam_cap) {
		scoo.frame = 8;
	}
	$('.scoo').attr('x-frame', scoo.frame);


	for (var i = (scoo.achievements.length > 4)? scoo.achievements.length - 4 : 0; i < scoo.achievements.length; i++) {
		if ($('.achievement[x-num="' + i + '"]').length === 0) {
			var elem = $('<div />', {
				'class': 'achievement',
				'x-num': i,
				text: scoo.achievements[i]
			});
			$('.achievements_container').append(elem);
			if ( $('.achievement').length > 4) $('.achievement').eq(0).remove();
			elem.hide().fadeIn(1000);
		}
	}

	if (scoo.total_points > 1) {	
		var shown_count = $('.upgrade').length;
		if (shown_count < scoo.upgrades_to_show) {
			for (var i = 0; i < upgrades.length; i++) {
				if (scoo.upgrades.indexOf(i) === -1 && $('.upgrade[x-id="' + i + '"]').length === 0) {
					var elem = $('<div />', {
						'class': 'upgrade',
						'x-id': i,
						'x-cost': upgrades[i].cost,
						'title': upgrades[i].tooltip,
						html: upgrades[i].name +
						'<div class="cost">Costs ' + upgrades[i].cost + '</div><div class="progress"></div>'
					});

					$('.upgrades_container').append(elem);
					elem.hide().fadeIn(500);
					shown_count++;
					if (shown_count >= scoo.upgrades_to_show) {
						break;
					}
				}			
			}
		}
	}

	$('.scoo_steam_middle').css('width', scoo.multiplier_width + '%');
}
function update() {
	if (is_stickied) return false;
	
	if (scoo.steam > 0 && scoo.total_points > 0) {
		scoo.steam -= scoo.steam_increment / 10;
		if (scoo.steam < 0) scoo.steam = 0;
		var percent = scoo.steam / scoo.steam_cap / 0.01;
		if (percent > 100) {
			percent = 100;
		}
		if (percent > 50 - (scoo.multiplier_width / 2) && percent < 50 + (scoo.multiplier_width / 2)) {
			steam_multiplier = 1 + scoo.multiplier_bonus;
			if (!scoo.is_showing_multiplier) {
				$('.steam_multiplier').show();
				scoo.is_showing_multiplier = true;
				alert('This is the multiplier box.', true);
				alert('Getting Scoo\'s capacity bar within the box gives a bonus.', true);
			}
		} else {
			steam_multiplier = 1;
		}
		if (percent > 90) {
			steam_multiplier = 0;
		}
		if (!scoo.is_showing_multiplier) {
			$('.steam_multiplier').hide();
		}
		$('.scoo_steam').attr('x-percent', percent).css('width', (100 - percent) + '%');
		$('.scoo_steam_container').show();
		if (scoo.achievements.indexOf('Discovered Capacity') == -1) {
			alert('The red bar is Capacity.', true);
			alert(' It heats up over time, preventing Scoo from getting points.', true);
			scoo.achievements.push('Discovered Capacity');
			return;
		}
		$('.steam_current')[0].textContent = Math.floor(scoo.steam);
		$('.steam_cap')[0].textContent = Math.floor(scoo.steam_cap);
		if (scoo.is_showing_multiplier) $('.steam_multiplier')[0].textContent = steam_multiplier + 'x';
	}

	if (scoo.points > 0) {
		$('.upgrades_container').css('opacity', 1);
		$('.point_counter')[0].textContent = scoo.points + ((scoo.points == 1)? ' point' : ' points');
	}

	$('.upgrade').each(function () {
		var cost = $(this).attr('x-cost');
		var percent = (scoo.points / cost / 0.01);
		if (percent > 100) percent = 100;
		$(this).attr('x-afford', (percent >= 100)).find('.progress').css('width', percent + '%');
	});
}
function upgrade_click(id) {
	if (is_stickied) return false;

	var up = upgrades[id];
	console.log('up', up);
	if (!up) return alert('Can\'t find upgrade');
	if (up.cost > scoo.points) return alert('Not enough points');
	scoo.points -= up.cost;
	$('.upgrade[x-id="' + id + '"]').slideUp(function () {
		$(this).remove();
	});
	if (up.achievement) {
		scoo.achievements.push( up.achievement );
	} else {
		scoo.achievements.push( 'Bought ' + up.name);
	}
	if (up.click_bonus) {
		scoo.points_increment += up.click_bonus;
	}
	if (up.capacity_bonus) {
		scoo.steam_cap += up.capacity_bonus;
	}
	if (up.capacity_rate_bonus) {
		scoo.steam_increment += up.capacity_rate_bonus;
	}
	if (up.upgrade_bonus) {
		scoo.upgrades_to_show += up.upgrade_bonus;
	}
	if (up.upgrade_multi_bar) {
		scoo.multiplier_width += up.upgrade_multi_bar;
	}
	if (up.upgrade_multi_bonus) {
		scoo.multiplier_bonus += up.upgrade_multi_bonus;
	}
	if (up.is_win) {
		var d = new Date();
		var diff = (d - new Date(scoo.start_time) ) / 1000 / 60 / 60;
		alert('Congratulations! You win.', true);
		alert('You earned a total of ' + scoo.total_points + ' points', true);
		alert('It took you ' + (diff).toFixed(3) + ' hours to win', true);
		alert('If you enjoyed Scoo please share it so I can make similar games.', true);

	} else {
		alert('Bought ' + up.name);
	}

	scoo.upgrades.push( Number(id) );
	save_game();
	
}
function click() {
	if (is_stickied) return false;

	scoo.points += steam_multiplier * scoo.points_increment;
	scoo.total_points += steam_multiplier * scoo.points_increment;
	scoo.steam += (Math.random() * (scoo.points_increment / 2)) + 0.25;

	var elem = $('<div />', {
		'class': 'point',
		'x-amount': scoo.points_increment,
		text: '+' + (steam_multiplier * scoo.points_increment)
	});
	var steam_percent = scoo.steam / scoo.steam_cap;
	if (steam_percent < .25) elem.css('color', bar_colors[0]); 
	else if (steam_percent < .5) elem.css('color', bar_colors[1]); 
	else if (steam_percent < .75) elem.css('color', bar_colors[2]); 
	$('.scoo_container').append(elem);
	elem.animate({ top: '-50px', opacity: 0.5 }, 1000, function () {
		$(this).remove();
	});
	if (!is_stickied) alert_dismiss();
	if (scoo.steam >= scoo.steam_cap) {
		scoo.steam = scoo.steam_cap;
	}
	if (scoo.steam + scoo.points_increment >= scoo.steam_cap) {
		$('.scoo').attr('x-frame', 8);
	}
}
function alert(msg, is_sticky) {
	if (is_sticky) {
		if (is_stickied) {
			alert_queue.push(msg);
			return false;
		}
		is_stickied = true;
	} else {
		alert_dismiss(1);
	}
	var elem = $('<div />', {
		'class': 'tooltip',
		text: msg,
		is_sticky: is_sticky
	});
	$('.scoo_container').prepend(elem);
	if (is_sticky) {
		elem.slideUp(0).hide();
		elem.fadeIn(500).slideDown(1000);
	}
	return false;
}
function alert_dismiss(speed) {
	if (!speed) speed = 500;
	$('.tooltip').slideUp(speed, function () {
		$(this).remove();
	});
	is_stickied = false;
	if (alert_queue.length > 0) {
		alert(alert_queue.splice(0, 1), true);
	}
}
function save_game() {
	localStorage.setItem('scoo', btoa( JSON.stringify(scoo) ));
}
function clear_game() {
	localStorage.setItem('scoo', null);
	window.location.reload(true);
}
function load_game() {
	var retrievedObject = localStorage.getItem('scoo');
	if (retrievedObject) {
		try {
			scoo = JSON.parse( atob( retrievedObject ) );
		} catch(e) {
			console.log(e);
		}
	}
}

})();