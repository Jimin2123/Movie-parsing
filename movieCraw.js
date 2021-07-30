const request = require('request');
const iconv = require('iconv-lite');
const charset = require('charset');
const cheerio = require('cheerio');
// const DB = require('./DB');

const regExp = /[\{\}\[\]\/?.,;:|\)*~`!^\-_+<>@\#$%&\\\=\(\'\"]/gi; //특수문자

main(2019);

async function main(year) {
  let page = 1;

  while(true) {
    const {data, lastPage} = await getList(year,page);
    for(let i = 0; i < data.length; i++) {
      if(data[i].genre == '에로' && data[i].grade == 19) {
        continue;
      }
      request({
        method: "GET",
        uri: `https://movie.naver.com/movie/bi/mi/basic.nhn?code=${data[i].code}`,
        headers: { "User-Agent": "Mozilla/5.0" },
        encoding: null
      },(err,res,body) => {
        const $ = decoding(res,body);

        const poster = $('.mv_info_area').children('.poster').find('img') ;
        if(poster != undefined) {
          let image = poster.attr("src")
          data[i].image = image;
        }else {
          poster = null;
        }
        // console.log(data[i])
        // DB.moviesDB(data[i]);
      });
    }
    if(lastPage == true) {
      console.log(data.length)
      // DB.end();
      break;
    }
    page++;
  }
}

function getList(year,page) {
  const info = {
    method: "GET",
    uri: `https://movie.naver.com/movie/sdb/browsing/bmovie.nhn?open=${year}&page=${page}`,
    headers: { "User-Agent": "Mozilla/5.0" },
    encoding: null
  }
  return new Promise((resolve,reject) => {
    request(info,(err,res,body) => {
      if(!err && res.statusCode == 200) {
        const $ = decoding(res,body);
        let lastPage = false;

        const data = $('ul.directory_list').children('li')
          .map((idx,elem) => {
            const href = elem.children[1].attribs.href;
            const code = parseInt(href.split('/movie/bi/mi/basic.naver?code=').join(''));
            let title = elem.children[1].lastChild.data;
            let subtitle = title.match(/ *\([^)]*\) */g);
            title = title.split(/ *\([^)]*\) */g).join('').trim();
            if(subtitle !== null) {
              subtitle = subtitle.join('').split(regExp).join('').trim();
            }

            let detail = String($(elem).find('.detail').text().trim());
            const grade = changeGrade(detail);
            const genre = checkGenre(detail);
            let date = detail.replace(/\./gi,'-').replace(/[^0-9\-]/g,'').match(/([0-9]{4})-([0-9]{1,2})-([0-9]{1,2})/);

            if(date != null) {
              date = parseInt(date[0].replace(/[\-]/g,''))
            }else { date = year }

            const obj = {code, title, subtitle, grade, genre, date}
            return [obj];
          });

          const cnt = $("td.next");
          if(cnt[0] == undefined) {
            lastPage = true;
          }
          resolve({data,lastPage});
      }else {
        reject(err);
      }
    });
  });
}

function decoding(res, body) {
  const enc = charset(res.headers, body) // 해당 사이트의 charset값을 획득
  const decoded = iconv.decode(body, enc) // 획득한 charset값으로 body를 디코딩
  const $ = cheerio.load(decoded);

  return $;
}

function checkGenre(detail) {
  const genres = ['드라마', '판타지', '서부', '공포', '멜로/애정/로맨스', '모험', '스릴러', '느와르', '컬트', '다큐멘터리', '코미디', '가족', '미스터리', '전쟁',
    '애니메이션', '범죄', '뮤지컬', 'SF', '액션', '무협', '에로', '서스펜스', '서사', '블랙코미디', '실험', '영화카툰', '영화음악', '공연실황']
  let genre = null;

  for (let i = 0; i < genres.length; i++) {
    if (detail.indexOf(genres[i]) > -1) {
      genre = genres[i];
    }
  }

  return genre;
}

function changeGrade(detail) {
  const grades = ['전체', '12세', '15세', '청소년'];
  let item = null;

  for (let grade in grades) {
    if (detail.indexOf(grades[grade]) > -1) {
      const gradeIdx = [7, 12, 15, 19]
      item = gradeIdx[grade];
    }
  }
  return item;
}