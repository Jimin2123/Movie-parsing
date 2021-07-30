<template>
    <div class="container">
        <div class="my-3">
            <div class="row">
                <div class="col-md-10">
                    <h1>회원가입</h1>
                </div>
            </div>
            <div class="row justify-content-center" style="margin:20px 0px;">
                <div class="col-md-10">
                    <form>
                        <div class="form-group">
                            <label for="id">ID</label>
                            <input type="text" class="form-control" placeholder="사용자 ID를 입력하세요" v-model="regInfo.id">
                        </div>
                        <div class="form-group">
                            <label for="name">이름</label>
                            <input type="text" class="form-control" placeholder="사용자 이름을 입력하세요" v-model="regInfo.name">
                        </div>
                        <div class="form-group">
                            <label for="pass">비밀번호</label>
                            <input type="password" class="form-control" placeholder="비밀번호를 입력하세요" v-model="regInfo.pass">
                        </div>
                        <div class="form-group">
                            <label for="passc">비밀번호 확인</label>
                            <input type="password" class="form-control" placeholder="비밀번호를 다시 입력하세요" v-model="regInfo.passc">
                        </div>
                        <button class="btn btn-primary" @click.prevent="register">회원가입</button>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'mainCompo',
    data() {
        return {
            regInfo: {
                id: '',
                name: '',
                pass: '',
                passc: ''
            },
        }
    },
    methods: {
        register() {
            const {id,name,pass,passc} = this.regInfo;
            if(id.trim() === "" || name.trim() === "", pass.trim() === "" || passc.trim() === "") {
                this.$parent.openAlert('필수값이 누락되었습니다.', 'danger');
                return;
            }
            if(pass !== passc) {
                this.$parent.openAlert('입력하신 비밀번호가 같지 않습니다.', 'warning');
                return;
            }
            axios.post('/api/user/reg', {id,name,pass}).then( (res) => {
                const data = res.data;
                if(data.success) {
                    swal.fire('회원가입 성공!',data.msg, 'success');
                    this.$router.push('/');
                }else {
                    this.$parent.openAlert('이미 존재하는 아이디입니다.', 'danger');
                    return;
                }       
            });
        }
    },
}
</script>

<style>

</style>