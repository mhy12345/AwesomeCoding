<template>
    <div>
        <el-row :gutter="40">
            <el-col id="player" :span="15"></el-col>
            <el-col :span="8">
                <el-card>
                    <h3 slot="header">课程章节</h3>
                </el-card>
            </el-col>
        </el-row>
        <el-row>
            <h1>聊天室</h1>
        </el-row>
        <el-row>
            <el-input type="textarea" placeholder="输入文本..."></el-input>
        </el-row>
    </div>
</template>


<script>
    import axios from 'axios';
    import LivePlayer from '../components/LivePlayer.vue';
    //import polyvObject from 'polyvObject'
    import root_url from '../../../config/http_root_url.js';

    export default {
        data() {
            return {
                class_id: undefined,
                player_config: {
                    width: 800,
                    height: 500,
                    uid: '',
                    vid: ''
                },
            };
        },
        mounted: function () {
            var player = undefined;
            this.class_id = this.$route.params.class_id;

            let nowpath = root_url + '/api/class/liveid/query';
            axios.
                post(nowpath, { class_id: this.class_id }).
                then((res) => {
                    console.log(res.data);

                    this.player_config.uid = res.data.liveplayer_uid;
                    this.player_config.vid = res.data.liveplayer_vid;

                    player = polyvObject('#player').livePlayer(this.player_config);
                });
        },
        methods: {},
        components: { LivePlayer }
    };
</script>




