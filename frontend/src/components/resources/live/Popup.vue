<template>
	<div>
		<div class='floating-panel' v-show='!visible'>
			<div style='float:left'>
				<div class="balloon" @click='handleHidden(1)'>
					<slot name='abbrev'>
					content in the bubble view
					</slot>
				</div>
			</div>
		</div>
		<div class='floating-window' v-show='visible'>
			<el-card style='min-height:250px'>
                <el-tooltip content="最小化" placement="top">
				    <i class="el-icon-close operator" @click='handleHidden(0)'></i>
                </el-tooltip>
                <el-tooltip content="切换显示" placement="top">
                    <i class="el-icon-d-caret operator" @click='handleDisplay'></i>
                </el-tooltip>
                <slot>
                    content in the window view
                </slot>
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
.balloon {
    width: 40px;
    height: 40px;
    background-color: #ffffff;
    border: 3px #7f89b2 solid;
    border-radius: 50%;
    -moz-border-radius: 50%;
    -webkit-border-radius: 50%;
    color: #585858;
    text-align: center;
    font-size: 0.9em;
    display: table-cell;
    vertical-align: middle;
}
.balloon:hover{
    cursor: pointer;
    border-color: #e6d49b;
}
.operator {
    left: -10px;
    top: -10px;
    position: relative
}
</style>
