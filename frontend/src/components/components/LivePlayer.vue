<template>

    <div id="player"></div>

</template>

<script>
    import polyvObject from 'polyvObject'

    export default {
        props: {
            'size': Array,
            'vid': String,
            'uid': String
        },
        mounted: function () {
            console.log(this.size);
            // eslint-disable-next-line
            var player = polyvObject('#player').livePlayer({
                width: this.size[0],
                height: this.size[1],
                uid: this.uid,
                vid: this.vid
            });
        }
    };
</script>

<style scoped>

</style>
