const dal = require('./db')

const getInfo = function(text) {
    if(DEBUG) console.log('in display.dal.js')
    return new Promise(function(resolve,reject){
        const sql = `select * from products where description iLIKE '%'||$1||'%' or name iLIKE '%'||$1||'%' or cast(price as text) iLIKE '%'||$1||'%'`;
dal.query(sql, [text], (err,res)=>{
    if(err){
        //logging
        reject(err)
    }else{
        resolve(res.rows)
    }
})
})
}
module.exports={
    getInfo,
}