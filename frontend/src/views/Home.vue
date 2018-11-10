<template>
    <div class="block">
        <el-carousel height="300px">
            <el-carousel-item v-for="(currentitem, idx) in items">
                <h3 v-if="currentitem.path === ''">
                    {{ currentitem.title }}
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
        data: function () {
            return {
                items: [],
                tableData: [],
                title: ' ',
                idx: 'publicCourses'
            };
        },
        name: 'Home',
        mounted: function () {
            this.title = supported_resources[this.idx].title;
            this.$http.post(supported_resources[this.idx].url + '/fetch', {page_number: 1, page_size: 20}).
                 then(function (res) {
                     console.log('fucking');
                     this.tableData = res.body.results;
                     console.log(this.tableData);

                     for(let i = 0; i < 6; i ++) {
                         this.items.push(
                             {
                                 title: this.tableData[i].title,
                                 path: ''
                             }
                         );
                     }

                     console.log(this.items);
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
