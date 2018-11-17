<template>
	<div style='width:100%'>
		<div v-bind:class="{ fly: fly }">
			<el-row :gutter="40">
				<el-col :span='15'>
                    <!--正中直播窗口-->
					<div style='min-height:500px'>
						<keep-alive>
							<components ref='big' :is='cp_player'></components>
						</keep-alive>
					</div>
                    <!--下方输入框-->
					<chat-input></chat-input>
				</el-col>
                <!--右侧边栏-->
				<el-col :span='9'>
                    <sidebar class="right-sidebar" :course_status="course_status.role" :user="user"></sidebar>
				</el-col>
			</el-row>
			<el-row type='flex' justify='center' :gutter='20'>
				<el-col :span='2'>
					<el-button type='mini' @click='handleSwap("live")'>直播 </el-button>
				</el-col>
				<el-col :span='2'>
					<el-button type='mini' @click='handleSwap("pdf")'>课件 </el-button>
				</el-col>
				<el-col :span='2'>
					<el-button type='mini' @click='handleSwap("problem")'>练习 </el-button>
				</el-col>
			</el-row>
		</div>
		<!--右下角ppt窗口-->
		<Popup v-show='showWidget'>
		<keep-alive>
			<components ref='small' :is='cp_fileviewer'></components>
		</keep-alive>
		</Popup>
	</div>
</template>


<script>
import Vue from 'vue';
import Player from './Player';
import Sidebar from './Sidebar';
import ChatInput from './ChatInput';
import Popup from './Popup';
import FileViewer from '@/components/components/FileViewer.vue';

Vue.component('sub-pdf', FileViewer);
Vue.component('sub-live', Player);

export default {
	name: 'Live',
	props: ['course_status', 'fly', 'user'],
	data() {
		return {
			showWidget: true,
			cp_fileviewer: 'sub-pdf',
			cp_player: 'sub-live',
		};
	},
	components: {
		Sidebar,
		ChatInput,
		//Player,
		//FileViewer,
		Popup
	},
	methods: {
		handleSwap: function () {
			let t = this.cp_fileviewer;
			this.cp_fileviewer = this.cp_player;
			this.cp_player = t;
			this.$nextTick(() => {
				this.$message("RELOAD");
				this.$refs.small.reload();
				this.$refs.big.reload();
			});
		},
		handleHidden: function () {
			this.showWidget = !this.showWidget;
		}
	}
};
</script>

<style scoped>
.fly {
	position: fixed;
	width: 83%;
	visibility: hidden;
}
.right-sidebar{
	float: right;
	/*position: relative;*/
	/*left: 30px;*/
	/*min-width: 5%;*/
	width: 100%;
	height: 100%;
	/*overflow: auto;*/
}
.spanner {
	min-height:600px;
}

</style>

