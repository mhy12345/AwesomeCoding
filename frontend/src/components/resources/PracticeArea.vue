<template>
    <iframe :src='src' style='width:100%' frameborder="no">
    </iframe>
</template>

<script>
    export default {
        data: function () {
            return {}
        },
        props: ['course_status'],
        computed: {
            class_id: function () {
                return this.$route.params.class_id;
            },
            src: function () {
                return '/backend/problem/render?class_id=' + this.class_id;
            }
        }
    }
</script>

<style>
</style>
