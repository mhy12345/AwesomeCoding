<template>
    <el-table :data="tableData" stripe style="width: 100%" >
        <el-table-column prop="filename" label="文件名" width="180"> </el-table-column>
    </el-table>
</template>


<script>
    export default {
        data () {
            return {tableData : [],
                teacher: undefined,
                inputData: {
                    userId: undefined,
                    classId: undefined,
                }
            };
        },
        mounted : function () {
            this.class_id = this.$route.params.class_id;
            this.inputData.classId = this.class_id;

            this.$http.post('/api/file/fetch_coursefiles', {
                classid: this.inputData.classId,
            })
            .then(function (res) {
                this.tableData = res.body.results;
            });
        },
    };
</script>




