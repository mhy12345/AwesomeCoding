<template>

    <div id="player"></div>

</template>

<script>
    import polyvPlayer from 'polyvPlayer';
    //var polyvPlayer = Object();

    export default {
        props: {
            'size': Array,
            'vid': String
        },
        mounted: function () {
            // eslint-disable-next-line
            var player = polyvPlayer({
                wrap: '#player',
                width: this.size[0],
                height: this.size[1],
                vid: this.vid
            });
        }
    };
</script>

<style scoped>

</style>
