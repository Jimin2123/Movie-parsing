<template>
    <div>
        <img :src="`/imgs/${code}.jpeg`" alt="영화 정보">
    </div>
</template>

<script>
export default {
    name:'movie-view-com',
    props:['code'],
    data() {
        return {
            movie: {}
        }
    },
    beforeMount() {
        axios.get(`/api/movie/view?code=${this.code}`).then(res => {
            const data = res.data;
            if(data.success) {
                this.movie = data.list;
            }else {
                this.$parent.showAlert(`${this.code}를 불러오지 못하였습니다.`, 'warning');
            }
        });
    }
}
</script>

<style>

</style>