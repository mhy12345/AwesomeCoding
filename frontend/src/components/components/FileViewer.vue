<template>
	<el-container>
		<el-aside>
			<div>
			</div>
		</el-aside>
		<el-main>
			<div class='embed-pdf'>
				<pdf 
				 id = 'pdf-frame'
				 :page='page'
				 :src='pdf_src'
				 ref='pdf'
				 >
				</pdf>
				<el-row>
				  <el-button plain @click='prevPage'>上一页</el-button>
				  <span>第{{page}}页</span>
				  <el-button plain @click='nextPage'>下一页</el-button>
				</el-row>
			</div>
		</el-main>
	</el-container>
</template>

<script>
import pdf from 'vue-pdf'
//https://www.npmjs.com/package/vue-pdf

export default {
	data() {
		return {
			page : 1,
			pdf_src:"https://cseweb.ucsd.edu/classes/fa13/cse160-a/Lectures/Lec07.pdf",
		}
	},
	components: {
		pdf : pdf
	},
	mounted : function() {
		console.log("MOUNTED");
		this.$on('num-pages',function(num) {
			console.log("PAGE NUM : ",num);
		});
	},
	methods : {
		nextPage : function() {
			this.page += 1
		},
		prevPage : function() {
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
</style>
