<template>
	<div>
		<ContentDisplay ref='ctx_display'>
		</ContentDisplay>
		<div @click='handleShowAnswer(0)' style='float:right'>
			[我的答案]
		</div>
		<div style='float:right;width:100%'> </div>
		<div @click='handleShowAnswer(1)' style='float:right'>
			[标准答案]
		</div>
		<div v-for='opt in options'>
			<el-radio v-model="answer" :label="opt" @change='handleChange'><span>{{opt}}</span>.{{info['choice_'+opt]}}</el-radio>
		</div>
	</div>
</template>

<script>
import ContentDisplay from '@/components/components/ContentDisplay.vue';
export default {
	data : function() {
		return {
			answer: null,
			info: {
				description: null,
				choice_count: 0,
			}
		};
	},
	methods: {
		handleShowAnswer: function(tag) {
			this.handleUpdate(this.code, tag);
		},
		handleChange: function (tag) {
			this.$http.post('/api/problem/choice_problem/submit',{code: this.code, answer: tag}).
				then((res) => {
					this.$message('保存！');
				}).
				catch((res) => {
				});
		},
		handleUpdate: function(code, ans) {
			this.code = code;
			this.$http.post('/api/problem/table/choice_problems/get',{code: this.code}).
				then((res) => {
					this.info = res.body.results[0];
					this.$refs.ctx_display.handleUpdate(this.info.description);
					return this.$http.post('/api/problem/choice_problem/fetch',{code: this.code, ans: ans});
				}).
				then((res) => {
					this.answer = res.body.results[0].answer;
				}).
				catch((err) => {
				});
		}
	},
	computed: {
		options: function() {
			let res = [];
			for (let i=0;i<this.info.choice_count;i++) {
				res.push(String.fromCharCode('A'.charCodeAt()+i));
			}
			return res;
		}
	},
	props: ['default_code'],
	mounted: function() {
		if (this.default_code !== undefined)
			this.handleUpdate(this.default_code);
	},
	components: {
		ContentDisplay: ContentDisplay
	},
};
</script>
