var  dbu=require('../../db.js');
var someVar = [];
var list_of_results="";
var bcrypt=require('bcryptjs');
const saltRound=10;
function pushresults(req,res) {


    var noticia = req.body;

    console.log(noticia);

    req.checkBody('objectname', 'Username field cannot be empty.').notEmpty();
    req.checkBody('objectname', 'Username must be between 4-30 characters long.').len(4, 30);

// Additional validation to ensure username is alphanumeric with underscores and dashes
    req.checkBody('objectname', 'Username can only contain letters, numbers, or underscores.').matches(/^[A-Za-z0-9_-]+$/, 'i');

    const errors= req.validationErrors();

    if(errors){
        console.log('errors:'+ JSON.stringify(errors));
        res.render('setup',{title:'Objects New', errors : errors});
        return;
    }

    const objectname=req.body.objectname;
    console.log('requet user id = '+req.user.user_id);
    let table_name=objectname+req.user.organisation_Id;
    const  db=require('../../db.js');
        db.query('INSERT INTO objects (name,table_name,organisationId,type,created_By) VALUES (?,?,?,"Custom",?)',[objectname,table_name,req.user.organisation_Id,req.user.user_id], function
            (error,results,fields){
            if(error) {
                console.log('error:'+ error.sqlMessage);
               // let s1 = require('./objects_edit_view_controllers');
              //  s1.edit_view_results(req, res);
                if(error.sqlMessage.includes("Duplicate")){
                    error.sqlMessage="There is already a Object with this name in your Organisation"
                }
                res.render('setup',{title:'Objects New', error : error});
                return;

            }
            let sql ='CREATE TABLE '+table_name+'(' +
                'id INT(11) NOT NULL AUTO_INCREMENT,' +
                'created_Date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,' +
                'created_By INT(11) NULL DEFAULT NULL,' +
                'lastModified_Date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,' +
                'lastModified_By VARCHAR(30) NULL DEFAULT NULL,' +
                'organisationId VARCHAR(30) NOT NULL,' +
                'PRIMARY KEY (id)' +
                ')' +
                'ENGINE=InnoDB' +
                ';'
           let ob_fields=[ ['id','Y','id','int','Standard'],
               ['created_Date','N','created_Date','TIMESTAMP','Standard'] ,
               ['created_By','N','created_By','int','Standard'] ,
               ['lastModified_Date','N','lastModified_Date','TIMESTAMP','Standard'],
               ['lastModified_By','N','lastModified_By','VARCHAR','Standard'],
               ['organisationId','N','organisationId','VARCHAR','Standard']
           ];
            db.query(sql,function (error1,results1,fields){
                if(error1) {
                    db.rollback(function() {
                        res.render('setup', { title: 'Objects' , object : req.query.object, id : req.query.id, error : error});
                        return;

                    });
                }

               for (let i=0;i<6;i++){
                   ob_fields[i].push(results.insertId);
                   ob_fields[i].push(req.user.user_id);
                   ob_fields[i].push(req.user.organisation_Id);
               }
                console.log(JSON.stringify(results));
                console.log(results.insertId);

                let sql_obf='INSERT INTO objects_fields (NAME,showinlist,field_name,field_type,type,object_id,created_By,organisationId)  VALUES ?';
               // for(let i=0;i<6;i++){
                    db.query(sql_obf,[ob_fields],function (error_obf,results_obf) {
                        if(error_obf) {
                            db.rollback(function() {
                                res.render('setup', { title: 'Objects' , object : req.query.object, id : req.query.id, error : error});
                                return;

                            });
                        }
                        console.log(JSON.stringify(results_obf));
                    });
              //  }
            });

            const user_id = results.insertId;
            console.log(results.insertId);
            res.redirect('/setup/objects');
            return;
        });
}

module.exports.pushresults = pushresults;





