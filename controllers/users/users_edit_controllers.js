var  dbu=require('../../db.js');
var someVar = [];
var list_of_results="";
function editresults(req,res) {


    var noticia = req.body;

    console.log(noticia);

    req.checkBody('username', 'Username field cannot be empty.').notEmpty();
    req.checkBody('username', 'Username must be between 4-15 characters long.').len(4, 15);
    req.checkBody('email', 'The email you entered is invalid, please try again.').isEmail();
    req.checkBody('email', 'Email address must be between 4-100 characters long, please try again.').len(4, 100);
   // Additional validation to ensure username is alphanumeric with underscores and dashes
    req.checkBody('username', 'Username can only contain letters, numbers, or underscores.').matches(/^[A-Za-z0-9_-]+$/, 'i');

    const errors= req.validationErrors();

    if(errors){
        console.log('errors:'+ JSON.stringify(errors));
        res.render('setup',{title:'Users Edit', errors : errors});
        return;
    }


    const username=req.body.username;
    const email=req.body.email;
    const id=req.query.id;
    const recordId=req.body.recordId;
    const orgId=req.user.organisation_Id;
    const  db=require('../../db.js');
        db.query('Update users set username=?, email=? , lastModified_By=? where id=?',[username,email,req.user.user_id,id], function
            (error,results,fields){
            //if(error) throw error;
            if(error){

                console.log('error:'+ error.sqlMessage);
                req.query.id=id;
                req.query.error=error;
                let s1 = require('./users_edit_view_controllers');
                s1.edit_view_results(req, res);
              //  res.render('setup',{title:'Users Detail', error : error});
                return;
            }
            console.log(JSON.stringify(results));
            res.redirect('/setup/bUsers');
         });
}
module.exports.editresults = editresults;





