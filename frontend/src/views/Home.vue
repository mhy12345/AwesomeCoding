<template>
    <div class="home">
        <h3>当前时间：{{cur_time}}</h3>
        <img alt="Vue logo" src="../assets/logo.png">
        <HelloWorld msg="帮助文档"/>
    </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from '../components/resources/HelloWorld.vue'

export default {
    name: 'home',
    data() {
        return {
            cur_time: Date().toLocaleString(),
        }
    },
    mounted: function() {
        setInterval(this.refreshTime, 100);
    },
    methods: {
        refreshTime: function () {      // 更新显示时间
            this.cur_time = Date().toLocaleString();
        }
    },
    components: {
        HelloWorld,
    }
};
</script>
