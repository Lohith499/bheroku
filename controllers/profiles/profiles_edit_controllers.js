var  dbu=require('../../db.js');
var someVar = [];
var list_of_results="";
function editresults(req,res) {


    var noticia = req.body;

    console.log(noticia);

    req.checkBody('username', 'Username field cannot be empty.').notEmpty();
    req.checkBody('username', 'Username must be between 4-15 characters long.').len(4, 30);
    req.checkBody('username', 'Username can only contain letters, numbers, or underscores.').matches(/^[A-Za-z0-9_-]+$/, 'i');

    const errors= req.validationErrors();

    if(errors){
        console.log('errors:'+ JSON.stringify(errors));
        res.render('setup',{title:'Profiles Edit', errors : errors});
        return;
    }


    const username=req.body.username;
    const id=req.query.id;
    const  db=require('../../db.js');
    db.query('Update profiles set name=?,lastModified_By=? where id=?',[username,req.user.user_id,id], function
        (error,results,fields){
        //if(error) throw error;
        if(error){

            console.log('error:'+ error.sqlMessage);
            req.query.id=id;
            req.query.error=error;
            let s1 = require('./profiles_edit_view_controllers');
            s1.edit_view_results(req, res);
            //  res.render('setup',{title:'Users Detail', error : error});
            return;
        }
        console.log(JSON.stringify(results));
        res.redirect('/setup/profiles');
    });
}
module.exports.editresults = editresults;





