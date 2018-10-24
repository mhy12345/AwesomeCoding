<template>
    <el-table :data="tableData" stripe style="width: 100%"     @current-change="handleCurrentChange" >
        <el-table-column prop="filename" label="文件名" width="180"> </el-table-column>
        <el-table-column align="center" label="操作">
            <template slot-scope="scope">
                <el-button type="danger"
                           icon="el-icon-delete" circle
                           @click="handleDelete(scope.row)">
                </el-button>
            </template>
        </el-table-column>
    </el-table>
</template>

<script>
    export default {
        data () {
            return {tableData : []};
        },
        mounted : function () {
            this.class_id = this.$route.params.class_id;
            this.$http.post('/api/file/fetch',{})
            .then(function (res) {
                //console.log(res.body.results);
                this.tableData = res.body.results;
            });
        },
        methods : {
            handleCurrentChange : function (item) {
                //下载
                this.$router.push(
                    {name: 'file',params: {file_id : item.id}});
            },
            handleDelete : function (row) { // 向后端数据库发出删除数据的请求
                var id;
                id = row.id;
                this.$http.post('/api/file/add', {file_id : row.id})
                .then(function (res) {
                    //how to save it?
                    this.tableData = res.body.results;
                });
            }
        }
    };
</script>
