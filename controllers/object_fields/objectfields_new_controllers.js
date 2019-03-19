var  dbu=require('../../db.js');
var someVar = [];
var list_of_results="";
var bcrypt=require('bcryptjs');
const saltRound=10;
function pushresults(req,res) {

    var items=[];
    let tablename=req.query.object;
    if(req.query.type==="Custom"){
      tablename=tablename+req.user.organisation_Id;
    }
    //var noticia = req.body;
    let selectbasic=req.body.selectbasic;
    let textinput=req.body.textinput
    let listnumber=selectbasic.length;
    let selectlist=req.body.selectlist;
    let enums=req.body.enum;
    if(typeof(req.body.selectbasic)==="string"){
        listnumber=1;
    }
    let j=0;
    for (let i = 0; i < listnumber; i++) {
       let item_row=[];
        item_row.push(req.query.id);
        item_row.push(textinput[j]);
        item_row.push(textinput[j+1]);
        if(typeof(req.body.selectbasic)==="string"){
            item_row.push(selectbasic);
            item_row.push(selectlist);
        }else {
            item_row.push(selectbasic[i]);
            item_row.push(selectlist[i]);
        }
        item_row.push(req.user.organisation_Id);
        item_row.push(req.user.user_id);
        items.push(item_row);
        j=j+2;
    }

    console.log(items);
    const  db=require('../../db.js');
    db.query('INSERT INTO objects_fields(objects_fields.object_id,objects_fields.NAME,objects_fields.field_name,objects_fields.field_type,objects_fields.showinlist,objects_fields.organisationId,objects_fields.created_By) VALUES ?',
        [items], function
        (error,results,fields){
        if(error) {
            console.log('error:'+ error.sqlMessage);
           // let s1 = require('./objects_edit_view_controllers');
          //  s1.edit_view_results(req, res);
            if(error.sqlMessage.includes("Duplicate")){
                error.sqlMessage="There is already a Object Field with this name in your Organisation; SQL error message ="+error.sqlMessage
            }
            res.render('setup', { title: 'ObjectFields' , object : req.query.object, id : req.query.id, error : error});
            return;

        } ;
        let j=0;
        for(let i=0; i<listnumber;i++)
        {
            let colname=items[i][3];
            //BIGINT or SmallTextBox(VARCHAR(50) or TEXT OR LONGTEXT or DATE
            let sql='Alter table '+tablename+' add column '+items[i][2]+' '+colname+' null';

            if(colname==="DOUBLE"){
                sql='Alter table '+tablename+' add column '+items[i][2]+' DOUBLE(12,4) null';

            }else if(colname==="DATETIME") {
                sql='Alter table '+tablename+' add column '+items[i][2]+' '+colname+' null DEFAULT CURRENT_TIMESTAMP';
            }else if(colname==="DATETIMESTAMP"){
                sql='Alter table '+tablename+' add column '+items[i][2]+' TIMESTAMP null DEFAULT CURRENT_TIMESTAMP';
            }
            else if(colname==="ENUM"){
                if (typeof(enums)==='object'){
                sql='Alter table '+tablename+' add column '+items[i][2]+' ENUM('+enums[j]+') null';
                j++;
                } else {
                    sql='Alter table '+tablename+' add column '+items[i][2]+' ENUM('+enums+') null';
                }
            }
           db.query(sql,function (error1,results1,fields1){
               if(error1) {
                   db.rollback(function() {
                       res.render('setup', { title: 'ObjectFields' , object : req.query.object, id : req.query.id, error : error1});
                       return;

                   });
               }
               console.log('Column '+items[i][2]+' added on Table Complete.');
           });
        }
        db.commit(function(err) {
            if (err) {
                db.rollback(function () {
                    res.render('setup', { title: 'ObjectFields' , object : req.query.object, id : req.query.id, error : err});
                    return;
                });
            }
            console.log('Transaction Complete.');
            res.redirect('/setup/objects/details?id='+req.query.id);
            return;
        });

    });
}

module.exports.pushresults = pushresults;





