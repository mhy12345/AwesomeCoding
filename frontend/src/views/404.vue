<template>
    <img :src="page_url" alt="404 找不到页面！">
</template>

<script>
    export default {
        name: "PageNotFound",
        data() {
            return {
                page_url: require('../assets/images/photos/404.jpeg')
            }
        }
    }
</script>

<style scoped>

</style>