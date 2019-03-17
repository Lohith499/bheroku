var  dbu=require('../../db.js');
var someVar = [];
var list_of_results="";
var bcrypt=require('bcryptjs');
const saltRound=10;
function pushresults(req,res) {
    let object_id=req.query.id;
    let tablename=req.query.object;
    if(req.query.type==="Custom"){
      tablename=tablename+req.user.organisation_Id;
    }
    //var noticia = req.body;
    let CustomSave=req.body.CustomSave;
    req.user.organisation_Id
    req.user.user_id
    const  db=require('../../db.js');
    let sql= 'select id from customscripts where object_id='+object_id+' AND (organisationId=\''+req.user.organisation_Id+'\' or organisationId=\'\' or organisationId IS NULL)';

    db.query(sql, function
            (error,results,fields){
            if(error) {
                console.log('error:'+ error.sqlMessage);
               // let s1 = require('./objects_edit_view_controllers');
              //  s1.edit_view_results(req, res);
                if(error.sqlMessage.includes("Duplicate")){
                    error.sqlMessage="There is already a Object Field with this name in your Organisation; SQL error message ="+error.sqlMessage
                }
                res.render('error', { title: 'ObjectFields' , messgae : "Error while fetching data from CustomScripts table", id : req.query.id, error : error});
                return;

            }
            if(results.length===0){
                let values='('+object_id+',\''+CustomSave+'\','+req.user.user_id+',\''+req.user.organisation_Id+'\')';
                let sqli="Insert into customscripts (object_id,scriptcode,created_By,organisationId) values "+values+";";
                db.query(sqli,function (err,iresults) {
                   if(err){
                       console.log('error:'+ err.sqlMessage);
                       res.render('error', { title: 'ObjectFields' , message : "Error while Inserting record into Customscript table", id : req.query.id, error : err});
                       return;
                   } else {
                       db.commit(function(err) {
                           if (err) {
                               db.rollback(function () {
                                   res.render('error', { title: 'ObjectFields' , message : "Unable to commit to DB", id : req.query.id, error : err});
                                   return;
                               });
                           }
                           console.log('Transaction Complete.');
                           res.redirect('/setup/objects/details?id='+req.query.id);
                           return;
                       });
                   }
                });

            } else{
                let sqlu='Update customscripts set scriptcode=\''+CustomSave+'\',lastModified_By='+req.user.user_id+' where id='+results[0].id+';';
                db.query(sqlu,function (err,iresults) {
                    if(err){
                        console.log('error:'+ err.sqlMessage);
                        res.render('error', { title: 'ObjectFields' , message : "Error while Updating existing record into Customscript table", id : req.query.id, error : err});
                        return;
                    } else {
                        db.commit(function(err) {
                            if (err) {
                                db.rollback(function () {
                                    res.render('error', { title: 'ObjectFields' , message : "Unable to commit to DB", id : req.query.id, error : err});
                                    return;
                                });
                            }
                            console.log('Transaction Complete.');
                            res.redirect('/setup/objects/details?id='+req.query.id);
                            return;
                        });
                    }
                });
            }
        });
}

module.exports.pushresults = pushresults;





