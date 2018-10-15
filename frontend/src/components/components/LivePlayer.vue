<template>

	<div id="player"></div>

</template>

<script>
import polyvObject from 'polyvObject'

export default {
	mounted: function() {
		// eslint-disable-next-line
		var player = polyvObject('#player').livePlayer({
			'width':'498',
			'height':'409',
			'uid':'047a911d83',
			'vid':'242576'
		});
	}
}
</script>

<style scoped>

</style>
