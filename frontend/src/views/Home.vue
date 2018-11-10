<template>
    <div class="block">
        <el-carousel class="carousel_css">
            <el-carousel-item v-for="(currentitem, idx) in headlines" class = "carousel_item">
                <h3 v-if="currentitem.path === ''" @click="jump(currentitem)">
                    {{ currentitem.title }}
                </h3>
                <h3 v-else>
                    {{ idx }}
                </h3>
            </el-carousel-item>
        </el-carousel>

        <el-row class="fucked">
            <el-col :span="4" v-for="(currentitem, idx) in headlines" class = "card_css">
                <el-card :body-style="{ padding: '0px' }">
                    <h3 v-if="currentitem.path === ''" @click="jump(currentitem)">
                        {{ currentitem.title }}
                    </h3>
                    <div style="padding: 14px;">
                        <span> {{currentitem.title}} </span>
                    </div>
                </el-card>
            </el-col>
        </el-row>
    </div>
</template>

<script>
    /* eslint-disable camelcase */

    import {supported_resources} from '../utils/CourseLists';

    export default {
        data: function () {
            return {
                headlines: [],
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
                         this.headlines.push(
                             {
                                 title: this.tableData[i].title,
                                 id: this.tableData[i].id,
                                 path: ''
                             }
                         );
                     }
                 }).
                 catch(function (res) {
                     this.$message(res);
                 });
        },
        methods: {
            jump: function (currentitem) {
                this.$router.push({name: 'class', params: {class_id: currentitem.id}});
            }
        },
        components: {}
    };
</script>

<style>
    .carousel_css {
        margin: 20px;
        height: 400px;
    }
    .carousel_item {
        height: 400px;
    }
    .fucked {
        margin: 20px;
        height: 400px;
    }
    .card_css {
        margin: 20px;
    }
    .el-carousel__item h3 {
        color: #475669;
        font-size: 52px;
        margin: 0 auto;
        line-height: 400px;
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

    .el-card h3 {
        color: #475669;
        font-size: 26px;
        margin: 0 auto;
        line-height: 150px;
        text-align: center;
    }
</style>
