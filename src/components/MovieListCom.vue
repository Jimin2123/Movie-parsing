<template>
    <div>
        <h1 class="d-flex justify-content-center">영화 목록</h1>
        <div class="row">
            <div class="col-10 offset-1" v-if="list.length != 0">
                <input type="search" v-model="word" name="" placeholder="Search for..." class="search__field">                    
            </div>
        </div>
        <h1 class="d-flex flex-wrap justify-content-center mt-2" v-if="list.length == 0">DB에 영화목록이 없습니다.</h1>
        <div class="row d-flex flex-wrap justify-content-center mt-2" v-else>
            <div class="col-10">
                <transition-group name="sc" tag="div" class="card-list">>
                <!-- <div class="card-list"> -->
                    <movie-item v-for="item in filterList" :key="item.code" :item="item"></movie-item>
                <!-- </div> -->
                </transition-group>
            </div>
        </div>
        <scroll-loader :loader-method="getMovie" v-if="loadMore">
            <!-- <div>Loading...</div> -->
        </scroll-loader>
    </div>
</template>

<script>
import MovieComItem from '@item/MovieComItem';

export default {
    name: 'movie-list-com',
    components: {
        'movie-item':MovieComItem,
    },
    data() {
        return {
            loadMore:true,
            page: 0,
            pageSize: 50,
            list: [],
            word:''
        }
    },
    computed:{
        filterList(){
            return this.list.filter(x => x.title.includes(this.word) );
        }
    },
    methods: {
        async getMovie() {
            axios.post('/api/movie', {
                params: {
                    page: this.page++,
                    per_page:this.pageSize,
                }
            }).then(res => {
                const data = res.data;
                if(this.list.length > 100 && this.loadMore == true) this.list.splice(0,50);
                if(data.list.length == 0 || this.list.length < 20) this.loadMore = false;
                data.list && (this.list = [...this.list, ...data.list]);
            }).catch(err => {
                console.log(err);
            });
        },
    },
}
</script>

<style>
    .card-list {
        display: grid;
        gap: 20px;
        grid-template-columns: repeat(10, 1fr);
        grid-auto-rows: 150px;
        margin-bottom: 20px;
    }   

    .sc-enter-active, .sc-leave-active {
        transition: opacity 0.5s, transform 0.5s;
    }

    .sc-enter  {
        opacity: 0;
        transform: translateY(100%);
    }

    .sc-leave-to{
        opacity: 0;
        transform: translateY(-100%);
    }

</style>
