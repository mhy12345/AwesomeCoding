<template>
	<el-row>
		<el-col :span='6'>
			asd
		</el-col>
		<el-col :span='18'>
			<el-row type='flex' justify='center'>
					<pdf 
					id = 'pdf-frame'
					:page='page'
					:src='pdf_src'
					@num-pages="page_num = $event"
					ref='pdf'
					>
					</pdf>
			</el-row>
			<el-row type='flex' justify="center">
					<el-button plain @click='prevPage' style='height:40px'>上一页</el-button>
					<span style='height:40px;text-align:center;margin-top:8px'>第{{page}}页 / 共{{page_num}}页</span>
					<el-button plain @click='nextPage' style='height:40px'>下一页</el-button>
			</el-row>
		</el-col>
	</el-row>
</template>

<script>
import pdf from 'vue-pdf'
//https://www.npmjs.com/package/vue-pdf

export default {
	data() {
		return {
			page : 1,
			pdf_src:"https://cseweb.ucsd.edu/classes/fa13/cse160-a/Lectures/Lec07.pdf",
			page_num : 0
		}
	},
	components: {
		pdf : pdf
	},
	mounted : function() {
	},
	methods : {
		nextPage : function() {
			if (this.page+1 <= this.page_num)
				this.page += 1
		},
		prevPage : function() {
			if (this.page-1>0)
				this.page -= 1
		}
	}
}
</script>

<style>
#pdf-frame {
	width:500px;
	height:400px;
	border:2px solid #d3d4e2;
}
.annotationLayer {
	display:none;
}
.page-panel{
	margin:auto;
}
.margin-auto {
	margin:auto;
}
</style>
