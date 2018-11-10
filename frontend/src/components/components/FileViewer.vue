<template>
	<el-card>
		<el-row type='flex' justify='center'>
			<pdf
				id='pdf-frame'
				:page='page'
				:src='pdfSrc'
				@num-pages='handleUploadPages'
				ref='pdf'
				>
			</pdf>
		</el-row>
		<el-row type='flex' justify="center">
			<el-button plain @click='prevPage' style='height:40px'>上一页</el-button>
			<span style='height:40px;text-align:center;margin-top:8px'>第{{page}}页 / 共{{page_num}}页</span>
			<el-button plain @click='nextPage' style='height:40px'>下一页</el-button>
		</el-row>
	</el-card>
</template>

<script>
import pdf from 'vue-pdf';
//https://www.npmjs.com/package/vue-pdf

export default {
	data() {
		return {
			page: 1,
			pdfSrc: "/uploads/2018-lecture7-autoencoder_987906464.pdf",
			page_num: 0
		};
	},
	components: {pdf: pdf},
	updated: function () {
		this.pdfSrc = this.pdfSrc;
	},
	methods: {
		reload: function() {
		},
		handleUploadPages(event) {
			this.page_num = event;
		},
		nextPage: function () {
			if (this.page + 1 <= this.page_num) {
				console.log('[file] next page, succeed.');
				this.page += 1;
			} else {
				console.log('[file] next page, failed.');
			}
		},
		prevPage: function () {
			if (this.page - 1 > 0) {
				this.page -= 1;
			}
		}
	}
};
</script>

<style>
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
