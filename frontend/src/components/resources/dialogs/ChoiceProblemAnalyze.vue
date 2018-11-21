<template>
		<el-tabs v-model='selectedTabName'>
			<el-tab-pane label="选项整理" name="first">
				<div style='margin:auto'>
					<div id='board' style="margin:auto;width:300px;height:280px;">
					</div>
				</div>
			</el-tab-pane>
			<el-tab-pane label="详细情况" name="second">
				<el-table
					:data="data"
					style="width: 100%">
					<el-table-column
						prop="id"
						label="#ID"
						width="180">
					</el-table-column>
					<el-table-column
						prop="realname"
						label="姓名"
						width="180">
					</el-table-column>
					<el-table-column
						prop="answer"
						label="选项">
					</el-table-column>
				</el-table>
			</el-tab-pane>
		</el-tabs>
</template>

<script>
export default {
	data: function () {
		return {
			count: {},
			data: [],
			refreshHandle: null,
			selectedTabName: 'first',
		};
	},
	props: ['code'],
	methods: {
		stop_refresh: function() {
			clearTimeout(this.refreshHandle);
			this.refreshHandle = null;
		},
		refresh: function() {
			this.$http.post('/api/problem/choice_problem/gather',{code: this.code}).
				then((res) => {
					this.count = {};
					this.data = res.body.results;
					for (let item of res.body.results) {
						if (this.count[item.answer] === undefined) {
							this.count[item.answer] = 0;
						}
						this.count[item.answer] += 1;
					}
					var myChart = echarts.init(document.getElementById('board'));
					let data = {};
					data.name = '选择统计';
					data.data = [];
					for (let item in this.count) {
						data.data.push({name:item, value:this.count[item]});
					}
					data.type = 'pie';
					data.radius = '75%';
					// 使用刚指定的配置项和数据显示图表。
					myChart.setOption({series:data});
				}).
				catch((res) => {
				});
			this.refreshHandle = setTimeout(this.refresh,2000);
		}
	},
	mounted: function () {
		this.refresh();
	},
	components: {}
};
</script>
