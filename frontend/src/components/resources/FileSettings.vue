<template>
    <el-container>
    <el-table :data="tableData" stripe style="width: 100%">
        <el-table-column prop="showFilename" label="文件名" width="180"></el-table-column>
        <el-table-column align="center" label="操作">
            <template slot-scope="scope">
                <el-button icon="el-icon-check" circle
                           @click="handleAdd(scope.row)">
                </el-button>
                <!--<el-button v-else = "scope.row.type = 'inserted'" icon="el-icon-delete" circle-->
                           <!--@click="handleAdd(scope.row)">-->
                <!--</el-button>-->
            </template>
        </el-table-column>
    </el-table>
    </el-container>
</template>

<script>
    export default {
        data () {
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

            this.loadTableData();
        },
        methods: {
            loadTableData () {
                this.$http.post('/api/file/fetch', {}).
                     then(function (lres) {
                         this.$http.post('/api/file/fetch_coursefiles', {classid: this.class_id,}).
                              then(function (fres) {
                                  this.tableData = lres.body.results;
                                  for (let i = 0; i < lres.body.results.length; i++) {
                                      let tag = 0;
                                      for (let j = 0; j < fres.body.results.length; j++) {
                                          if (fres.body.results[j].file_id === lres.body.results[i].id) {
                                              tag = 1;
                                              break;
                                          }
                                      }
                                      if (tag === 0) { //to be added
                                          this.tableData[i].type = "remained";
                                      } else {
                                          this.tableData[i].type = "inserted";
                                      }
                                  }
                                  for (let i = 0; i < this.tableData.length; i++) {
                                      this.tableData[i].showFilename = this.tableData[i].filename.split(" ")[2];
                                  }
                              });
                     });
            },
            handleAdd: function (row) {
                this.$http.post('/api/file/add_to_course', {
                    classid: this.inputData.classId,
                    fileid: row.id,
                    filename: row.filename,
                }).
                     then(function (res) {
                         console.log(res);
                         this.loadTableData();
                     });
            }
        }
    };
</script>

