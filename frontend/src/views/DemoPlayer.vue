<template>

    <div>
        <VideoPlayer />
    </div>

</template>

<script>
// @ is an alias to /src
import VideoPlayer from '@/components/VideoPlayer.vue'

export default {
    //name: 'home',
    mounted: function() {
        //setInterval(this.refreshTime, 100);
    },
    methods: {
        //refreshTime: function () {      // 更新显示时间
            //this.cur_time = Date().toLocaleString();
        //}
    },
    components: {
        VideoPlayer
    }
};
</script>
