<template>
    <div class="block">
        <el-carousel height="300px">
            <el-carousel-item v-for="(currentimgpath, idx) in imgpath">
                <h3 v-if="currentimgpath === ''">
                    {{ itemtitle[idx] }}
                </h3>
                <h3 v-else>
                    {{ idx }}
                </h3>
            </el-carousel-item>
        </el-carousel>
    </div>
</template>

<script>
    /* eslint-disable camelcase */

    import {supported_resources} from '../utils/CourseLists';

    export default {
        name: 'Home',
        data() {
            return{
                itemtitle: ['中国历史', '世界历史', '软件工程', '编译原理', 'e', 'f'],
                imgpath: ['', '', '', '', '', ''],
                items: ['a', 'b', 'c', 'd', 'e', 'f'],
                tableData: [],
                title: ' ',
                isTeacher: false,
                idx: 'publicCourses'
            };
        },
        mounted: function () {
            this.title = supported_resources[this.idx].title;
            this.$http.post(supported_resources[this.idx].url + '/fetch', {page_number: 1, page_size: 20}).
                 then(function (res) {
                     console.log(res.body);
                     this.tableData = res.body.results;
                     if (this.tableData.length > 0 && this.tableData[0].lvid) {
                         this.isTeacher = true;
                     }
                 }).
                 catch(function (res) {
                     this.$message(res);
                 });
        },
        methods: {
        },
        components: {}
    };
</script>

<style>
    .el-carousel__item h3 {
        color: #475669;
        font-size: 52px;
        margin: 0 auto;
        line-height: 300px;
        text-align: center;
    }

    .el-carousel__item:nth-child(2n) {
        /*
        background-color: #99a9bf;
        */
        background-color: #99a9bf;
    }

    .el-carousel__item:nth-child(2n+1) {
        background-color: #d3dce6;
    }
</style>
