<template>
    <div>
        <div class="row">
            <div class="col-md-10">
                <h1>영화 크롤링</h1>
            </div>
        </div>
        <div class="row justify-content-center" style="margin:20px 0px;">
            <div class="col-md-10">
                <form>
                    <div class="form-group">
                        <label for="id">개봉년도</label>
                        <input type="text" class="form-control" placeholder="개봉년도를 입력하세요" v-model="info.year">
                    </div>
                    <div class="form-group">
                        <label for="name">페이지 1~50</label>
                        <input type="text" class="form-control" placeholder="페이지를 입력하세요" v-model="info.page">
                    </div>
                    <button class="btn btn-primary" @click.prevent="movieToDB">영화 목록 추가</button>
                </form>
            </div>
            <div v-if="list.length > 0" class="col-md-8 mt-1">
                <table class="table">
                    <thead class="thead-dark">
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">code</th>
                            <th scope="col">제목</th>
                            <th scope="col">개봉년도</th>
                        </tr>
                    </thead>
                    <transition-group tag="tbody" name="sc">
                        <tr v-for="(item,i) in list" :key="i">
                            <th scope="row">{{i+1}}</th>
                            <td><router-link :to="`/api/movie/view/${item.code}`">{{item.code}}</router-link></td>
                            <td>{{item.title}}</td>
                            <td style="text-align:right; padding-right:30px">{{item.date}}</td>
                        </tr>
                    </transition-group>
                </table>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'naverMovie-com',
    data() {
        return {
            info: {
                year: '',
                page: ''
            },
            list: []
        }
    },
    methods: {
        movieToDB() {
            const {year, page} = this.info;
            let date = new Date().getFullYear();
            let yearC = year.match(/^[0-9]*$/);
            if(yearC == null) {
                this.$parent.showAlert('숫자만 입력가능합니다.');
                return;
            }
            if(date < year){
                this.$parent.showAlert(`현재 (${date})년도 이하로만 불러올수있습니다.`,'danger');
                return;
            }
            if(year <= 2000) {
                this.$parent.showAlert('잘못된 년도입니다. (2000년 OVER)','warning');
                return;
            }
            if(year.trim() === '' || page.trim() === '') {
                this.$parent.showAlert('필수값이 공백입니다.', 'danger');
                return;
            }
            this.$parent.showAlert('영화 정보를 불러오는중 입니다.', 'info');
            axios.get(`/api/movie/craw?year=${yearC}&page=${page}`).then( res => {
                const data = res.data;
                if(data.success) {
                    this.$parent.showAlert(data.msg, 'success');
                    this.list = data.list;
                }else {
                    this.$parent.showAlert(data.msg, 'warning');
                }
            });
        },
        loginUser() {
            return this.$parent.loginUser;
        }
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
</style>