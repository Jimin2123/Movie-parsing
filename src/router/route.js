import Vue from 'vue/dist/vue';
import Router from 'vue-router';
//사용할 컴포넌트들을 가져온다.
import MovieListCom from '@/components/MovieListCom'
import RegisterCom from '@/components/RegisterCom'
import MovieViewCom from '@view/MovieViewCom'
import NaverCom from '@/components/NaverMovieCraw'

Vue.use(Router);

export default new Router({
    mode:'history',
    routes:[
        {
            path: '/',
            name: 'movie-list-page',
            component: MovieListCom
        },
        {
            path: '/register',
            name: 'register-page',
            component: RegisterCom
        },
        {
            path: '/api/movie/view/:code',
            name: 'movie-view-page',
            component: MovieViewCom,
            props: true
        },
        {
            path: '/crawMovie',
            name: 'movie-craw-page',
            component: NaverCom,
        },
    ]
});