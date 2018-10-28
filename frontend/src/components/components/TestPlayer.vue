<template>

    <div>
        <div>
            <LivePlayer
                v-bind:size='PlayerWindow'
                v-bind:uid='LivePlayeruid'
                v-bind:vid='LivePlayervid'
            />
        </div>
    </div>


</template>

<script>
    // @ is an alias to /src
    import LivePlayer from './LivePlayer.vue';
    import VideoPlayer from './VideoPlayer.vue';

    export default {
        data() {
            return {
                PlayerWindow: [1140, 640],
                VideoPlayerId: '047a911d833fd4ec0a7f4bbdea2a7b93_0',
                LivePlayeruid: '047a911d83',
                LivePlayervid: '242576'
            };
        },
        mounted: function () {
        },
        methods: {},
        components: {
            LivePlayer,
            VideoPlayer
        }
    };
</script>
