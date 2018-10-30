<template>
	<div style='min-height:300px'>
		<div id='board' style="width:100%;height:280px;">
		</div>
	</div>
</template>

<script>
export default {
	data: function() {
		return {
			count: {},
		}
	},
	props: ['code'],
	mounted: function () {
		this.$http.post('/api/problem/choice_problem/gather',{code: this.code}).
			then((res) => {
				this.count = {};
				for (let item of res.body.results) {
					if (this.count[item.answer] === undefined)
						this.count[item.answer] = 0;
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
				console.log(data);
			}).
			catch((res) => {
				console.log(res);
			});

	},
	components: {
	}
}
</script>
