<template>
	<div>
		<VueEditor ref='problem_editor' v-model='content'>
		</VueEditor>
		<el-button @click='handleInsertA'> 单选题 </el-button>
		<el-button @click='handleSave' > 保存 </el-button>
		<el-button @click='handleLoad' > 同步 </el-button>
		<CorrectAnswerDialog ref='correct_answer_dialog' />
	</div>
</template>

<script>
import {VueEditor,Quill} from 'vue2-editor';
import SelectProblemEmbeder from './embedder/select';
import CorrectAnswerDialog from './CorrectAnswerDiaglog.vue';

Quill.register(SelectProblemEmbeder);

function randomString(len) {
	　　len = len || 32;
	　　var $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
	　　var maxPos = $chars.length;
	　　var pwd = '';
	　　for (let i = 0; i < len; i++) {
		　　　　pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
		　　}
	　　return pwd;
}

export default {
	data : function() {
		return {
			content : null,
			problem_set: {}
		}
	},
	props: ['class_id'],
	components: {
		'VueEditor': VueEditor,
		'CorrectAnswerDialog': CorrectAnswerDialog,
	},
	methods: {
		handleInsertA: function() {
			let info = {
				class_id: this.class_id,
				problem_id: randomString(16),
				context: this,
				choices: {
					'A': "2",
					'B': "3",
					'C': "4",
					'D': "不知道"
				}
			};
			this.problem_set[info.problem_id] = info;
			var range = this.quill.getSelection();
			if (range) {
				this.quill.insertEmbed(range.index, 'select-problem', info);
			}
		},
		handleSave: function() {
			let quill_deltas = JSON.stringify(this.quill.getContents());
			this.$http.post('/api/problem/content/save',{
				content: this.content,
				deltas:quill_deltas,
				class_id:this.class_id
			}).
				then(function(res) {
					this.$message("保存成功");
				}).
				catch(function(res) {
					this.$message("保存失败");
				});
		},
		handleLoad: function() {
			this.$http.post('/api/problem/content/load',{class_id:this.class_id}).
				then(function(res) {
					let quill_deltas = JSON.parse(res.body.deltas);
					this.quill.setContents(quill_deltas);
					console.log("SET COUNTENT",this.content);
				});
		},
		handleShowAnswerDialog: function(pid) {
			this.$message("SHOW!");
			this.$refs.correct_answer_dialog.handleOpen(pid);
		},
	},
	mounted: function() {
		this.quill= this.$refs.problem_editor.quill;
		global.problemEmbederContext = this;
		global.haha = this.$refs.problem_editor;
		this.handleLoad();
	}
};
</script>
