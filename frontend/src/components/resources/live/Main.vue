<template>
    <div>
        <el-row :gutter="40">
            <el-col :style="{width: player_config.width + 'px'}">
                <!--直播窗口-->
                <div id="player"></div>

                <!--聊天输入框-->
                <chat-input></chat-input>
            </el-col>

            <!--todo 右侧列表，尺寸逻辑还需要修改-->
            <el-col style="position: relative; left: 30px; min-width: 5%; max-width: 40%">
                <sidebar :course_status="course_status"></sidebar>
            </el-col>
        </el-row>
    </div>
</template>


<script>
    import axios from 'axios';
    import root_url from '../../../../config/http_root_url.js';
    import Sidebar from './Sidebar';
    import ChatInput from './ChatInput';

    export default {
        name: 'Live',
        props: ['course_status'],
        data() {
            return {
                class_id: undefined,
                active_name: undefined,
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

                    player = polyvObject('#player').
                        livePlayer(this.player_config);
                });
        },
        methods: {

        },
        components: {
            Sidebar,
            ChatInput
        }
    };
</script>




