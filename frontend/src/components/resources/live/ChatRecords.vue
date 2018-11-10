<template>
    <div>
        <el-card v-loading="loadingQ">
            <!--聊天记录-->
            <div v-for="(record, index) in chat_records" :key="index" class="chat-record">
                <!--{{ record.date_time }}-->
                <div v-if="record.realname === user.realname">
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

            <!--分页器-->
            <div>
                <span class="demonstration">直接前往</span>
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
            console.log('[ChatRecord] user', this.user);
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
            pushRecord(msg) {  // 有拉流消息，需要动态添加聊天记录
                if (this.chat_records.length >= this.num_each)  // 超过 num_each 条就只显示最后的 num_each 条
                    this.chat_records.pop();
                this.chat_records = [{  // todo display as bubble with expanding animation
                    date_time: msg.time,    // todo to local time
                    realname: msg.from,
                    message: msg.message
                }].concat(this.chat_records);   // 新拉流的消息放在表首
                this.updateRecordCount();
            },
            clear() {   // 清空记录
                this.chat_records = [];
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
                             this.chat_records = res.body.results;  // 导入消息
                         }
                     }).
                     catch((err) => {
                         console.log(err);
                     });
            }
        }
    }
</script>

<style scoped>
    .chat-record {
        font-size: 0.7em;
    }

    .bubble-others {
        float: left;
        width: 80%;
        height: 100%;
        margin: 10px;
        position: relative;
        background-color: #fffdf8;
        border: 1px solid #d6c489;
        font-size: 12px;
        line-height: 18px;
        padding: 5px 12px 5px 12px;
        box-sizing: border-box;
        border-radius: 6px;
    }

    .bubble-others::before {
        content: '';
        position: absolute;
        width: 8px;
        height: 8px;
        top: 10px;
        left: -5px;
        transform: rotate(-135deg);
        background: inherit;
        border: inherit;
        border-style: solid solid none none;
    }

    /*用户自己发出的聊天气泡*/
    .bubble-me {
        float: right;
        width: 80%;
        height: 100%;
        margin: 10px;
        position: relative;
        background-color: #e5ffea;
        border: 1px solid #a2c58e;
        font-size: 12px;
        line-height: 18px;
        padding: 5px 12px 5px 12px;
        box-sizing: border-box;
        border-radius: 6px;
    }

    .bubble-me::after {
        content: '';
        position: absolute;
        width: 8px;
        height: 8px;
        top: 10px;
        right: -5px;
        transform: rotate(45deg);
        background: inherit;
        border: inherit;
        border-style: solid solid none none;
    }
</style>
