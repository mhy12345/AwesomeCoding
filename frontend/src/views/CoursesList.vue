<template>
 <el-table :data="tableData" stripe style="width: 100%"     @current-change="handleCurrentChange" >
    <el-table-column prop="id" label="#" width="180"> </el-table-column>
    <el-table-column prop="title" label="名称" width="180"> </el-table-column>
  </el-table>
</template>

<script>
export default {
	data() {
		return {
			tableData : []
		}
	},
	mounted : function() {
		this.$http.post('/api/get_classes_list?m=0&n=100')
		.then(function(res) {
			console.log(res.body);
			this.tableData = res.body.results;
		})
	},
	methods : {
		handleCurrentChange : function(item) {
			this.$router.push(
			{name: 'class',params: {class_id : item.id} 
			});
		}
	}
}
</script>
