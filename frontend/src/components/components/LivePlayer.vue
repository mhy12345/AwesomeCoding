<template>
	<div>
    <div id="player"></div>
	</div>
</template>

<script>
    import polyvObject from 'polyvObject';

    export default {
        props: {
            'size': Array,
            'vid': String,
            'uid': String
        },
        created: function () {
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
