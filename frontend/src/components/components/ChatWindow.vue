<template>
	<!--chat dialog for private chat-->
    <div  v-if="config.visibleQ">
        <el-card class="window">
            <div slot="header" style="text-align: center;">
                <i class="el-icon-close operator" @click='handleClose'></i>
                <h3>{{config.her.realname}}</h3>
            </div>

        </el-card>
    </div>
</template>

<script>

	export default {
		name: "ChatDialog",
        props: { config: Object },
        data() {
		    return {
            }
        },
        sockets: {

        },
        methods: {
            handleClose() {
                this.config.visibleQ = false;
            }
        },
        components: {

        }
	}
</script>

<style scoped>
    .window {
        position: fixed;
        right: 50px;
        top: 100px;
        width: 400px;
        height: 550px;
        border: dashed;
        z-index: 1000;
    }
    .operator {
        position: absolute;
        top: 10px;
        left: 10px;
    }
</style>
