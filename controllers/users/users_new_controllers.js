var  dbu=require('../../db.js');
var someVar = [];
var list_of_results="";
var bcrypt=require('bcryptjs');
const saltRound=10;
function pushresults(req,res) {


    var noticia = req.body;

    console.log(noticia);

    req.checkBody('username', 'Username field cannot be empty.').notEmpty();
    req.checkBody('username', 'Username must be between 4-15 characters long.').len(4, 15);
    req.checkBody('email', 'The email you entered is invalid, please try again.').isEmail();
    req.checkBody('email', 'Email address must be between 4-100 characters long, please try again.').len(4, 100);
    req.checkBody('password', 'Password must be between 8-100 characters long.').len(8, 100);
    req.checkBody("password", "Password must include one lowercase character, one uppercase character, a number, and a special character.").matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?!.* )(?=.*[^a-zA-Z0-9]).{8,}$/, "i");
    req.checkBody('passwordMatch', 'Password must be between 8-100 characters long.').len(8, 100);
    req.checkBody('passwordMatch', 'Passwords do not match, please try again.').equals(req.body.password);

// Additional validation to ensure username is alphanumeric with underscores and dashes
    req.checkBody('username', 'Username can only contain letters, numbers, or underscores.').matches(/^[A-Za-z0-9_-]+$/, 'i');

    const errors= req.validationErrors();

    if(errors){
        console.log('errors:'+ JSON.stringify(errors));
        res.render('setup',{title:'Users New', errors : errors});
        return;
    }

    const username=req.body.username;
    const password=req.body.password;
    const email=req.body.email;
    const  db=require('../../db.js');
    bcrypt.hash(password,saltRound,function (err,hash) {
        db.query('INSERT INTO users (username,email,password,created_By,organisationId) VALUES (?,?,?,?,?)',[username,email,hash,req.user.user_id,req.user.organisation_Id], function
            (error,results,fields){
            if(error) {
                console.log('error:'+ error.sqlMessage);
                if(error.sqlMessage.includes("Duplicate")){
                    error.sqlMessage="There is a record already exists with this Username or Email in your Organisation"
                }
               // let s1 = require('./users_edit_new_controllers');
               // s1.edit_view_results(req, res);
                res.render('setup',{title:'Users New', error : error});
                return;
            };
            console.log(JSON.stringify(results));
            const user_id = results.insertId;
            console.log('registered userid='+user_id);
            //let orgid=req.user.organisation_Id;
           // db.query('call Update_Organisation_Id(?,?)',[orgid,user_id], function (error1,results1) {
           //     if(error1) throw error1;
          //      console.log('updating procedure'+orgid+" and  "+user_id);
          //      console.log(JSON.stringify(results1));
                res.redirect('/setup/bUsers');
          //  });
        });
    });
}

module.exports.pushresults = pushresults;





