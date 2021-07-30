<template>
    <div class="card" @click='view'>
        <form>
            <div class="poster"><img :src="item.image" alt=""></div>
                <div class="details">
                    <h3>{{item.title}}<br><span>{{item.date}}</span></h3>
                <div class="rating">
                    <span v-if="item.rating > 0">{{item.rating}}/10</span>
                </div>
                <div class="tags">
                    <span class="genre" v-if="item.grade != null">{{item.genre}} / {{item.grade}}</span>
                    <span class="genre" v-else>{{item.genre}}</span>
                </div>
            </div>
        </form>
    </div>
</template>

<script>
export default {
    name: 'movie-item-com',
    props: ['item'],
    data() {
        return {

        }
    },
    methods: {
        view() { this.$router.push(`/api/movie/view/${this.item.code}`); },
    },

}
</script>

<style scoped>
    .card .subtitle {
        display: none;
    }
    .card
    {
        width: 120px;
        height: 150px;
        overflow: hidden;
        box-shadow: 0 5px 10px rgba(0,0,0,0.5);
        background-color: rgba(52,50,50,0.8);
        cursor: pointer;
    }
    .card .poster {
        position: relative;
        overflow: hidden;
    }
    .card .poster::before 
    {
        content: '';
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(0deg, #525050 3%, transparent);
        transition: .5s;
        z-index: 1;
    }
    .card:hover .poster::before
    {
        bottom: 0;
    }
    .card .poster img
    {
        width: 100%;
        height: 100%;
    }
    .card:hover .poster img
    {
        filter: blur(3px);
    }
    .details
    {
        position: absolute;
        padding: 20px;
        width: 100%;
        height: 45%;
        bottom: 0;
        left: 0;
        box-sizing: border-box;
        transition: .5s;
        z-index: 2;
    }
    .card:hover .details
    {
        bottom: 90px;
    }
    .details h3
    {
        width: 100%;
        color: #fff;
        margin: 0;
        padding: 0;
        font-size: 13px;
        overflow: hidden;
        white-space  : nowrap; 
        text-overflow: ellipsis;
        display: block;
    }
    .details h3 span
    {
        font-size: 12px;
        color: #ff9800;
    }
    .rating
    {
        position: relative;
        padding: 5px 0;
    }
    .rating .fa
    {
        color: #f7f406;
        margin-right: 2px;
    }
    .rating span
    {
        color: #fff;
        padding: 0 5px;
    }
    .tags
    {
        position: relative;
        margin-top:5px;
        color: #fff;
        display: inline-block;
    }
    .tags span 
    {
        padding:  2px 5px;
        margin-left: -10px;
        font-size: 8px;
        border-radius: 5px;
    }
    .tags span.genre
    {
        background: #720661;
    }
</style>