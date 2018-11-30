<template>
	<div>
		<ContentDisplay ref='ctx_display' :visible='mode=="display"'>
		</ContentDisplay>
		<div style='float:right'>
			<div @click='handleShowAnswer(0)' style='float:right'>
				[我的答案]
			</div>
			<div style='float:right;width:100%'> </div>
			<div @click='handleShowAnswer(1)' style='float:right'>
				[标准答案]
			</div>
		</div>
		<codemirror v-model="text" :options="cmOptions"></codemirror>
		<el-button @click='handleSave' >保存</el-button>
	</div>
</template>

<script>
import ContentDisplay from '@/components/components/ContentDisplay.vue';
var VueCodeMirror = require('vue-codemirror-lite');
import {codemirror} from 'vue-codemirror-lite';

require('codemirror/mode/clike/clike.js')
require('codemirror/mode/javascript/javascript')
require('codemirror/mode/python/python')
import 'codemirror/theme/3024-day.css';

require('codemirror/mode/vue/vue')

//require('codemirror/addon/hint/show-hint.js')
//require('codemirror/addon/hint/show-hint.css')
//require('codemirror/addon/hint/javascript-hint.js')


export default {
	data : function () {
		return {
			code: null,
			answer: null,
			text: "",
			info: {
				description: null,
				language: 'default',
				choice_count: 0,
			},
		};
	},
	computed: {
		cmOptions: function() {
			return {
				mode: this.info.language,
				theme: "3024-day",
				lineNumbers: true,
				lineWrapping: true
			}
		}
	},
	methods: {
		handleShowAnswer: function(tag) {
			this.handleUpdate(this.code, tag);
		},
		handleSave: function (tag) {
			this.$http.post('/api/problem/program_problem/submit',{code: this.code, text: this.text}).
				then((res) => {
					this.$message('保存！');
				}).
				catch((res) => {
				});
		},
		handleLocate: function (program_code) {
			this.$http.post('/api/problem/program_problem/pick',{code: program_code}).
				then((res) => {
					if (res.body.status === 'FAILED.') {
						if (res.body.details === 'NOT_EXISTS.') {
							this.$message("错误，无法找到程序");
						} else {
							this.$message("未知错误");
						}
					} else {
						this.text = res.body.text;
						this.$message("更新");
					}
				}).
				catch((err) => {
					this.$message("错误"+err);
				});
		},
		handleUpdate: function (code, tag) {
			this.code = code;
			this.$http.post('/api/problem/table/program_problems/get',{code: this.code}).
				then((res) => {
					this.info = res.body.results[0];
					this.$refs.ctx_display.handleUpdate(this.info.description);
					return this.$http.post('/api/problem/program_problem/fetch',{code: this.code, class_code: this.class_code, ans: tag});
				}).
				then((res) => {
					this.text = res.body.text;
				}).
				catch((err) => {
				});
		}
	},
	props: {
		default_code: {default: null},
		mode : {default: 'editor'}
	},
	mounted: function () {
		if (this.default_code) {
			this.handleUpdate(this.default_code);
		}
	},
	components: {
		ContentDisplay: ContentDisplay,
		codemirror: codemirror,
	},
};
</script>
