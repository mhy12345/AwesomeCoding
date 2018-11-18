<template>
	<div>
		<div class='floating-panel' v-show='!visible'>
			<div style='float:left'>
				<div class='tt' @click='handleHidden(1)'>
					<slot name='abbrev'>
					??
					</slot>
				</div>
			</div>
		</div>
		<div class='floating-window' v-show='visible'>
			<el-card style='min-height:250px'>
				<i class="el-icon-close" style='left:-10px;top:-10px;position:relative' @click='handleHidden(0)'></i>
				<i class="el-icon-caret-top" style='left:-10px;top:-10px;position:relative' @click='handleDisplay'></i>
				<slot></slot>
			</el-card>
		</div>
	</div>
</template>

<script>
export default {
	data () {
		return {
			visible: false,
		}
	},
	props: ['name'],
	methods: {
		handleHidden(fg) {
			this.visible = fg;
		},
		handleDisplay() {
			this.$emit('display');
		},
	}
};
</script>
<style>
.floating-window {
	width:350px;
	min-height:250px;
	float:left;
}
.floating-panel {
	width:350px;
	height:60px;
	float:left;
}
.tt {
    width: 50px;
    height: 50px;
    background-color: gray;
    border-radius: 50%;
    -moz-border-radius: 50%;
    -webkit-border-radius: 50%;
    color: #c0c4cc;
    padding: 0px;
    text-align: center;
    background-color: #F69;
    display: table-cell;
    vertical-align: middle
}
</style>
