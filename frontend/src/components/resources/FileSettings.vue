<template>
    <el-container>
        <el-main>
            <el-row>
            <el-button @click="handlePageAdd()"> 添加 </el-button>
            <el-button @click="handlePageDelete()"> 删除 </el-button>
            </el-row>
            <el-table :data="tableData" style="width: 100%">
            <el-table-column prop="showFilename" label="文件名" width="180"></el-table-column>
            <el-table-column align="center" label="操作">
                <template slot-scope="scope">
                    <el-button icon="el-icon-check" circle
                               v-if="page===true"
                           @click="handleAdd(scope.row)">
                    </el-button>
                    <el-button icon="el-icon-delete" circle
                               v-else="page=false"
                               @click="handleDelete(scope.row)">
                    </el-button>
                    <el-button icon="el-icon-view" circle
                               @click="handleView(scope.row)">
                    </el-button>
                </template>
            </el-table-column>
            </el-table>
        </el-main>
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
            },
            page: true
        };
    },
    mounted: function () {
        this.class_id = this.$route.params.class_id;
        this.inputData.classId = this.class_id;

        this.loadTableData(true);
    },
    methods: {
        loadTableData: function (page) {
            this.$http.post('/api/file/fetch', {}).
                 then(function (lres) {
                     this.$http.post('/api/file/fetch_coursefiles', {classid: this.class_id,}).
                          then(function (fres) {
                              this.page = page;
                              this.tableData = [];
                              for (let i = 0; i < lres.body.results.length; i++) {
                                  let tag = 0;
                                  for (let j = 0; j < fres.body.results.length; j++) {
                                      if (fres.body.results[j].file_id === lres.body.results[i].id) {
                                          tag = 1;
                                          break;
                                      }
                                  }
                                  if (tag === 0 && page === true) {
                                      this.tableData.push(lres.body.results[i]);
                                  } else if (tag === 1 && page === false) {
                                      this.tableData.push(lres.body.results[i]);
                                  }
                              }
                              for (let i = 0; i < this.tableData.length; i++) {
                                  this.tableData[i].showFilename = this.tableData[i].filename.slice(32);
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
                     this.loadTableData(true);
                 });
        },
        handleDelete: function (row) {
            this.$http.post('/api/file/delete_from_course', {
                classid: this.inputData.classId,
                fileid: row.id,
            }).
                 then(function (res) {
                     console.log(res);
                     this.loadTableData(false);
                 });
        },

        handlePageAdd: function () {
            this.loadTableData(true);
        },

        handlePageDelete: function () {
            this.loadTableData(false);
        },

        handleView: function (row) {
            if (row.filename.indexOf("pdf") >= 0) {
                this.$socket.emit('alert', {
                    operation: 'CHANGE_PDF.',
                    pdfSrc: "/uploads/" + row.filename,
                    course_id: this.class_id,
					echo: true,
                });
            } else {
                alert("请选择pdf文件");
            }
        }
    }
};
</script>

