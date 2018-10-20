<template>
	<el-container>
		<el-header>
			<h2>班级成员管理</h2>
		</el-header>
		<div id="DataVisualizer" v-loading="loadingQ">
			<el-collapse-transition>
				<div v-if="loadedQ">
					<el-table id="display-table"
							  :data="fancy_data"
							  style="width: 100%; margin: auto; padding: 5px;"
							  highlight-current-row stripe>
						<el-table-column v-for="obj in heads"
										 :key="obj.idx"
										 :label="obj.title"
										 align="center"
										 :prop="obj.idx">
						</el-table-column>
						<el-table-column align="center" label="操作">
							<template slot-scope="scope">
								<el-button type="danger"
										   icon="el-icon-delete" circle
										   @click="handleDelete(scope.row.id)">
								</el-button>
							</template>
						</el-table-column>
					</el-table>
				</div>
			</el-collapse-transition>
		</div>
	</el-container>
</template>

<script>
    /* eslint-disable camelcase,no-unused-vars */


    export default {
	data () {
		return {
			table_name: '',
			heads: [
				{idx:'nickname',title:'昵称'},
				{idx:'realname',title:'真实姓名'},
				{idx:'email',title:'邮箱'},
				{idx:'role_title',title:'角色'}
			], // 表头
			table_data: [],
			input: { // 用户输入的内容
				table_name: 'users',
				items: {},
			},
			edit_dialog: { // 编辑对话框的属性
				visual: false,
				row: {}
			},
			loadingQ: false, // 是否处于加载中的状态
			loadedQ: false, // 是否已经加载完成
		};
	},
	computed: {
		fancy_data: function () {
			let data = [];
			for (let item of this.table_data) {
				if (item.role === 0) {
					item.role_title = '教师';
				}
				data.push(item);
console.log(item);
			}
			return data;
		}
	},
	mounted: function () {
		this.class_id = this.$route.params.class_id;
		this.loadingQ = true;//...

		this.$http.post('/api/class/participants/show',{class_id:this.class_id},null).
			then((resp) => { // 成功，被 showSQL 的 resolve 调用
				this.table_data = resp.body.results;
				console.log(this.table_data);
				this.loadingQ = false;
				this.loadedQ = true;
			}).
			catch((err)=>{ // 某个步骤失败，交给 showUnknownError 统一处理
				this.loadingQ = false;
				this.loadedQ = false;
				this.showUnknownError(err);
			});
	},
	methods: {
		showUnknownError: function (err) {
            var msg;
			console.log("UNKNOWN ERROR!", err);
			msg = "操作失败。" + JSON.stringify(err['details']);
			this.$message.error(msg);
		},
		handleAdd: function () { // 向后端数据库发出添加数据的请求
			this.loadingQ = true;
			//TODO
		},
		handleDelete: function (id) { // 向后端数据库发出删除数据的请求
			this.loadingQ = true;
			//TODO
		},
		handleChange: function () { // 向后端数据库发出修改数据的请求
			this.loadingQ = true;
			this.edit_dialog.visual = false;
			//TODO
		}
	},
};
</script>

<style scoped>
</style>
