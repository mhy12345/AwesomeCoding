<template>
    <div>
        <el-collapse v-model="active_name" style="height: 500px;">
            <el-collapse-item title="课程章节" name="chapters">
                ...章节列表...<br>
                ...<br>
                ...<br>
                ..<br>
                ..<br>
                ...<br>
                ...<br>
                ..<br>
                ..<br>
                ...<br>
                ...<br>
                ..<br>
                ..<br>
            </el-collapse-item>
            <el-collapse-item title="班级成员" name="members">
                <members :course_status="course_status" :table_width="'600px'"></members>
            </el-collapse-item>
            <el-collapse-item title="聊天室" name="chatting-room">
                <chat-records ref="chat_records" :course_id="$route.params.class_id"></chat-records>
            </el-collapse-item>
        </el-collapse>
    </div>
</template>

<script>
    import Members from '../Participants';
    import ChatRecords from './ChatRecords';

    export default {
        name: "sidebar",
        props: ['course_status'],
        data() {
            return {
                active_name: 'members'
            }
        },
        socket: {

        },
        components: {
            Members,
            ChatRecords
        }
    }
</script>

<style scoped>

</style>
