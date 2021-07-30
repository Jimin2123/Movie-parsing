<template>
<div class="main">
    <header>
        <nav class="navbar navbar-expand-lg sticky-top navbar-light bg-light">
            <router-link class="navbar-brand h2" to="/">MovieReview</router-link>
            <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarSupportedContent">
                <ul class="navbar-nav mr-auto">
                    <li class="nav-item">
                        <router-link class="nav-link" to="/crawMovie">영화 크롤링</router-link>
                    </li>
                </ul>                

                <div class="nav-item" v-if="loginUser == null">
                    <button class="btn btn-primary btn-block" data-toggle="modal" data-target="#myModal">Login</button>
                </div>
                <div class="navbar-item ml-auto action-buttons" v-if="loginUser != null">
                    <button class="btn btn-outline-success">{{loginUser.name}}</button>
                    <button class="btn btn-outline-danger" @click.prevent="logout">로그아웃</button>
                </div>
            </div>
        </nav>
    </header>
    <transition name="rlmove">
        <div class="alert" :class="alertMode[alertCheck]" role="alert" v-if="openAlert">
            {{showMsg}}
        </div>
    </transition>

    <section class="content">
        <transition name="sc" mode="out-in" tag='p'>
            <router-view></router-view>
        </transition>
    </section>

    <Login v-if="loginUser == null"></Login>
</div>
</template>

<script>
import Login from '@/components/LoginPop'
export default {
    name:'MainApp',
    components: {
        Login
    },
    data() {
        return {
            loginUser:null,
            openAlert: false,
            showMsg: '',
            alertCheck: '',
            alertMode: [
                'alert-success',
                'alert-danger',
                'alert-warning',
                'alert-info'
            ],
            movieList:[]
        }
    },
    methods: {
        showAlert(msg,check) {
            this.openAlert = true;
            this.showMsg = msg;
            if(check === 'success') this.alertCheck = 0;
            else if(check === 'warning') this.alertCheck = 1;
            else if(check === 'danger') this.alertCheck = 2;
            else if (check === 'info') this.alertCheck = 3;

            setTimeout(() => {
                this.openAlert = false;
            }, 2000);
        },
        setLogin(user) { this.loginUser = user; },
        logout() {
            axios.delete('/api/user').then(res => {
                const data = res.data;
                if(data.success) {
                    this.loginUser = null;
                    swal.fire('알림',data.msg, 'success');
                    // this.$router.push('/');
                }
            });
        },
    },
}
</script>

<style scoped>
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

    .rlmove-enter-active, .rlmove-leave-active {
        transition:opacity 0.5s, transform 0.5s;
    }

    .rlmove-enter, .rlmove-leave-to {
        opacity: 0;
        transform: translateX(100%);
    }
</style>