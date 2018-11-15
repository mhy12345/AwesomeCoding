<template>
    <el-table :data="tableData" stripe style="width: 100%" @current-change="handleCurrentChange">
        <el-table-column prop="showFilename" label="文件名" width="180"></el-table-column>
    </el-table>
</template>

<script>
    /* eslint-disable camelcase */

    export default {
        data () {
            return {tableData: []};
        },
        mounted: function () {
            this.$http.post('/api/file/fetch', {}).
                 then(function (res) {
                     console.log(res.body.results);
                     this.tableData = res.body.results;
                     for (let i = 0; i < this.tableData.length; i++) {
                         this.tableData[i].showFilename = this.tableData[i].filename.split(" ")[2];
                     }
                 });
        },
        methods: {
            handleCurrentChange: function (item) {
                this.$router.push({name: 'file', params: {file_id: item.id}});
            }
        }
    };
</script>
