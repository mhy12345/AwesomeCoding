<template>
	<el-dialog title="新建选择题" :visible.sync="visible" v-loading='loading' >
		<el-form :model="info">
			<el-form-item label="题目编号" label-width=120px>
				<el-input v-model="info.code" autocomplete="off" disabled></el-input>
			</el-form-item>
			<el-form-item label="题目名称" label-width=120px>
				<el-input v-model="title"></el-input>
			</el-form-item>
			<el-form-item label="选项个数" label-width=120px>
				<el-input-number v-model="info.choice_count" :min="2" :max="5"></el-input-number>
			</el-form-item>
			<el-form-item :label="'选项'+item" label-width=120px v-for='item of choice_range'>
				<el-input v-model="info['choice_'+item]" autocomplete="off"></el-input>
			</el-form-item>
		</el-form>
		<div slot="footer" class="dialog-footer">
			<el-button @click="handleCancel">取 消</el-button>
			<el-button type="primary" @click="handleChecked">保 存</el-button>
		</div>
	</el-dialog>
</template>

<script>

import {randomString} from '@/utils/funcs.js';
import ContentEditor from '@/components/components/ContentEditor.vue';

export default {
	data: function() {
		return {
			index: null,
			visible: false,
			loading: false,
			title: null,
			info: {
				code: null,
				choice_count: 4,
				description: null,
				solution: null,
				choice_A: null,
				choice_B: null,
				choice_C: null,
				choice_D: null,
				choice_E: null,
			}
		}
	},
	computed: {
		choice_range: function() {
			let res = []
			for (let i=0;i<this.info.choice_count;i++) {
				res.push(String.fromCharCode('A'.charCodeAt()+i));
			}
			return res;
		}
	},
	methods: {
		handleOpen: function(index,row) {
			console.log("Dialog open with params ",row);
			this.info.code = row.code;
			this.title = row.title;
			this.state = row.state;
			this.index = index;
			this.visible = true;
			this.loading = true;
			this.$http.post('/api/problem/t/choice_problems/get',{code:row.code}). 
				then((res) => {
					this.info = res.body.results[0];
					this.loading = false;
				}).
				catch((res) => {
					this.loading = false;
					this.$message("Cannot get the problem details...");
				});
		},
		handleCancel: function() {
			this.visible = false;
		},
		handleChecked: function() {
			this.$http.post('/api/problem/t/choice_problems/save',{code: this.info.code, info: this.info}).
				then((res) => {
					this.$emit('completed',{
						index: this.index,
						info: this.info,
						state: this.state,
						title: this.title
					});
					this.visible = false;
				}).
				catch((err) => {
					this.visible = false;
				});
		},
		handleClose: function(done) {
			this.$confirm('确认关闭？')
				.then(_ => {
					console.log("CONFIRMED");
					this.visible = false;
					done();
				})
				.catch(_ => {
				});
		}
	},
	components: {
	}
}
</script>
