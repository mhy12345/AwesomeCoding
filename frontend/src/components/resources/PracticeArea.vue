<template>
	<div>
		<div v-for='info in problemData'>
			<ChoiceProblem v-if='info && info.type == 0' :code='info.code'/>
		</div>
	</div>
</template>

<script>
import ChoiceProblem from '@/components/resources/render/ChoiceProblem.vue';
export default {
	data: function() {
		return {
			problemData: [],
			class_id: this.$route.params.class_id,
		};
	},
	props: ['course_status'],
	mounted: function() {
		this.$http.post('/api/problem/list',{class_id: this.class_id}).
			then(function(res) {
				this.problemData = res.body.results;
				this.problemData.forEach(function (item, index) {
					item.index = index+1; 
					if (item.type == 0) item.type_title = '选择题';
				});
			}).
			catch(function(err) {
				this.$message(err);
			});
	},
	components: {
		ChoiceProblem: ChoiceProblem
	},
};
</script>

<style>
</style>
