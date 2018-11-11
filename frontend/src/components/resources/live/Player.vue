<template>
	<div id='player_box' ref='player_box'>
		<div id="player"></div>
	</div>
</template>

<script>
import axios from 'axios';
export default {
	data () {
		return {
			src: undefined,
			class_id: undefined,
			active_name: undefined,
			player_config: {
				width: 800,
				height: 400,
				uid: '',
				vid: ''
			},
		};
	},
	methods: {
		reload: function () {
			let nowpath = '/api/class/liveid/query';
			axios.
				post(nowpath, {class_id: this.class_id}).
				then((res) => {
					this.player_config.uid = res.data.liveplayer_uid;
					this.player_config.vid = res.data.liveplayer_vid;
					this.player_config.width = this.$refs.player_box.offsetWidth;
					this.player_config.height = this.$refs.player_box.offsetWidth * 0.6;
					this.src = '/backend/render/live?uid='+this.player_config.uid+'&vid='+this.player_config.vid;
					let player = polyvObject('#player').  livePlayer(this.player_config);
				});
		}
	},
	mounted: function () {
		this.class_id = this.$route.params.class_id;
		this.reload();
	},
};
</script>
