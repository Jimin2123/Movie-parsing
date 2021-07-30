const mysql = require('mysql');
const {Builder, By, Key, until} = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const fs = require('fs');

const con = mysql.createConnection(info);

function query(sql, data){
    return new Promise( (res, rej)=>{
        con.query(sql, data, (err, result)=>{
            if(err) rej(err);
            else res(result);
        });
    });
}

async function movieInfo(req,res,{year,page}) {
    let driver = await new Builder()
        .forBrowser('chrome')
        // .setChromeOptions(new chrome.Options().headless())
        .build();
    
    let list = []; let data = new Object; let idx = 20;
    const regExp = /[\{\}\[\]\/?.,;:|\)*~`!^\-_+<>@\#$%&\\\=\(\'\"]/gi; //특수문자
    try {
        await driver.get(`https://movie.naver.com/movie/sdb/browsing/bmovie.nhn?open=${year}&page=${page}`);
        let elem = await driver.findElement(By.css('.directory_list'));
        for(let i = 1; i <= idx; i++) {
            data = {}; check = '';
            //정보
            let info =  await elem.findElement(By.xpath(`//*[@id="old_content"]/ul/li[${i}]/ul`)).getText();
            data.info = info;
            
            //코드
            let link = await elem.findElement(By.xpath(`//*[@id="old_content"]/ul/li[${i}]/a`)).getAttribute("href");
            data.code = parseInt(link.split("https://movie.naver.com/movie/bi/mi/basic.nhn?code=").join(''));

            //제목
            let text = await elem.findElement(By.xpath(`//*[@id="old_content"]/ul/li[${i}]/a`)).getText();
            data.title = text.split(/ *\([^)]*\) */g).join('').trim();
            let subtitle = text.match(/ *\([^)]*\) */g);
            if(subtitle !== null) data.subtitle = subtitle.join('').split(regExp).join('').trim();
            else data.subtitle = null;

            //장르
            let genre = ['드라마', '판타지', '서부', '공포', '로맨스', '모험', '스릴러', '느와르', '컬트', '다큐멘터리', '코미디', '가족', '미스터리', '전쟁',
            '애니메이션', '범죄', '뮤지컬', 'SF', '액션', '무협', '에로', '서스펜스', '서사', '블랙코미디', '실험', '영화카툰', '영화음악', '공연실황'];
            for(let j = 0; j < genre.length; j++) {
                if(info.indexOf(genre[j]) > -1) 
                    data.genre = info.match(genre[j]).join('');
                else continue;
            }

            //등급
            if(info.indexOf("전체") > -1) data.grade = 7;
            else if(info.indexOf("12세") > -1) data.grade = 12;
            else if(info.indexOf("15세") > -1) data.grade = 15;
            else if(info.indexOf("청소년") > -1) data.grade = 19;
            else data.grade = null;

            list.push(data); 
        }

        //이미지
        for(let i = 0; i < list.length; i++) {
            let check = await query('SELECT * FROM movielist WHERE code = ?',list[i].code);
            if(check.length > 0) continue;
            
            await driver.get(`https://movie.naver.com/movie/bi/mi/basic.nhn?code=${list[i].code}`);
            let movieInfo = await driver.findElement(By.css('.mv_info_area'));
            let path = `public/imgs/${list[i].code}.jpeg`;
            await driver.findElement(By.xpath('//*[@id="content"]/div[1]/div[2]/div[1]')).takeScreenshot().then(
            function(image, err) {
                fs.writeFile(path, image, 'base64', (err) => { if(err != null) return;});
                }
            );
            let day = await driver.findElement(By.xpath('//*[@id="content"]/div[1]/div[2]/div[1]/dl/dd[1]/p')).getText();
            let days = day.match(/\.[0-9]+(\.[0-9]+)*/);

            if(days != null) list[i].date = year + days.splice(0,1).join('').split('.').join('-');
            else list[i].date = year;

            list[i].info = `/img/${list[i].code}.jpeg`
            list[i].image = await movieInfo.findElement(By.css('.poster img')).getAttribute("src");
        }
        
        list.forEach(item => {
            movieDB(item);
        });

        res.json({msg:`영화 ${page}페이지 정보를 DB에 성공적으로 저장하였습니다.`, success:true, list});
        driver.quit();
        return;
    }catch(err) {
        console.log(err);
        res.json({msg:"영화 정보를 가져오지 못했습니다.", success:false});
    }
}

async function movieDB({code,info,title,subtitle,image,grade,genre,date}) {
    try{
        let result = await query('SELECT * FROM movielist WHERE code = ?', [code]);
        if(result.length > 0) {
            return;
        }else {
            let sql = "INSERT INTO movielist(code,info,title,subtitle,image,grade,genre,date) VALUES(?,?,?,?,?,?,?,?)";
            result = await query(sql,[code,info,title,subtitle,image,grade,genre,date]);
        }
        return;
    }catch(err) {
        console.log(err);
        return;
    }
}

module.exports.movieInfo = movieInfo;
module.exports.query = query;
