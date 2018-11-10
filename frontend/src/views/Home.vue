<template>
    <div class="block">
        <el-carousel class="carousel_css">
            <el-carousel-item v-for="(currentitem, idx) in headlines" class = "carousel_item">
                <div v-if="currentitem.path" @click="jump(currentitem)" style="height: 100%; width: 100%" align="center">
                    <img v-bind:src="currentitem.path" style="height: 100%;"/>
                </div>
                <h3 v-else @click="jump(currentitem)">
                    {{ currentitem.title }}
                </h3>
            </el-carousel-item>
        </el-carousel>

        <el-row class="fucked">
            <el-col v-for="(currentitem, idx) in headlines" class = "card_css">
                <el-card :body-style="{ padding: '0px' }">
                    <h3 v-if="currentitem.imagepath" @click="jump(currentitem)">
                        {{ currentitem.title }}
                    </h3>
                    <h3 v-else @click="jump(currentitem)">
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
    import root_url from '../../config/http_root_url.js';

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
                     for(let i of this.tableData) {
                         console.log(i);
                         if(i.imagepath)
                             i.imagepath = root_url + i.imagepath;
                     }

                     for(let i = 0; i < 6; i ++) {
                         this.headlines.push(
                             {
                                 title: this.tableData[i].title,
                                 id: this.tableData[i].id,
                                 path: this.tableData[i].imagepath
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
        width: 300px;
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
