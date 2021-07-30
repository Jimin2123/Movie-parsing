const express = require('express');
const http = require('http');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const {query,movieInfo} = require('./src/DB/DB');

const app = new express();
const server = http.createServer(app);
const cookieSecret = "kjimin2123";

app.set('port',32000);
app.set('views', path.join(__dirname, './src/view'));
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(session({
    resave: false,
    saveUninitialized:false,
    secret:cookieSecret
}));

app.get('/', (req,res) => {
    res.render('main');
});

//유저 정보
app.get('/api/user', (req,res) => {
    if(req.session.user !== undefined) {
        res.json({success:true, user:req.session.user});
    }else {
        res.json({success:false});
    }
});

//로그인
app.post('/api/user', async(req,res) => {
    const {id,pass} = req.body;
    let result = await query('SELECT * FROM users WHERE id = ? AND password = PASSWORD(?)', [id,pass]);
    if(result.length == 0) {
        res.json({msg:'로그인 정보가 바르지 않습니다.', success:false});
    }else {
        req.session.user = result[0];
        res.json({msg:'로그인 성공', success:true, user:result[0]});
    }
});

//로그아웃
app.delete('/api/user', (req,res) => {
    if(req.session.user !== undefined) {
        req.session.user = undefined;
    }
    res.json({success:true, msg:'로그아웃되었습니다.'});
});

//모든 DB영화목록
app.get('/api/movie', async (req,res) => {
    let data = await query('SELECT * FROM movielist ORDER BY date DESC', []);
    res.json({msg:'성공적으로 불러왔습니다.',success:true,data}); 
});

//페이지마다 가져올 영화목록
app.post('/api/movie', async (req,res) => {
    const data = req.body.params;
    let page = data.page * data.per_page;
    let list = await query('SELECT * FROM movielist ORDER BY date DESC LIMIT ?,?',[page,data.per_page]);
    res.json({success:true, list});
});

//영화 View
app.get('/api/movie/view', async(req,res) => {
    let code = req.query.code;
    try{
        let data = await query('SELECT * FROM movielist WHERE code = ?', [code]);
        res.json({msg:'성공적으로 가져왔습니다.', success:true, list:data[0]});
    }catch(err) {
        console.log(err);
        res.status(500).json({msg:'오류 발생',success:false});
    }
});

//영화 파싱
app.get('/api/movie/craw', (req,res) => {
    const {year,page} = req.query;
    movieInfo(req,res,{year,page});
});

//mode: history 초기화
app.get('/*',(req,res) => {
    res.render('main');
});

server.listen(app.get('port'), () => {
    console.log(`서버가 ${app.get('port')}포트에서 구동중입니다.`);
});



