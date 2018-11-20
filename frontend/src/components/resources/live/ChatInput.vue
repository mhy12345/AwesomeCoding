<template>
	<div>
		<el-row :gutter='10' type='flex'>
			<el-col :span='18'>
                <div @keydown.ctrl.enter="handleSendMessage" @keydown.meta.enter="handleSendMessage">
                    <el-input type="textarea"
                              v-model="input_message"
                              placeholder="输入文本（按ctrl/meta + enter发送）..."
                              :autosize="{minRows: 3.2}"
                              resize="none">
                    </el-input>
                </div>
			</el-col>
			<el-col :span='5'>
				<div>
                    <el-button type="primary" plain
                               icon="el-icon-picture-outline"
                               @click="$refs.uploader.click()"
                               :disabled="blockQ">
                        图片
                    </el-button>
				</div>
				<div>
					<el-button type="success" plain
                               icon="el-icon-phone"
                               @click="handleSendVoice"
                               :disabled="blockQ">
						语音
					</el-button>
				</div>
			</el-col>
		</el-row>

        <!--the real file uploader-->
        <!--<input style="display: none" type="file" ref="uploader" accept="image/*" @change="handleSendImage"/>-->
        <el-upload
            style="display: none"
            ref="upload"
            :show-file-list="false"
            :data='{ course_id: $route.params.class_id }'
            :on-success="onUploadSuccess"
            :on-error="onUploadError"
            action="/api/live/picture">
            <button ref="uploader">上传</button>
        </el-upload>
	</div>
</template>

<script>
    export default {
        name: "Chat",
        data() {
            return {
                input_message: '',
                blockQ: false, // 是否被禁言
            };
        },
        sockets: {
            block() { // 服务端发来禁言的消息
                this.blockQ = true;
                this.$message.warning('老师已开启禁言。');
            },
            allow() {
                this.blockQ = false;
                this.$message.success('老师已允许发言。');
            }
        },
        methods: {
            handleSendMessage() { // 发送消息
                if (this.input_message.length <= 0) {
                    this.$message.warning('输入不能为空。');
                    return;
                }
                let msg = {
                    course_id: this.$route.params.class_id,
                    message: this.input_message,
                    type: 'text'
                };
                // 以后聊天统一通过socket来完成
                this.$socket.emit('message', msg);
                this.input_message = '';
            },
            // handleSendImage() { // 发送图片
            //     let img = this.$refs.uploader.files[0];
            //     console.log('[picture]', img);
            //     // let form_data = new FormData();
            //     // form_data.append('file', img, img.name);
            //     // console.log('[form data]', form_data);
            //     let msg = {
            //         course_id: this.$route.params.class_id,
            //
            //         picture: img
            //     };
            //     this.$http.
            //          post('/api/live/picture', {
            //              course_id: msg.course_id,
            //              file: img,
            //          }).
            //          then((res) => {
            //              this.$message.success('上传成功');
            //              console.log(res);
            //          }).
            //          catch((err) => {
            //              console.log('[send img]', err);
            //          });
            //     this.$socket.emit('picture', msg);  // 通过 socket 发送图片消息
            // },
            handleSendVoice() { // todo 发送语音

            },
            onUploadSuccess(res) {
                this.$message.success('上传成功');
                // console.log('[upload success]', res);
                if (res.type === 'picture') {
                    this.$socket.emit('picture', {

                    })
                }
                else if (res.type === 'voice') {
                    //todo
                }
            },
            onUploadError(res) {
                this.$message.error('上传失败');
                console.log('[upload error]', res);
            }
        }
    };
</script>

<style scoped>

</style>
