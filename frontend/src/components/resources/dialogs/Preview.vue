<template>
	<el-dialog title="预览" :visible.sync="visible">
		<ChoiceProblem v-if='info.type == 0' :code='info.code'/>
	</el-dialog>
</template>

<script>
import ChoiceProblem from '../render/ChoiceProblem.vue';

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
		ChoiceProblem: ChoiceProblem
	},
};
</script>
