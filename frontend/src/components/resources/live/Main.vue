<template>
	<div>
		<div v-bind:class="{ fly: fly }">
			<el-row :gutter="40">
				<el-col :span='15'>
					<div style='min-height:500px'>
						<keep-alive>
							<components ref='big' v-bind:is='cp_player' @swap='handleSwap' @hidden='handleHidden'/>
						</keep-alive>
					</div>
					<chat-input></chat-input>
				</el-col>
				<el-col :span='9'>
					<sidebar :course_status="course_status"></sidebar>
				</el-col>
			</el-row>
		</div>
		<div style='width:350px;position:fixed;right:50px;bottom:50px;' v-show='showWidget'>
			<keep-alive>
				<components ref='small' v-bind:is='cp_fileviewer' @swap='handleSwap' @hidden='handleHidden'/>
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
	props: ['course_status', 'fly'],
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
		handleSwap: function() {
			let t = this.cp_fileviewer;
			this.cp_fileviewer = this.cp_player;
			this.cp_player = t;
			this.$nextTick(() => {
				this.$message("RELOAD");
				console.log(this.$refs);
				this.$refs.small.reload();
				this.$refs.big.reload();
			});
			console.log(this);
		},
		handleHidden: function() {
			this.showWidget = !this.showWidget;
		}
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

