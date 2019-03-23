var  dbu=require('../../db.js');
var someVar = [];
var list_of_results="";
var bcrypt=require('bcryptjs');
const saltRound=10;
function pushresults(req,res) {
    console.log("Lookup save controller");
    let object_id=req.query.id;
    let tablename=req.query.object;
    let selected=req.body.lookupselect;
    console.log(typeof  selected);
    let isqlData=[]
    if(typeof(selected)==='string'){
        let c=[req.query.id,req.user.user_id,req.user.organisation_Id,selected];
        isqlData.push(c);
    }else {
        for (let i = 0; i < selected.length; i++) {
            let c = [req.query.id, req.user.user_id, req.user.organisation_Id, selected[i]];
            isqlData.push(c);
        }
    }
    isqlData.push([req.query.id, req.user.user_id, req.user.organisation_Id, 'id']);
    console.log(isqlData);
    const  db=require('../../db.js');
    let delsql='DELETE FROM lookups WHERE lookups.object_id='+req.query.id+' AND lookups.organisationId=\''+req.user.organisation_Id+'\' ';
    console.log(delsql);
    db.query(delsql, function
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
            let sql='Insert into lookups (lookups.object_id, lookups.created_By,lookups.organisationId,lookups.Field_Name)  VALUES ? ;';

        console.log(sql);
            db.query(sql,[isqlData],function (error,resultIn) {
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
                console.log(JSON.stringify(resultIn));
                res.redirect('/setup/objects/details?id='+req.query.id);
                return;
            });
        });
}

module.exports.pushresults = pushresults;





