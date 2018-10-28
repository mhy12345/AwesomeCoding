<template>
    <div id="player"> </div>
</template>


<script>
    import axios from 'axios'
    //import LivePlayer from '../components/LivePlayer.vue';
    import polyvObject from 'polyvObject'

    var root_url = require('../../../config/http_root_url');


    export default {
        data() {
            return {
                PlayerWindow: [600, 400],
                liveplayer_uid: '047a911d83',
                liveplayer_vid: '242576'
            };
        },
        mounted: function () {
            var player = polyvObject('#player').livePlayer({
                width: this.PlayerWindow[0],
                height: this.PlayerWindow[1],
                uid: this.liveplayer_uid,
                vid: this.liveplayer_vid
            });

            let nowpath = root_url + '/api/class/liveid/query';
            console.log('fuck you');
            console.log(nowpath);
            let that = this;
            axios.post(nowpath, {
                class_id: 8
            }).then(function (res) {
                console.log(res.data);

                //that.liveplayer_uid = res.data.liveplayer_uid;
                //that.liveplayer_vid = res.data.liveplayer_vid;
            });
        },
        methods: {},
        components: {
            //LivePlayer
        }
    };
</script>




