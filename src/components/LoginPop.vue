<template>
    <div id="loginForm">
        <div id="myModal" class="modal fade">
            <div class="modal-dialog modal-login">
                <div class="modal-content">
                    <div class="modal-header">
                        <h4 class="modal-title">Log in</h4>
                        <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                    </div>
                    <div class="modal-body">
                        <form action="/login" method="post">
                            <div class="form-group">
                                <div class="input-group">
                                    <span class="input-group-addon"><i class="fa fa-user"></i></span>
                                    <input type="text" class="form-control" placeholder="사용자 ID를 입력하세요" 
                                    required="required" v-model="inputData.id">
                                </div>
                                <div class="form-group">
                                    <div class="input-group">
                                        <span class="input-group-addon"><i class="fa fa-lock"></i></span>
                                        <input type="password" class="form-control" placeholder="비밀번호를 입력하세요"
                                        required="required" v-model="inputData.pass">
                                    </div>
                                </div>
                            </div>
                            <div class="form-group">
                                <button class="btn btn-primary btn-block btn-lg" @click.prevent="loginProcess" data-dismiss="modal">Sign In</button>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">아직 회원가입을 못하셨나요? <router-link to="/register" data-dismiss="modal">회원가입</router-link></div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name:'loginPop',
    data() {
        return {
            inputData: {
                id: '',
                pass: '',
            },
        }
    },
    methods: {
        loginProcess() {
            if(this.inputData.id.trim() === '' || this.inputData.pass.trim() === '') {
                this.$parent.showAlert('필수값이 공백입니다.','danger');
                return;
            }
            const {id, pass} = this.inputData;
            axios.post('/api/user', {id,pass}).then(res => {
                const data = res.data;
                if(data.success) {
                    this.$parent.showAlert(data.msg,'success');
                    this.$parent.setLogin(data.user);
                }else {
                    this.$parent.showAlert(data.msg,'danger');
                }
            });
        }
    }
}
</script>

<style scoped>
.modal-login {
    width: 350px;
}

.modal-login .modal-content {
    padding: 20px;
    border-radius: 5px;
    border: none;
}

.modal-login .modal-header {
    border-bottom: none;
    position: relative;
    justify-content: center;
}

.modal-login .close {
    position: absolute;
    top: -10px;
    right: -10px;
}

.modal-login h4 {
    color: #636363;
    text-align: center;
    font-size: 26px;
    margin-top: 0;
}

.modal-login .modal-content {
    color: #999;
    border-radius: 1px;
    margin-bottom: 15px;
    background: #fff;
    border: 1px solid #f3f3f3;
    box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.3);
    padding: 25px;
}

.modal-login .form-group {
    margin-bottom: 20px;
}

.modal-login label {
    font-weight: normal;
    font-size: 13px;
}

.modal-login .form-control {
    min-height: 38px;
    padding-left: 5px;
    box-shadow: none !important;
    border-width: 0 0 1px 0;
    border-radius: 0;
}

.modal-login .form-control:focus {
    border-color: #ccc;
}

.modal-login .input-group-addon {
    max-width: 42px;
    text-align: center;
    background: none;
    border-bottom: 1px solid #ced4da;
    padding-right: 5px;
    border-radius: 0;
}

.modal-login .btn,
.modal-login .btn:active {
    font-size: 16px;
    font-weight: bold;
    background: #19aa8d !important;
    border-radius: 3px;
    border: none;
    min-width: 140px;
}

.modal-login .btn:hover,
.modal-login .btn:focus {
    background: #179b81 !important;
}

.modal-login .hint-text {
    text-align: center;
    padding-top: 5px;
    font-size: 13px;
}

.modal-login .modal-footer {
    color: #999;
    border-color: #dee4e7;
    text-align: center;
    margin: 0 -25px -25px;
    font-size: 13px;
    justify-content: center;
}

.modal-login a {
    color: #fff;
    text-decoration: underline;
}

.modal-login a:hover {
    text-decoration: none;
}

.modal-login a {
    color: #19aa8d;
    text-decoration: none;
}

.modal-login a:hover {
    text-decoration: underline;
}

.modal-login .fa {
    font-size: 21px;
    position: relative;
    top: 6px;
}
</style>