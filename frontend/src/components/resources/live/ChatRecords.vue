<template>
    <div>
        <el-card v-loading="loadingQ">
            <!--聊天记录-->
            <div class="chat-record">
                <div v-for="(record, index) in chat_records" :key="index">
                    <!--显示时间-->
                    <div v-if="displayTimeQ(record.date_time)" class="bubble-time">
                        {{ formatDateTime(record.date_time) }}
                    </div>
                    <!--文字消息-->
                    <div v-if="record.type === 'text'">
                        <div v-if="record.user_id === user.user_id">
                            <el-row>
                                <div class="bubble-me">
                                    {{ record.message }}
                                </div>
                            </el-row>
                        </div>
                        <div v-else>
                            {{ record.realname }} :
                            <el-row>
                                <div class="bubble-others">
                                    {{ record.message }}
                                </div>
                            </el-row>
                        </div>
                    </div>
                    <!--todo 语音消息-->
                    <div v-else-if="record.type === 'voice'">

                    </div>
                    <!--todo 图片消息-->
                    <div v-else-if="record.type === 'picture'">

                    </div>
                    <!--默认消息-->
                    <div v-else>
                        {{ record.message }}
                    </div>
                </div>
            </div>

            <!--分页器-->
            <div class="paginator">
                <el-pagination
                    small
                    @current-change="handleCurrentChange"
                    :page-size="num_each"
                    layout="prev, pager, next, jumper"
                    :total="record_count">
                </el-pagination>
            </div>

        </el-card>
    </div>
</template>

<script>
    import {parseFlow, parseList, formatDateTime} from './chat_records'
    import {deepCopy} from "../../../utils/Copy";

    const MINUTES_SEPARATE = 1;    // 每隔多少分钟显示一次时间
    var time_marker = undefined;
    export default {
        name: "ChatRecords",
        props: ['course_id', 'user'],
        data() {
            return {
                chat_records: [],
                loadingQ: true,
                record_count: 0,   // total chat records
                num_each: 20,   // display 20 messages on each page

            }
        },
        mounted() {
            this.updateRecordCount().
                 then((count) => {
                     this.handleCurrentChange(1);
                 });
        },
        methods: {
            updateRecordCount() {   // 获取总的消息个数
                return new Promise((resolve, reject) => {
                    this.$http.
                         get('/api/live/get_chat_record_count', {
                             params: {
                                 course_id: this.course_id,
                             }
                         }).
                         then((res) => {
                             if (res.body.status === 'FAILED.') {
                                 this.pushRecord({
                                     message: res.body.details
                                 });
                                 return;
                             }
                             else {
                                 this.record_count = res.body.results;
                             }
                             resolve(this.record_count);
                         }).
                         catch((err) => {
                             console.log(err);
                             reject(err)
                         });
                });
            },
            pushRecord(flow) {  // 有拉流消息，需要动态添加聊天记录
                // time_marker = new Date();
                if (this.chat_records.length >= this.num_each)  // 超过 num_each 条就只显示最后的 num_each 条
                    this.chat_records.pop();
                time_marker = new Date();
                let record = parseFlow(flow);   // 将流转化为记录
                // console.log('[pushRecord]', time_marker.toLocaleTimeString());
                this.chat_records = [record].concat(this.chat_records);   // 新拉流的消息放在表首
                this.record_count++;
            },
            clear() {   // 清空记录
                this.chat_records = [];
            },
            displayTimeQ(date_time) {
                if ((time_marker.getTime() - date_time.getTime()) / 60000 > MINUTES_SEPARATE) {
                    console.log(true);
                    time_marker = new Date(date_time.toString());
                    return true;
                }
                else {
                    return false;
                }
            },
            handleCurrentChange(page_ord) {     // 获取第 page_ord 页的消息
                this.loadingQ = true;
                this.$http.
                     get('/api/live/get_chat_record', {
                         params: {
                             course_id: this.course_id,
                             start: (page_ord - 1) * this.num_each,
                             end: page_ord * this.num_each      // 按最新消息到最初消息的顺序，获取 [start, end) 之间的全部消息
                         }
                     }).
                     then((res) => {
                         this.loadingQ = false;
                         if (res.body.status === 'FAILED.')
                             this.pushRecord({
                                 message: res.body.details
                             });
                         else {     // 获取消息成功
                             time_marker = new Date();
                             this.chat_records = parseList(res.body.results);  // 导入消息
                         }
                     }).
                     catch((err) => {
                         console.log(err);
                     });
            },
            formatDateTime: formatDateTime
        }
    }
</script>

<style scoped>
    .chat-record {
        max-height: 400px;
        font-size: 0.7em;
        overflow: auto;
    }

    .bubble-me, .bubble-others {
        width: auto;
        max-width: 80%;
        height: 100%;
        margin: 10px;
        position: relative;
        font-size: 12px;
        line-height: 18px;
        padding: 5px 12px 5px 12px;
        box-sizing: border-box;
        border-radius: 6px;
    }

    .bubble-others::before, .bubble-me::after {
        content: '';
        position: absolute;
        width: 8px;
        height: 8px;
        top: 10px;
        background: inherit;
        border: inherit;
        border-style: solid solid none none;
    }

    .bubble-others {
        float: left;
        background-color: #fffdf8;
        border: 1px solid #d6c489;
    }

    .bubble-others::before {
        left: -5px;
        transform: rotate(-135deg);
    }

    /*用户自己发出的聊天气泡*/
    .bubble-me {
        float: right;
        background-color: #e5ffea;
        border: 1px solid #a2c58e;
    }

    .bubble-me::after {
        right: -5px;
        transform: rotate(45deg);
    }

    .bubble-time {
        width: 180px;
        height: 100%;
        margin: auto;
        position: relative;
        background-color: #c7c7c7;
        color: white;
        font-weight: bold;
        font-size: 12px;
        text-align: center;
        line-height: 18px;
        padding: 5px 12px 5px 12px;
        box-sizing: border-box;
        border-radius: 15px;
    }

    .paginator {
        position: relative;
        margin: auto;
        padding: 5px 12px 5px 12px;
        border-top: black 1px dashed;
        background-color: #ffffff;
        bottom: 5px;
    }
</style>
