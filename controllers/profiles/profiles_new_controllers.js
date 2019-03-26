var  dbu=require('../../db.js');
var someVar = [];
var list_of_results="";
var bcrypt=require('bcryptjs');
const saltRound=10;
function pushresults(req,res) {


    var noticia = req.body;

    console.log(noticia);

    req.checkBody('profile_Name', 'Username field cannot be empty.').notEmpty();
    req.checkBody('profile_Name', 'Username must be between 4-30 characters long.').len(4, 30);

// Additional validation to ensure username is alphanumeric with underscores and dashes
    req.checkBody('profile_Name', 'Username can only contain letters, numbers, or underscores.').matches(/^[A-Za-z0-9_-]+$/, 'i');

    const errors= req.validationErrors();

    if(errors){
        console.log('errors:'+ JSON.stringify(errors));
        res.render('setup',{title:'Profiles New', errors : errors});
        return;
    }

    const profilename=req.body.profilename;
    console.log('requet user id = '+req.user.user_id);
    const  db=require('../../db.js');
        db.query('INSERT INTO profiles (Profile_Name,organisationId,type,created_By) VALUES (?,?,"Custom",?)',[profilename,req.user.organisation_Id,req.user.user_id], function
            (error,results,fields){
            if(error) {
                console.log('error:'+ error.sqlMessage);
               // let s1 = require('./profiles_edit_view_controllers');
              //  s1.edit_view_results(req, res);
                if(error.sqlMessage.includes("Duplicate")){
                    error.sqlMessage="There is already a profile with this name in your Organisation"
                }
                res.render('setup',{title:'Profiles New', error : error});
                return;

            } ;
            console.log(JSON.stringify(results));
            const user_id = results.insertId;
            console.log(results.insertId);
            res.redirect('/setup/profiles');

        });
}

module.exports.pushresults = pushresults;





