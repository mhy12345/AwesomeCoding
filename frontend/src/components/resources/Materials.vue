<template>
	<el-container>
		<el-header>
			<h3>在这里放课件</h3>
		</el-header>
		<el-main>
			<div>
				授课老师：{{teacher}}
			</div>
		</el-main>
	</el-container>
</template>

<script>
export default {
	data () {
		return {teacher : undefined};
	}
};
</script>
