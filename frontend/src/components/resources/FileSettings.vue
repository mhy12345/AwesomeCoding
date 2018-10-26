<template>
    <el-table :data="tableData" stripe style="width: 100%">
        <el-table-column prop="filename" label="文件名" width="180"></el-table-column>
        <el-table-column align="center" label="操作">
            <template slot-scope="scope">
                <el-button icon="el-icon-check" circle
                           @click="handleAdd(scope.row)">
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
                class_id: "undefined",
                inputData: {
                    userId: undefined,
                    classId: undefined,
                }
            };
        },
        mounted: function () {
            this.class_id = this.$route.params.class_id;
            this.inputData.classId = this.class_id;

            this.$http.get('/api/user/session', {}).
                 then(function (res) {
                     this.inputData.userId = res.body.user_id;
                     this.$http.post('/api/file/fetch', {}).
                          then(function (res) {
                              this.tableData = res.body.results;
                          });
                 });
        },
        methods: {
            handleAdd: function (row) {
                this.$http.post('/api/file/add', {
                    userid: this.inputData.userId,
                    classid: this.inputData.classId,
                    fileid: row.id,
                    filename: row.filename,
                }).
                     then(function (res) { //must modify
                         console.log(res);
                         this.$http.post('/api/file/fetch', {}).
                              then(function (lres) {
                                  this.tableData = lres.body.results;
                                  console.log("妙蛙");
                              });
                     });
            }
        }
    };
</script>

