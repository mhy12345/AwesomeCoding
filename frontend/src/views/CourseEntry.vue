<template>
    <div>
        <el-row :gutter="40">
            <el-col :span='8'>
                <el-card>
                    <publicCourses idx='publicCourses'/>
                </el-card>
            </el-col>
            <el-col :span='8'>
                <el-card>
                    <myCourses idx='myCourses'/>
                </el-card>
            </el-col>
            <el-col :span='8'>
                <el-card>
                    <h3>邀请码</h3>
                    <el-form>
                        <el-form-item>
                            <el-input type='text' placeholder='请输入邀请码' v-model='invitation_code'/>
                        </el-form-item>
                        <el-form-item>
                            <el-button type='primary' style='width:100%' @onclick='handleEnterByInvitation'> 进入课程
                            </el-button>
                        </el-form-item>
                    </el-form>
                </el-card>
            </el-col>
        </el-row>
    </div>
</template>

<script>
    /* eslint-disable camelcase */

    import CourseList from '@/components/components/CourseList.vue';


    export default {
        data() {
            return {invitation_code: undefined,};
        },
        methods: {
            handleEnterByInvitation: function () {
                window.location.href = "/class/invite/" + self.invitation_code;
            }
        },
        components: {
            'publicCourses': CourseList,
            'myCourses': CourseList
        }
    };
</script>
