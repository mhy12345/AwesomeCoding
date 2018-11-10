<template>
    <el-table :data="tableData" stripe style="width: 100%">
        <el-table-column prop="filename" label="文件名" width="180"></el-table-column>
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
        data() {
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
                 });
        },
        methods:
            {
                handleDownload: function (row) {
					console.log("START DL",row.filename);
                    this.$http.get('/api/file/download?filename='+row.filename).
                         then(function (res) {
                             const blob = new Blob([res.data]);
                             if (window.navigator.msSaveOrOpenBlob) {
                                 // 兼容IE10
                                 navigator.msSaveBlob(blob, this.filename);
                             } else {
                                 //  chrome/firefox
                                 let aTag = document.createElement('a');
                                 aTag.download = row.filename;
                                 aTag.href = URL.createObjectURL(blob);
                                 aTag.click();
                                 URL.revokeObjectURL(aTag.href);
                             }
                         });
                }
            }
    };
</script>




