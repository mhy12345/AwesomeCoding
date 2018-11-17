<template>
	<div>
		<el-row type='flex' justify='center'>
			<el-col :span='24'>
				<div style='min-height:150px'>
					<div v-if='pdfSrc!=null'>
						<pdf
							id='pdf-frame'
							:page='page'
							:src='pdfSrc'
							@num-pages='handleUploadPages'
							ref='pdf'
							>
						</pdf>
					</div>
					<div>
						当前没有可放映课件
					</div>
				</div>
			</el-col>
		</el-row>
		<el-row type='flex' justify="center">
			<el-tooltip class="item" effect="dark" content="上一页" placement="top-start">
				<div @click='prevPage' class='tag'> <i class="el-icon-arrow-left"></i> </div> </el-tooltip>
			<span class='tag'> 第{{page}}页 / 共{{page_num}}页 </span>
			<el-tooltip class="item" effect="dark" content="下一页" placement="top-start">
				<div @click='nextPage' class='tag'><i class="el-icon-arrow-right"></i></div>
			</el-tooltip>
		</el-row>
	</div>
</template>

<script>
import pdf from 'vue-pdf';
//https://www.npmjs.com/package/vue-pdf

export default {
	data () {
		return {
			page: 1,
			pdfSrc: undefined,
			page_num: 0,
			class_id: this.$route.params.class_id
		};
	},
	components: {pdf: pdf},
	updated: function () {
		this.pdfSrc = this.pdfSrc;
	},
	sockets: {
		alert: function (msg) {
			this.$notify.warning({
				title: '收到通知',
				message: msg.content
			});
			console.log(">>>>>",msg);
			if (msg.operation === 'TURN_PAGE.') {
				this.$notify.warning({
					title: '收到翻页指令',
					message: msg.page
				});
				this.page = msg.page;
			} else if (msg.operation === 'CHANGE_PDF.') {
				this.$notify.warning({
					title: '收到更换文件指令',
					message: msg.pdfSrc
				});
				this.pdfSrc = msg.pdfSrc;
			}
		}
	},
	methods: {
		reload: function () {
		},
		handleUploadPages (event) {
			this.page_num = event;
		},
		nextPage: function () {
			if (this.page + 1 <= this.page_num) {
				console.log('[file] next page, succeed.');
				this.page += 1;
				this.$socket.emit('alert', {
					operation: 'TURN_PAGE.',
					page: +this.page,
					course_id: this.class_id
				});
			} else {
				console.log('[file] next page, failed.');
			}
		},
		prevPage: function () {
			if (this.page - 1 > 0) {
				this.page -= 1;
				this.$socket.emit('alert', {
					operation: 'TURN_PAGE.',
					page: +this.page,
					course_id: this.class_id
				});
			}
		}
	}
};
</script>

<style scoped>
.tag {
	height:10px;text-align:center;margin-top:8px;padding:5px;
}
#pdf-frame {
	border: 2px solid #d3d4e2;
	width: 100%;
}

.annotationLayer {
	display: none;
}

.page-panel {
	margin: auto;
}

.margin-auto {
	margin: auto;
}
</style>
