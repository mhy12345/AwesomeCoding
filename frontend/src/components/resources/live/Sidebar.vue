<template>
	<div>
        <el-collapse v-model="active_name">
            <el-collapse-item title="课程章节" name="chapters">
                ...章节列表...
            </el-collapse-item>
            <el-collapse-item title="班级成员" name="members">
                <members :course_status="course_status" :table_width="'600px'">
                </members>
            </el-collapse-item>
            <el-collapse-item title="聊天室" name="chatting-room">
                ...消息列表...
            </el-collapse-item>
        </el-collapse>
    </div>
</template>

<script>
    import Members from '../Participants';
	export default {
        name: "sidebar",
        props: ['course_status'],
        components: {
            Members
        }
	}
</script>

<style scoped>

</style>
