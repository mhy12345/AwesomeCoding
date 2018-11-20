<template>
    <!--可预览的聊天图片-->
    <el-row>
        <img :src="record.path" :alt="record.message"
             preview
             :preview-text="record.date_time.toLocaleString() + ' ' + record.realname"
             class="chat-picture">
    </el-row>
</template>

<script>
	export default {
		name: "ChatPicture",
        props: { record: Object },
	}
</script>

<style scoped>
    .chat-picture {
        width: 150px;
        margin: 5px;
    }
</style>
