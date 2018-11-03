<template>
	<el-dialog title="新建编程题" :visible.sync="visible" v-loading='loading' >
		<el-form>
			<el-form-item label="题目编号" label-width=120px>
				<el-input v-model="code" autocomplete="off" disabled></el-input>
			</el-form-item>
			<el-form-item label="题目名称" label-width=120px>
				<el-input v-model="title"></el-input>
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
	data: function() {
		return {
			index: null,
			visible: false,
			loading: false,
			title: null,
			code: null,
		}
	},
	methods: {
		handleOpen: function(index,row) {
			console.log("Dialog open with params ",row);
			this.code = row.code;
			this.title = row.title;
			this.state = row.state;
			this.index = index;
			this.visible = true;
			this.loading = false;
		},
		handleCancel: function() {
			this.visible = false;
		},
		handleChecked: function() {
			this.$emit('completed',{
				code: this.code,
				index: this.index,
				state: this.state,
				title: this.title
			});
			this.visible = false;
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
