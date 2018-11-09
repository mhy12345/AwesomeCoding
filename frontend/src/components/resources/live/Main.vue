<template>
	<div>
		<!--<div class='spanner' ></div>-->
		<div v-bind:class="{ fly: fly }">
			<el-row :gutter="40">
				<el-col :style="{width: player_config.width + 'px'}">
					<!--<iframe v-show.visibe='bb' src='http://127.0.0.1:8080/backend/render/live?uid=047a911d83&vid=254084' height=500 width=800 />-->
					<!--<iframe id='haha' :src='src' width=800 height=500 />-->
					<!--<iframe src="https://scontent-arn2-1.cdninstagram.com/vp/000024fbc5bee26e867cee915e014c21/5BE6675D/t50.2886-16/43029322_156050115340209_4031842061334860489_n.mp4" width=800 height=500> </iframe>-->
					<div id="player"></div>
					<chat-input></chat-input>
				</el-col>

				<!--todo 右侧列表，尺寸逻辑还需要修改-->
				<el-col style="float: right; width: 35%; overflow: auto;">
					<sidebar :course_status="course_status"></sidebar>
				</el-col>
			</el-row>
		</div>
	</div>
</template>


<script>
import axios from 'axios';
//import root_url from '../../../../config/http_root_url.js';
import Sidebar from './Sidebar';
import ChatInput from './ChatInput';
var root_url = '';

export default {
	name: 'Live',
	props: ['course_status', 'fly'],
	data() {
		return {
			src: undefined,
			class_id: undefined,
			active_name: undefined,
			player_config: {
				width: 800,
				height: 500,
				uid: '',
				vid: ''
			},
		};
	},
	mounted: function () {
		console.log("CLASS <<", this.fly);
		//document.getElementById('player').addEvent
	},
	created: function () {
		console.log("CREATE PLAYER");
		var player = undefined;
		this.class_id = this.$route.params.class_id;

		let nowpath = root_url + '/api/class/liveid/query';
		axios.
			post(nowpath, { class_id: this.class_id }).
			then((res) => {
				console.log(res.data);

				this.player_config.uid = res.data.liveplayer_uid;
				this.player_config.vid = res.data.liveplayer_vid;
				this.src = '/backend/render/live?uid='+this.player_config.uid+'&vid='+this.player_config.vid;

				console.log("INIT WITH ",this.player_config);
				player = polyvObject('#player').  livePlayer(this.player_config);
			});
	},
	components: {
		Sidebar,
		ChatInput
	}
};
</script>

<style scoped>
.fly {
	position: fixed;
	visibility: 'hidden';
}
.right-sidebar{
	float: right;
	/*position: relative;*/
	/*left: 30px;*/
	/*min-width: 5%;*/
	width: 35%;
	overflow: auto;
}
.spanner {
	min-height:600px;
}
</style>

