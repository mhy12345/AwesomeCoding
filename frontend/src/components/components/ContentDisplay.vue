<template>
	<div v-html='content' v-bind:class="{display_border:border}">
	</div>
</template>

<script>
export default {
	data: function () {
		return {
			content:'<p/>',
			code: null,
		};
	},
	props: {
		border: {default: false,},
		default_code: {default: null,},
	},
	methods: {
		handleUpdate: function (code) {
			this.code = code;
			this.$http.post('/api/content/fetch/html', {code: this.code}).
				then(function (res) {
					this.content = res.body.content;
					if (this.content.substr(0,3) === '<p>' && this.content.substr(this.content.length-4,4) === '</p>') {
this.content = this.content.substr(3,this.content.length-7);
}
				}).
				catch(function (res) {
					this.content = '';
				});
		}
	},
	mounted: function () {
		console.log("[display] content rendered : ",this.code);
		if (this.default_code !== null) {
this.handleUpdate(this.default_code);
}
	},
};
</script>

<style>
.display_border {
	border-radius:5px 5px 5px 5px;
	border:1px solid #dcdfe6;
	min-height:100px;
	padding-left:15px;
	padding-right:15px;
}
</style>
