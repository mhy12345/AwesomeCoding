<template>

    <div id="player"></div>

</template>

<script>
    import polyvPlayer from 'polyvPlayer'
	//var polyvPlayer = Object();

    export default {
        mounted: function() {
            // eslint-disable-next-line
            var player = polyvPlayer({
                wrap: '#player',
                width: 800,
                height: 533,
                vid: '047a911d833fd4ec0a7f4bbdea2a7b93_0'
            });
        }
    }
</script>

<style scoped>

</style>
