<template>
	<div>
        <el-card v-loading="loadingQ">
            <h3 slot="header">聊天记录</h3>
            <!--聊天记录-->
            <div v-for="(record, index) in chat_records" :key="index">
                <p>{{ record.date_time }} {{ record.realname }} : </p>
                <p>{{ record.message }}</p>
                <br>
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
        props: ['course_id'],
        data() {
            return {
                chat_records: [],
                loadingQ: true,
                record_count: 0,   // total chat records
                num_each: 20,   // display 20 messages on each page
            }
        },
        mounted() {
            this.$http.
                 get('/api/live/get_chat_record_count', {   // 获取总的消息个数
                     params: {
                         course_id: this.course_id,
                     } }).
                 then((res) => {
                     this.loadingQ = false;
                     console.log('[res] chat record count', res);
                     if (res.body.status === 'FAILED.') {
                         this.pushRecord({
                             message: res.body.details
                         });
                         return;
                     }
                     else {
                         this.record_count = res.body.results;
                     }
                     this.handleCurrentChange(1);   // 获取第一页
                 }).
                 catch((err) => {
                     console.log(err);
                 });
        },
        methods: {
            pushRecord(msg) {  // 有拉流消息，需要动态添加聊天记录
                console.log('>>pushing record');
                if (this.chat_records.length >= this.num_each)  // 超过 num_each 条就只显示最后的 num_each 条
                    this.chat_records.splice(0, this.chat_records.length - this.num_each + 1);
                this.chat_records.push({
                    date_time: msg.time,
                    realname: msg.from,
                    message: msg.message
                })
            },
            clear() {   // 清空记录
                console.log('>>clear record');
                this.chat_records = [];
            },
            handleCurrentChange(page_ord) {     // 获取第 page_ord 页的消息
                this.loadingQ = true;
                console.log('[get] chat record');
                this.$message(`正在获取第 ${page_ord} 页`);
                this.$http.
                     get('/api/live/get_chat_record', {
                         params: {
                             course_id: this.course_id,
                             start: (page_ord - 1) * this.num_each + 1,
                             end: page_ord * this.num_each      // 按最新消息到最初消息的顺序，获取 [start, end] 之间的全部消息
                         } }).
                     then((res) => {
                         this.loadingQ = false;
                         console.log('[res] chat record', res);
                         if (res.body.status === 'FAILED.')
                             this.pushRecord({
                                 message: res.body.details
                             });
                         else {     // 获取消息成功
                             this.chat_records = res.body.results;
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

</style>
