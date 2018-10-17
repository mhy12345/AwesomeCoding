<template>

	<div id="player"></div>

</template>

<script>
import polyvObject from '@/../static/liveplayer.js'
//var polyvObject = Object();

export default {
	props: {
		'size': [Number, Number],
		'vid': String,
		'uid': String
	},
	mounted: function() {
		// eslint-disable-next-line
		var player = polyvObject('#player').livePlayer({
            width: this.size[0],
            height: this.size[1],
            uid : this.uid,
            vid : this.vid
		});
	}
}
</script>

<style scoped>

</style>
