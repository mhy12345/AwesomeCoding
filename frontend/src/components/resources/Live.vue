<template>
    <div id="player"></div>
</template>


<script>
    import axios from 'axios'
    import LivePlayer from '../components/LivePlayer.vue';
    //import polyvObject from 'polyvObject'

    var root_url = require('../../../config/http_root_url');

    export default {
        data() {
            return {
                class_id: undefined,
                PlayerWindow: [600, 400],
                liveplayer_uid: '',
                liveplayer_vid: ''
            };
        },
        mounted: function () {
            var player = undefined;
            this.class_id = this.$route.params.class_id;

            let nowpath = root_url + '/api/class/liveid/query';
            let that = this;
            axios.post(nowpath, {
                class_id: this.class_id
            }).then(function (res) {
                console.log(res.data);

				player = polyvObject('#player').livePlayer({
					width: that.PlayerWindow[0],
					height: that.PlayerWindow[1],

					uid: res.data.liveplayer_uid,
					vid: res.data.liveplayer_vid
				});

                //that.liveplayer_uid = res.data.liveplayer_uid;
                //that.liveplayer_vid = res.data.liveplayer_vid;
            });
        },
        methods: {},
        components: {
            LivePlayer
        }
    };
</script>




