var  dbu=require('../../db.js');
var someVar = [];
var list_of_results="";
function editresults(req,res) {


    var noticia = req.body;

    console.log(noticia);

    req.checkBody('Profile_Name', 'Profile_Name field cannot be empty.').notEmpty();
    req.checkBody('Profile_Name', 'Profile_Name must be between 4-15 characters long.').len(4, 30);
    req.checkBody('Profile_Name', 'Profile_Name can only contain letters, numbers, or underscores.').matches(/^[A-Za-z0-9_-]+$/, 'i');

    const errors= req.validationErrors();

    if(errors){
        console.log('errors:'+ JSON.stringify(errors));
        res.render('setup',{title:'Profiles Edit', errors : errors});
        return;
    }


    const Profile_Name=req.body.Profile_Name;
    const id=req.query.id;
    const  db=require('../../db.js');
    db.query('Update profiles set Profile_Name=?,lastModified_By=? where id=?',[Profile_Name,req.user.user_id,id], function
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





