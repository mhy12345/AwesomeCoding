<template>
    <div>
        <h3> {{title}} </h3>
        <el-table v-if = "isTeacher" :data="tableData" stripe style="width: 100%" @current-change="handleCurrentChange">
            <el-table-column prop="id" label="#"></el-table-column>
            <el-table-column prop="title" label="名称"></el-table-column>
            <el-table-column prop="lvid" label="直播号"></el-table-column>
       </el-table>
        <el-table v-else :data="tableData" stripe style="width: 100%" @current-change="handleCurrentChange">
            <el-table-column prop="id" label="#"></el-table-column>
            <el-table-column prop="title" label="名称"></el-table-column>
        </el-table>
    </div>
</template>

<script>
    /* eslint-disable camelcase */

    import {supported_resources} from '../../utils/CourseLists';

    export default {
        data () {
            return {
                tableData: [],
                title: ' ',
                isTeacher: false
            };
        },
        props: ['idx'],
        mounted: function () {
            this.title = supported_resources[this.idx].title;
            this.$http.post(supported_resources[this.idx].url + '/fetch', {page_number: 1, page_size: 20}).
                 then(function (res) {
                     this.tableData = res.body.results;
                     if (this.tableData.length > 0 && this.tableData[0].lvid) {
                         this.isTeacher = true;
                     }
                 }).
                 catch(function (res) {
					 if (res.body === 'USER_NOT_LOGIN.') {
					 } else { 
						 this.$message(JSON.stringify(res));
					 }
				 });
		},
		methods: {
			handleCurrentChange: function (item) {
				this.$router.push(
					{name: 'class', params: {class_id: item.id}});
			}
		}
	};
</script>

<style scoped>
h3 {
	margin-top: 0px;
}
</style>
