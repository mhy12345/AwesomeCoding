<template>
    <el-table :data="tableData" stripe style="width: 100%">
        <el-table-column prop="showFilename" label="文件名" width="180"></el-table-column>
        <el-table-column align="center" label="操作">
            <template slot-scope="scope">
                <el-button icon="el-icon-download" circle
                           @click="handleDownload(scope.row)">
                </el-button>
            </template>
        </el-table-column>
    </el-table>
</template>


<script>
    export default {
        data () {
            return {
                tableData: [],
                teacher: undefined,
                inputData: {
                    userId: undefined,
                    classId: undefined,
                }
            };
        },
        mounted: function () {
            this.class_id = this.$route.params.class_id;
            this.inputData.classId = this.class_id;

            this.$http.post('/api/file/fetch_coursefiles', {classid: this.inputData.classId,}).
                 then(function (res) {
                     this.tableData = res.body.results;
                     for (let i = 0; i < this.tableData.length; i++) {
                         this.tableData[i].showFilename = this.tableData[i].filename.split(" ")[2];
                     }
                 });
        },
        methods:
            {
                handleDownload: function (row) {
                    let a = document.createElement('a');
                    a.content = "text/html;charset=utf-8";
                    a.href = '/api/file/download?filename=' + row.filename;
                    a.click();
                },
            }
    };
</script>




