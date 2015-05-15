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
	start_time: new Date()
};
var upgrades = [
	{
		name: 'Clicker Lv1',
		cost: 10,
		click_bonus: 1,
		achievement: 'First upgrade unlocked',
	},
	{
		name: 'Upgrade Amount Lv1',
		cost: 10,
		upgrade_bonus: 1,
	},
	{
		name: 'Capacity Lv1',
		cost: 10,
		capacity_bonus: 1
	},
	{
		name: 'Capacity Rate Lv1',
		cost: 30,
		capacity_rate_bonus: 0.25
	},
	{
		name: 'Clicker Lv2',
		cost: 25,
		click_bonus: 1
	},
	{
		name: 'Clicker Lv3',
		cost: 50,
		click_bonus: 1
	},
		{
		name: 'Capacity Lv2',
		cost: 50,
		capacity_bonus: 1
	},
	{
		name: 'Capacity Rate Lv2',
		cost: 60,
		capacity_rate_bonus: 0.25
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
		capacity_bonus: 1
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
		name: 'Clicker Lv6',
		cost: 200,
		click_bonus: 1
	},
		{
		name: 'Capacity Lv4',
		cost: 250,
		capacity_bonus: 1
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
		name: 'Capacity Lv5',
		cost: 300,
		capacity_bonus: 1
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
		name: 'Clicker Lv9',
		cost: 600,
		click_bonus: 1
	},
		{
		name: 'Capacity Lv6',
		cost: 500,
		capacity_bonus: 1
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
$(function () {
	load_game();
	if (scoo.total_points === 0) {
		alert('Click Me!');
	}
	setInterval(update_frame, 1000);
	setInterval(save_game, 5000);
	setInterval(update, 100);
	$('.clear').click(function () {
		clear_game();
	});
	$('.scoo').click(function () {
		click();
		return false;
	});
	$('body').on('click', '.upgrade', function () {
		upgrade_click( $(this).attr('x-id') );
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
}
function update() {
	if (is_stickied) return false;
	
	if (scoo.steam > 0) {
		scoo.steam -= scoo.steam_increment / 10;

		var percent = scoo.steam / scoo.steam_cap / 0.01;
		if (percent > 100) percent = 100;
		if (percent > 25 && percent < 75) {
			steam_multiplier = 2;
		} else {
			steam_multiplier = 1;
		}
		$('.scoo_steam').attr('x-percent', percent).css('width', percent + '%');

		$('.scoo_steam_container').show();
		if (scoo.achievements.indexOf('Discovered Capacity') == -1) {
			alert('The red bar is Capacity.', true);
			setTimeout(function () {
				alert(' It heats up over time, preventing Scoo from getting points.', true);
			}, 4000);
			setTimeout(function () {
				alert_dismiss();
			}, 9000);
			scoo.achievements.push('Discovered Capacity');
			return;
		}
		$('.steam_current')[0].textContent = Math.floor(scoo.steam);
		$('.steam_cap')[0].textContent = Math.floor(scoo.steam_cap);
		$('.steam_multiplier')[0].textContent = steam_multiplier + 'x';
	} else {
		$('.scoo_steam_container').hide();
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
	if (up.is_win) {
		is_stickied = true;
		var d = new Date();
		alert('Congratulations! You win.');
		setTimeout(function () {
			alert('You earned a total of ' + scoo.total_points + ' points');
		}, 3000);
		setTimeout(function () {
			var diff = (d - scoo.start_time) / 1000 / 60 / 60;
			alert('It took you ' + (diff).toFixed(3) + ' hours to win');
		}, 6000);
		setTimeout(function () {
			alert('If you enjoyed Scoo please share it so I can make similar games.');
		}, 9000);
		setTimeout(function () {
			alert_dismiss();
		}, 12000);
	} else {
		alert('Bought ' + up.name);
	}

	scoo.upgrades.push( Number(id) );
	save_game();
	
}
function click() {
	if (is_stickied) return false;
	if (scoo.steam + (scoo.points_increment / 2) > scoo.steam_cap) return;

	scoo.points += steam_multiplier * scoo.points_increment;
	scoo.total_points += steam_multiplier * scoo.points_increment;
	scoo.steam += (Math.random() * (scoo.points_increment / 2)) + 0.25;

	var elem = $('<div />', {
		'class': 'point',
		'x-amount': scoo.points_increment,
		text: '+' + (steam_multiplier * scoo.points_increment)
	});
	$('.scoo_container').append(elem);
	elem.animate({ top: '-50px', opacity: 0.5 }, function () {
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
	alert_dismiss(1);
	if (is_sticky) {
		is_stickied = true;
	}
	var elem = $('<div />', {
		'class': 'tooltip',
		text: msg
	});
	$('.scoo_container').prepend(elem);
	return false;
}
function alert_dismiss(speed) {
	if (!speed) speed = 500;
	$('.tooltip').slideUp(speed, function () {
		$(this).remove();
	});
	is_stickied = false;
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