(() => {
	window.onload = function() {
		let ctx = document.getElementById('player');
		let uid = ctx.getAttribute('uid');
		let vid = ctx.getAttribute('vid');
		let cfg = {
			uid: uid,
			vid: vid,
			height: 500,
			width: 800,
		};
		console.log(">>>",cfg);
		player = polyvObject('#player').
			livePlayer(cfg);
	}
	setTimeout(() => { 
		console.log('???',document.getElementById('player').hidden);
	}, 10000 )
})();
