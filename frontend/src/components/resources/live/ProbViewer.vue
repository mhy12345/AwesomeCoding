<template>
	<div>
		<div v-if='info.code !== null'>
			<ChoiceProblem ref='ctx' v-if='info.type === 0' :default_code='info.code'/>
			<ProgramProblem ref='ctx' v-if='info.type === 1' :default_code='info.code'/>
		</div>
		<div v-else>
			还没有习题哦
		</div>
	</div>
</template>

<script>
import ChoiceProblem from '../render/ChoiceProblem.vue';
import ProgramProblem from '../render/ProgramProblem.vue';

export default {
	data: function() {
		return {
			info: {
				type: null,
				code: null,
			}
		};
	},
	methods: {
		update(info) {
			if (info === null) {
				this.info = {type:null, code:null};
			} else {
				this.info = info;
			}
			this.$nextTick(()=>{
				this.$refs.ctx.handleUpdate(info.code);
			});
		}
	},
	components: {
		ChoiceProblem: ChoiceProblem,
		ProgramProblem: ProgramProblem
	},
};
</script>
