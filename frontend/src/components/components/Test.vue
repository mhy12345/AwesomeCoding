<!--统一在这个页面里进行vue的测试-->
<template>
    <div id="test-view">

        <el-button @click="getRequest1">$http发送get请求</el-button>
        <el-button @click="getRequest2">Ajax发送get请求</el-button>

        <el-row class="tac">
            <el-col :span="5">
                <h5>默认颜色</h5>
                <el-menu
                        default-active="2"
                        class="el-menu-vertical-demo"
                        @open="handleOpen"
                        @close="handleClose" style="min-height: 400px">
                    <el-submenu index="1">
                        <template slot="title">
                            <i class="el-icon-location"></i>
                            <span>导航一</span>
                        </template>
                        <el-menu-item-group>
                            <template slot="title">分组一</template>
                            <el-menu-item index="1-1">选项1</el-menu-item>
                            <el-menu-item index="1-2">选项2</el-menu-item>
                        </el-menu-item-group>
                        <el-menu-item-group title="分组2">
                            <el-menu-item index="1-3">选项3</el-menu-item>
                        </el-menu-item-group>
                        <el-submenu index="1-4">
                            <template slot="title">选项4</template>
                            <el-menu-item index="1-4-1">选项1</el-menu-item>
                        </el-submenu>
                    </el-submenu>
                    <el-menu-item index="2">
                        <i class="el-icon-menu"></i>
                        <span slot="title">导航二</span>
                    </el-menu-item>
                    <el-menu-item index="3" disabled>
                        <i class="el-icon-document"></i>
                        <span slot="title">导航三</span>
                    </el-menu-item>
                    <el-menu-item index="4">
                        <i class="el-icon-setting"></i>
                        <span slot="title">导航四</span>
                    </el-menu-item>
                </el-menu>
            </el-col>
            <el-col :span="12">
                <h5>自定义颜色</h5>
                <el-menu
                        default-active="2"
                        class="el-menu-vertical-demo"
                        @open="handleOpen"
                        @close="handleClose"
                        background-color="#545c64"
                        text-color="#fff"
                        active-text-color="#ffd04b">
                    <el-submenu index="1">
                        <template slot="title">
                            <i class="el-icon-location"></i>
                            <span>导航一</span>
                        </template>
                        <el-menu-item-group>
                            <template slot="title">分组一</template>
                            <el-menu-item index="1-1">选项1</el-menu-item>
                            <el-menu-item index="1-2">选项2</el-menu-item>
                        </el-menu-item-group>
                        <el-menu-item-group title="分组2">
                            <el-menu-item index="1-3">选项3</el-menu-item>
                        </el-menu-item-group>
                        <el-submenu index="1-4">
                            <template slot="title">选项4</template>
                            <el-menu-item index="1-4-1">选项1</el-menu-item>
                        </el-submenu>
                    </el-submenu>
                    <el-menu-item index="2">
                        <i class="el-icon-menu"></i>
                        <span slot="title">导航二</span>
                    </el-menu-item>
                    <el-menu-item index="3" disabled>
                        <i class="el-icon-document"></i>
                        <span slot="title">导航三</span>
                    </el-menu-item>
                    <el-menu-item index="4">
                        <i class="el-icon-setting"></i>
                        <span slot="title">导航四</span>
                    </el-menu-item>
                </el-menu>
            </el-col>
        </el-row>
        <el-menu mode="horizontal">
            <el-menu-item index="1">1</el-menu-item>
            <el-menu-item index="2">2</el-menu-item>
        </el-menu>
        <h1>Test of cookie</h1>
        <h2>Date = {{ cur_date }}</h2>
        <h2>Date2 = {{ cur_date2 }}</h2>
        <el-button type="primary" @click="getCookies">获取cookies</el-button>
        <ul v-for="cookie in cookies">{{ cookie }}</ul>
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
import {doSQL} from "../../utils/DoSQL";
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
        getRequest1() {
            this.$http.get(window.location.protocol + '//' + window.location.host + '/api/' + 'show_columns?table_name=users').then((res) => {
                console.log('Got response!', res);
                alert(JSON.stringify(res));
            });
        },
        getRequest2() {
            doSQL('show_columns?table_name=users').then((res) => {
                console.log('Got response!', res);
                alert(JSON.stringify(res));
            });
        },
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