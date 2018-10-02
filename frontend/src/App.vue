<!--前端整体布局-->
<template>
    <div id="app">
        <h1>{{title}}</h1>
        <h3>当前时间：{{cur_time}}</h3>
        <el-button v-on:click="refreshTime">刷新时间</el-button><br/>
        <img src="./assets/logo.png">
        <data-visualizer title="数据库查看器"></data-visualizer>
        <br>
        <hr>
        <HelloWorld msg="帮助页"/>
    </div>
</template>

<script>
import HelloWorld from './components/HelloWorld.vue'
import DataVisualizer from './components/DataVisualizer'

export default {
    name: 'app',
    props: ['data'],
    data() {
        return {
            title: "欢迎进入AwesomeCoding的前端",
            cur_time: Date().toLocaleString(),
        }
    },
    created: function() {

    },
    methods: {
        refreshTime: function () {      // 更新显示时间
            this.cur_time = Date().toLocaleString();
        }
    },
    components: {
        DataVisualizer,
        HelloWorld
    }
}
</script>

<style>
#app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
}
</style>
