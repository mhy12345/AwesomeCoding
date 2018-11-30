<template>
	<el-dialog title="新建编程题" :visible.sync="visible" v-loading='loading' >
		<el-form>
			<el-form-item label="题目编号" label-width=120px>
				<el-input v-model="code" autocomplete="off" disabled></el-input>
			</el-form-item>
			<el-form-item label="题目名称" label-width=120px>
				<el-input v-model="title"></el-input>
			</el-form-item>
			<el-form-item label="语言" label-width=120px>
				<el-select v-model="info.language" placeholder="请选择">
					<el-option
						v-for="item in options"
						:key="item.value"
						:label="item.label"
						:value="item.value">
					</el-option>
				</el-select>
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

export default {
	data: function () {
		return {
			options: [
				{key:'cpp', label:'C++', value:'text/x-c++src'},
				{key:'js', label:'Javascript', value:'text/javascript'},
				{key:'python', label:'Python', value:'text/x-python'},
			],
			index: null,
			visible: false,
			loading: false,
			title: null,
			code: null,
			info: {
				language: 'default'
			}
		};
	},
	methods: {
		handleOpen: function (index,row) {
			this.code = row.code;
			this.title = row.title;
			this.state = row.state;
			this.index = index;
			this.visible = true;
			this.loading = true;
			this.$http.post('/api/problem/table/program_problems/get',{code:row.code}). 
				then((res) => {
					this.info = res.body.results[0];
					this.loading = false;
				}).
				catch((res) => {
					this.loading = false;
					this.$message("Cannot get the problem details...");
				});
		},
		handleCancel: function () {
			this.visible = false;
		},
		handleChecked: function () {
			this.$http.post('/api/problem/table/program_problems/save',{code: this.code, info: this.info}).
				then((res) => {
					this.$emit('completed',{
						code: this.code,
						index: this.index,
						state: this.state,
						title: this.title
					});
					this.visible = false;
				}).
				catch((err) => {
					this.visible = false;
				});
		},
		handleClose: function (done) {
			this.$confirm('确认关闭？')
				.then(_ => {
					this.visible = false;
					done();
				})
				.catch(_ => {
				});
		}
	},
	components: {}
};
</script>
