<template>
    <div>
        <el-row :gutter="40">
            <el-col :style="{width: player_config.width + 'px'}">
                <!--直播窗口-->
                <div id="player"></div>

                <div>
                    聊天输入
                </div>
                <el-row>
                    <el-col style="width: 90%">
                        <el-input type="textarea"
                                  placeholder="输入文本..."
                                  :autosize="{minRows: 3.2}"
                                  resize="none"></el-input>
                    </el-col>
                    <el-col style="width: 10%">
                        <div>
                            <el-button type="info" icon="el-icon-message">发送</el-button>
                        </div>
                        <div>
                            <el-button type="success" icon="el-icon-phone">语音</el-button>
                        </div>
                    </el-col>
                </el-row>
            </el-col>

            <!--todo 右侧列表的尺寸逻辑还需要修改-->
            <el-col style="position: relative; left: 30px; min-width: 5%; max-width: 30%">
                <el-collapse v-model="active_name">
                    <el-collapse-item title="课程章节" name="chapters">
                        ...章节列表...
                    </el-collapse-item>
                    <el-collapse-item title="班级成员" name="members">
                        ...成员列表...
                    </el-collapse-item>
                    <el-collapse-item title="聊天室" name="chatting-room">
                        ...消息列表...
                    </el-collapse-item>
                </el-collapse>
            </el-col>
        </el-row>
        <div :style="{width: player_config.width + 'px'}">

        </div>
    </div>
</template>


<script>
    import axios from 'axios';
    import root_url from '../../../config/http_root_url.js';

    export default {
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
        methods: {},
    };
</script>




