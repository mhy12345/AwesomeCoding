<template>
    <div id="app">
        <el-container direction="vertical">
            <el-header height="20%">
                <h1>欢迎进入AwesomeCoding的前端</h1>
                <el-menu default-active="/" router
                         class="el-menu-demo" mode="horizontal" style="text-align: center; width: 22%; margin: auto; margin-bottom: 50px">
                    <el-menu-item index="/">主页</el-menu-item>
                    <el-menu-item index="/dataVisualizer">数据库</el-menu-item>
                    <el-menu-item index="/about">关于</el-menu-item>
                    <el-menu-item index="/test">测试</el-menu-item>
                </el-menu>
            </el-header>

            <el-container direction="horizontal">
                <el-aside width="15%">
                    <h1>h1</h1>
                    <h2>h2</h2>
                    <h3>h3</h3>
                    <p>just for fun</p>
                </el-aside>

                <el-main>
                    <router-view></router-view>
                </el-main>
            </el-container>

            <el-footer>
                <br><br>
                <hr>
                <h4>AwesomeCoding</h4>
                <h5>开发团队：6得飞7©️</h5>
                <h6>清华大学计算机科学与技术系</h6>
            </el-footer>
        </el-container>
    </div>
</template>

<script>
export default {
    name: 'app',
    data () {
        return {
        }
    },
};
</script>

<style>
.el-header {
    color: #333;
    line-height: 60px;
}
.el-aside {
    background-color: #b6c9ea;
    color: #333;
}
#app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
}
</style>
