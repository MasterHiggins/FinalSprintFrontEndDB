const dal = require("./db");

async function getLogin(){
    let sql = 'select * from public.users'
    try {
        if(DEBUG)console.log("in get login")
        let res = await dal.query(sql,[])
        return res.rows;
    } catch (error) {
        console.log(error)
    }
}

async function getLoginByUsername(username){
    let sql = `select * from public.users where username = $1`
    try {
        if(DEBUG)console.log("in get login by username")
        let results = await dal.query(sql,[username])
        return results.rows[0];
    } catch (error) {
        console.log(error)
    }
}
async function addUser(username,email,password){
    let sql = 'insert into public.users(username, email, password) values ($1, $2, $3) returning user_id'
    try {
        if(DEBUG)console.log("in add user")
        let res = await dal.query(sql,[username,email,password])
        return res.rows[0].user_id;
    } catch (error) {
        if(error.code === '23505')
            return error
        console.log(error)
    }
}


module.exports = {
    getLogin,
    getLoginByUsername,
    addUser,
  }