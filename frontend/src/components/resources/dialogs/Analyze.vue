<template>
	<el-dialog title="数据分析" :visible.sync="visible">
		<ChoiceProblemAnalyze v-if='info.type === 0' :code='info.code'/>
		<ProgramProblemAnalyze v-if='info.type === 1' :code='info.code'/>
	</el-dialog>
</template>

<script>
import ChoiceProblemAnalyze from './ChoiceProblemAnalyze.vue';
import ProgramProblemAnalyze from './ProgramProblemAnalyze.vue';

export default {
	data: function() {
		return {
			visible: false,
			info: {
				type: null,
			}
		};
	},
	methods: {
		handleOpen(info) {
			this.visible = true;
			this.info = info;
		},
	},
	components: {
		ChoiceProblemAnalyze: ChoiceProblemAnalyze,
		ProgramProblemAnalyze: ProgramProblemAnalyze
	},
};
</script>
