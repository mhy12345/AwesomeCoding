<template>
	<div>
		<h3> {{title}} </h3>
		<el-table :data="tableData" stripe style="width: 100%"     @current-change="handleCurrentChange" >
			<el-table-column prop="id" label="#"> </el-table-column>
			<el-table-column prop="title" label="名称"> </el-table-column>
		</el-table>
	</div>
</template>

<script>
    /* eslint-disable camelcase */

    import {supported_resources} from '@/utils/CourseLists';

export default {
	data () {
		return {
			tableData : [],
			title : ' '
		};
	},
	props : ['idx'],
	mounted : function () {
		this.title = supported_resources[this.idx].title;
		this.$http.post(supported_resources[this.idx].url + '/fetch',{page_number : 1, page_size : 20}).
			then(function (res) {
				console.log(res.body);
				this.tableData = res.body.results;
			}).
			catch(function (res) {
				this.$message(res);
			});
	},
	methods : {
		handleCurrentChange : function (item) {
			this.$router.push(
				{name: 'class',params: {class_id : item.id}});
		}
	}
};
</script>

<style scoped>
h3 {
	margin-top:0px;
}
</style>
