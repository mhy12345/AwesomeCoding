<template>
	<el-dialog title="预览" :visible.sync="visible">
		<ChoiceProblem v-if='info.type == 0' :default_code='info.code'/>
		<ProgramProblem v-if='info.type == 1' :default_code='info.code'/>
	</el-dialog>
</template>

<script>
import ChoiceProblem from '../render/ChoiceProblem.vue';
import ProgramProblem from '../render/ProgramProblem.vue';

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
		ChoiceProblem: ChoiceProblem,
		ProgramProblem: ProgramProblem
	},
};
</script>
