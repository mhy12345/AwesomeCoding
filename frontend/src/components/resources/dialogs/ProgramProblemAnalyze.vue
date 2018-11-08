<template>
	<div style='min-height:300px'>
		<div>
			{{text}}
		</div>
		<el-dropdown @command='handleItemClick'>
			<span class="el-dropdown-link">
				浏览学生<i class="el-icon-arrow-down el-icon--right"></i>
			</span>
			<el-dropdown-menu slot="dropdown">
				<el-dropdown-item 
					v-for='item in data'
					:command='item.code'
					>{{item.realname}}</el-dropdown-item>
			</el-dropdown-menu>
		</el-dropdown>
		<ProgramProblemRender ref='render'/>
	</div>
</template>

<script>
import ProgramProblemRender from '../render/ProgramProblem.vue';
export default {
	data: function() {
		return {
			text: "",
			data: []
		}
	},
	props: ['code'],
	methods: {
		handleItemClick: function(cmd) {
			console.log(cmd);
			this.$refs.render.handleLocate(cmd);
		}
	},
	mounted: function () {
		this.$http.post('/api/problem/program_problem/gather',{code: this.code}).
			then((res) => {
				this.data = res.body.results;
				console.log(this.data);
			}).
			catch((res) => {
				console.log(res);
			});
	},
	components: {
		ProgramProblemRender: ProgramProblemRender
	}
}
</script>
