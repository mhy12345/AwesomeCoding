<template>
	<div>
        <!--todo use paginator-->
        <el-card v-loading="loadingQ">
            <h3 slot="header">聊天记录</h3>
            <div v-for="(record, index) in chat_records" :key="index">
                <p>{{ record.date_time }} {{ record.realname }} : </p>
                <p>{{ record.message }}</p>
                <br>
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
                chat_records: ['Loading...'],
                loadingQ: true
            }
        },
        mounted() {
            console.log('[get] chat record');
            this.$http.
                 get('/api/live/get_chat_record', { params: { course_id: this.course_id } }).
                 then((res) => {
                     console.log('[res] chat record', res);
                     this.chat_records = res.body.results;   // array of records
                     this.loadingQ = false;
                 }).
                 catch((err) => {
                     console.log(err);
                 });
        },
        methods: {
            pushRecord(msg) {  // 有拉流消息，需要动态添加聊天记录
                console.log('>>pushing record');
                this.chat_records.push({
                    date_time: msg.time,
                    realname: msg.from,
                    message: msg.message
                })
            }
        }
	}
</script>

<style scoped>

</style>
