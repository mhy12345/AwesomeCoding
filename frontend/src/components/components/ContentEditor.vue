<template>
	<el-dialog title="编辑文本" 
			v-loading='loading'
			:visible.sync='visible'
			>
			<VueEditor
			v-model='content'
            :editorOptions="editorOption"
            ref='editor'
        >
        </VueEditor>
        <el-button @click='handleSave' > 保存 </el-button>
        <el-button @click='handleLoad' > 同步 </el-button>
    </el-dialog>
</template>


<script>
import {VueEditor} from 'vue2-editor';

export default {
	data : function () {
		return {
			loading: false,
			visible: false,
			content_id: '',
			content: null,
			problem_set: {},
			editorOption:{
				modules:{
					toolbar:[
						['background','bold','color',/*'font',*/'code','italic','link',/*'size',*/'strike',/*'script',*/'underline','blockquote'],
						[/*'header','indent','list',*/'align','direction','code-block','formula','image','video','clean'],
					]
				}
			}
		};
	},
	methods: {
		handleOpen: function (code) {
			this.content_id = code;
			this.visible = true;
			this.$nextTick(() => {
				this.handleLoad();
			});
		},
		handleSave: function () {
			let quill_deltas = JSON.stringify(this.quill.getContents());
			this.$http.
				post('/api/content/save',{
					content: this.content,
                    deltas: quill_deltas,
					code: this.content_id,
				}).
				then(function (res) {
					this.$message("保存成功");
					this.$emit('updated');
					this.visible = false;
				}).
				catch(function (res) {
					this.$message("保存失败");
				});
		},
		handleLoad: function () {
			this.loading = true;
			if (this.quill === undefined) {
				if (this.$refs.editor !== undefined) {
					this.quill = this.$refs.editor.quill;
				} else {
				}
			} else {
			}
			this.$http.post('/api/content/fetch/deltas',{code: this.content_id}).
				then(function (res) {
					if (res.body.deltas !== undefined) {
						let quill_deltas = JSON.parse(res.body.deltas);
						this.quill.setContents(quill_deltas);
						this.loading = false;
					} else {
						this.loading = false;
					}
				}).
				catch(function (err) {
					this.$message(err);
				});
		},
	},
	mounted: function () {
		/*
		this.$nextTick(() => {
			if (this.$refs.editor !== undefined) {
				this.quill = this.$refs.editor.quill;
			}
			this.handleLoad();
		});*/
	},
	components: {VueEditor: VueEditor},
};
</script>
