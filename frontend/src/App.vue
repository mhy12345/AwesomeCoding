<!--前端整体布局-->
<template>
    <div id="app">
        <router-link to="/">主页</router-link>  |
        <router-link to="/dataVisualizer">数据库</router-link>  |
        <router-link to="/about">关于</router-link>
        <h1>欢迎进入AwesomeCoding的前端</h1>
        <br>
        <router-view></router-view>
    </div>
</template>

<script>
export default {
    name: 'app',
    data() {
        return {}
    },
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
