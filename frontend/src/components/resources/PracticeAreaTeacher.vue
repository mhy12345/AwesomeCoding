<template>
    <div>
        <Editor :class_id='class_id'
        >
        </Editor>
    </div>
</template>

<script>
    import Editor from '@/components/components/Editor.vue';

    export default {
        data: function () {
            return {
                class_id: this.$route.params.class_id,
            };
        },
        props: ['course_status'],
        mounted: function () {
            this.class_id = this.$route.params.class_id;
        },
        computed: {},
        methods: {},
        components: {
            'Editor': Editor
        }
    }
</script>

<style>
    .correct-answer-button {
    }

    .analyze-button {
    }

    .submit-area {
        display: none;
    }
</style>
