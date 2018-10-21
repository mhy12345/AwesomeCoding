<template>
	<div id='practice-area-container' v-html="contents">
		{{contents}}
	</div>
</template>

<script>
import Editor from '@/components/components/Editor.vue';
export default {
	data: function() {
		return {
			class_id: this.$route.params.class_id,
			contents: null
		};
	},
	props: ['course_status'],
	mounted : function() {
		this.class_id = this.$route.params.class_id;
		this.$http.post('/api/problem/content/load',{class_id:this.class_id}).
			then(function(res) {
this.contents = res.body.contents;
			});
	},
	computed : {
	},

	methods: {
	},
}
</script>

<style>
.correct-answer-button {
	display:none;
}
.analyze-button {
}
.submit-area {
}
</style>
