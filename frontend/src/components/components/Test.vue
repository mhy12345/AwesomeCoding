<template>
    <div id="test-view">
        <h1>Test of cookie</h1>
        <h2>Date = {{ cur_date }}</h2>
        <h2>Date2 = {{ cur_date2 }}</h2>
        <el-button type="primary" @click="getCookies">获取cookies</el-button>
        <li v-for="cookie in cookies">{{ cookie }}</li>
        <br> <br>

        <el-input placeholder="input cookie name..." v-model="new_cookie.name"></el-input>
        <el-input placeholder="input cookie value..." v-model="new_cookie.value"></el-input>
        <el-button type="success" @click="createCookie">创建cookie</el-button>

        <h1>Test of hosts</h1>
        <h2>host1: {{host.host1}} host2: {{host.host2}}</h2>
        <h3>current url: {{ my_url }}</h3>
        <h3>current protocol: {{ my_protocol }}</h3>
        <h3>current pathname: {{ my_path }}</h3>
        <!--以下为对话框数据传输测试-->
        <el-button @click="createDialog" type="success">打开对话框</el-button>
        <EditDialog :config="dialog" @dialogClose="handleClose">
            <div slot="h1">这是标题的插槽</div>
            这是段落的插槽
        </EditDialog>
        <el-input style="width: 50%;" placeholder="输入的内容" v-model="input"></el-input>
        <hr>
        <el-button @click="showColumn = !showColumn">展开动画</el-button>
        <transition name="el-fade-in-linear">
            <div align="center" v-show="showColumn">
                <div class="transition-box">el-collapse-transition</div>
                <div class="transition-box">el-collapse-transition</div>
            </div>
        </transition>
        <div align="center" style="margin-top: 20px; height: 200px;">
            <el-collapse-transition>
                <div v-show="showColumn" class="transition-box">el-collapse-transition</div>
            </el-collapse-transition>
        </div>
    </div>
</template>

<script>
import EditDialog from './EditDialog'
// import CollapseTransition from 'element-ui/lib/transitions/collapse-transition';
// import Vue from 'vue'
//
// Vue.component(CollapseTransition.name, CollapseTransition);
export default {
    name: 'Test',
    data () {
        var date = new Date();
        var date2 = new Date();
        date2.setTime(date.getTime() + 60 * 1000);
        return {
            host: {
                host1: window.location.host,
                host2: document.domain
            },
            my_url: window.location.href,
            my_protocol: window.location.protocol,
            my_path: location.pathname,

            input: '',
            dialog: {
                title: '一个平凡的标题',
                content: '一个平凡的段落。',
                visible: false,
                input: '',
                response: false
            },
            showColumn: true,
            cookies: [],
            exp_secs: 120,
            new_cookie: {
                name: '',
                value: '',
            },
            cur_date: date.toUTCString(),
            cur_date2: date2.toUTCString()
        }
    },
    methods: {
        createDialog: function () {
            this.dialog.visible = true;
            this.dialog.input = this.input;
        },
        handleClose: function () {
            //console.log("对话框关闭。");
            if (this.dialog.response === true)
                this.input = this.dialog.input;
        },
        getCookies: function () {
            var str_cookie = document.cookie;
            console.log(str_cookie);
            var list = str_cookie.split(';');
            this.cookies = [];
            for (var cookie of list) {
                this.cookies.push(cookie.trim());
            }
            console.log(this.cookies);
        },
        createCookie: function () {
            var d = new Date();
            d.setTime(d.getTime() + this.exp_secs * 1000);
            var str_cookie = this.new_cookie.name + '=' + this.new_cookie.value + ';' + "expires=" + d.toUTCString();       // 这相当于一个字典，‘=’兼有判重和追加的作用
            document.cookie = str_cookie;
            this.getCookies();
        }
    },
    components: {
        EditDialog,
        // CollapseTransition
    }
}
</script>

<style scoped>
    .transition-box {
        margin-bottom: 10px;
        width: 200px;
        height: 100px;
        border-radius: 4px;
        background-color: #409EFF;
        text-align: center;
        color: #fff;
        padding: 40px 20px;
        box-sizing: border-box;
        margin-right: 20px;
    }
</style>