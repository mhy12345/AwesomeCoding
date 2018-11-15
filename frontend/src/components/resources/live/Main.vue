<template>
	<div>
		<div v-bind:class="{ fly: fly }">
			<el-row :gutter="40">
				<el-col :span='15'>
                    <!--正中直播窗口-->
					<div style='min-height:500px'>
						<keep-alive>
							<components ref='big' :is='cp_player' @swap='handleSwap' @hidden='handleHidden'></components>
						</keep-alive>
					</div>
                    <!--下方输入框-->
					<chat-input></chat-input>
				</el-col>
                <!--右侧边栏-->
				<el-col :span='9'>
                    <sidebar class="right-sidebar" :course_status="course_status" :user="user"></sidebar>
				</el-col>
			</el-row>
		</div>
        <!--右下角ppt窗口-->
		<div style='width:350px;position:fixed;right:50px;bottom:50px;' v-show='showWidget'>
			<keep-alive>
				<components ref='small' :is='cp_fileviewer' @swap='handleSwap' @hidden='handleHidden'></components>
			</keep-alive>
		</div>
	</div>
</template>


<script>
import Player from './Player';
import Sidebar from './Sidebar';
import ChatInput from './ChatInput';
import FileViewer from '@/components/components/FileViewer.vue';

export default {
	name: 'Live',
    props: ['course_status', 'fly', 'user'],
	data() {
		return {
			showWidget: true,
			cp_fileviewer: FileViewer,
			cp_player: Player,
		};
	},
	components: {
		Sidebar,
		ChatInput,
		Player,
		FileViewer
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

