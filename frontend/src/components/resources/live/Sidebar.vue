<template>
    <div ref="sidebar">
        <el-tabs v-model="active_name" ref="tabs" style='visibility:unset'>
            <ElTabPane label="课程章节" name="chapters" class="sidebar-tab-pane">
                ...章节列表...<br>
            </ElTabPane>

            <ElTabPane label="班级成员" name="members">
                <members :course_status="course_status" :table_width="'400px'" class="sidebar-tab-pane"></members>
            </ElTabPane>

            <ElTabPane label="聊天室" name="chatting-room">
                <!--教师的工具条-->
                <el-row v-if="course_status === 0">
                    <el-col :span="8">
                        <el-button size="small" class="chatting-room-tool"
                                   @click="handleClearRecord">
                            清空记录
                            <i class="el-icon-delete"></i>
                        </el-button>
                    </el-col>
                    <el-col :span="8" class="chatting-room-tool">
                        <el-switch v-model="block_chattingQ"
                                   active-color="#13ce66"
                                   active-text="禁言模式"
                                   inactive-color="lightgray"
                                   @change="handleBlockChatting">
                        </el-switch>
                    </el-col>
                </el-row>
                <!--聊天记录-->
                <chat-records class="sidebar-tab-pane"
                              ref="chat_records"
                              :course_id="$route.params.class_id"
                              :user="user">
                </chat-records>
                <!--聊天输入框-->
                <chat-input></chat-input>
            </ElTabPane>

        </el-tabs>
    </div>
</template>

<script>
    import Members from '../Participants';
    import ChatRecords from './ChatRecords';
    import ElTabPane from "./MyTabPane";
    import ChatInput from './ChatInput';

    export default {
        name: "sidebar",
        props: ['course_status', 'user'],
        data() {
            return {
                active_name: 'chatting-room',
                block_chattingQ: false, // 是否禁言
                client_width: undefined,   // sidebar 的实际尺寸
            }
        },
        mounted() {
            this.client_width = this.$refs.sidebar.offsetWidth + 'px';
            // this.$refs.members.table_width = this.client_width;
        },
        sockets: {
            pullFlow: function (msg) {       // 收到服务器发来的消息，更新聊天记录显示
                this.$refs.chat_records.pushRecord(msg);
            },
        },
        methods: {
            handleClearRecord () { // 清空记录
                this.$http.
                     get('/api/live/clear_chat_record', {params: {course_id: this.$route.params.class_id}}).
                     then((res) => {
                         if (res.body.status === 'SUCCESS.') {
                             this.$message.success('清空成功');
                             this.$refs.chat_records.clear();
                         } else {
                             throw res.body;
                         }
                     }).
                     catch((err) => {
                         this.$message.error('清空失败', err);
                     });
            },
            handleBlockChatting () { // 禁言/允许发言
                if (this.block_chattingQ === true) { // 禁言
                    this.$http.
                         get('/api/live/block_chatting', {params: {course_id: this.$route.params.class_id}}).
                         then((res) => {
                             if (res.body.status === 'SUCCESS.') {
                                 this.$message.warning('已禁言');
                             } else {
                                 throw res.body.details;
                             }
                         }).
                         catch((err) => {
                             this.$message.error('禁言失败', err);
                         });
                } else { // 允许发言
                    this.$http.
                         get('/api/live/allow_chatting', {params: {course_id: this.$route.params.class_id}}).
                         then((res) => {
                             if (res.body.status === 'SUCCESS.') {
                                 this.$message('已允许发言');
                             } else {
                                 throw res.body.details;
                             }
                         }).
                         catch((err) => {
                             this.$message.error('允许失败', err);
                         });
                }
            }
        },
        components: {
            ElTabPane,
            Members,
            ChatRecords,
            ChatInput
        }
    };
</script>

<style scoped>
    .chatting-room-tool {
        margin-top: 10px;
        margin-bottom: 10px;
    }
    .sidebar-tab-pane {
        height: 480px;
        width: 100%;
        overflow: auto;
    }
</style>
