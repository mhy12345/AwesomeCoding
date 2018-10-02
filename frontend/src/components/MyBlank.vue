<template>
    <div>
        <br v-for="i in lines">
    </div>
</template>

<script>
    export default {
        name: "MyBlank",
        data() {
            return {
                lines: 2
            }
        }
    }
</script>

<style scoped>

</style>