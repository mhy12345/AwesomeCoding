<template>
	<div>
		<div v-if='info.code !== null'>
			<ChoiceProblem ref='ctx' v-if='info.type === 0' :default_code='info.code'/>
			<ProgramProblem ref='ctx' v-if='info.type === 1' :default_code='info.code'/>
		</div>
		<div v-else>
            <div v-if="course_role === 0">
                当前没有布置的习题 <br>
                可以前往
                <el-button type="text"
                           style="display: inline; font-size: 1.0em"
                           @click="handleJump">
                    资料设置
                </el-button>
                页面进行设置
            </div>
            <div v-else>
                老师还没有布置习题哦
            </div>
		</div>
	</div>
</template>

<script>
import ChoiceProblem from '../render/ChoiceProblem.vue';
import ProgramProblem from '../render/ProgramProblem.vue';

export default {
	data: function() {
		return {
			class_id: this.$route.params.class_id,
			info: {
				type: null,
				code: null,
			}
		};
	},
    props: { course_role : Number },
    methods: {
        update(info) {
            if (info === null) {
                this.info = { type: null, code: null };
            } else {
                this.info = info;
            }
            this.$nextTick(() => {
                this.$refs.ctx.handleUpdate(info.code);
            });
        },
        handleJump() {      // 跳到资料设置界面
            this.$router.push(`/class/${this.class_id}/file_settings`);
            this.$emit('jump', 'file_settings');    // 通知父级跳页面
        }
    },
	mounted: function(){
		this.$http.post('/api/class/cache/get', {class_id: this.class_id, entry: 'PROBLEM'}).
		then((res) => {
			this.info = JSON.parse(res.body.results[0].data);
		}).
			catch((err) => {
			});
	},
	components: {
		ChoiceProblem: ChoiceProblem,
		ProgramProblem: ProgramProblem
	},
};
</script>
