const mysql = require('mysql2');
const colors = require('colors');
const key = require('./dbkey.json');

const info = key
const con = mysql.createConnection(info);

function query(sql, data) {
  return new Promise( (res,rej) => {
    con.query(sql,data,(err, result) => {
      if(err) rej(err);
      else res(result);
    });
  });
}

async function moviesDB(data) {
  const {code,title,subtitle,genre,grade,date,image} = data;
  try{
    let result = await query('SELECT * FROM movies WHERE code = ?',[code]);
    //중복 되는거면 취소
    if(result.length > 0) {
      console.error(`${title}`.red);
      return;
    }else {
      console.log(`${title}`.green);
      let sql = `INSERT INTO movies VALUES(?,?,?,?,?,?,?)`;
      result = await query(sql,[code,title,subtitle,genre,grade,date,image]);
    }
  }catch(err) {
    console.log(err);
    return;
  }
}
module.exports.moviesDB = moviesDB;