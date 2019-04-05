var  dbu=require('../../db.js');
var someVar = [];
var list_of_results="";
var bcrypt=require('bcryptjs');
function pushresults(req,res) {
    let headers =req.headers;
    let username=headers["username"];
    let password=headers["password"];
    const  dbs =require('../../db.js');
    dbs.query('SELECT id,password,organisationId,Profile_Name FROM users where username=? ',[username],function (err,results,fields) {
        if(err) {res.render('error',
            {
                message : error.sqlMessage,
                error : error,
                title: "Home List"
            });
            return;}
        if(results.length===0){
            res.render('error',
                {
                    message : error.sqlMessage,
                    error : error,
                    title: "Home List"
                });
            return;
        } else {
            console.log(results[0].password.toString());
            const hash =results[0].password.toString();
            bcrypt.compare(password,hash,function (err,response) {
                if(response===true){
                    console.log('hash pass');
                    req.user = {};
                    req.user.user_id=results[0].id;
                    req.user.organisation_Id=results[0].organisationId;
                    req.user.is_Admin=results[0].Profile_Name;
                    console.log(typeof headers);
                    console.log(JSON.stringify(headers));
                   // delete headers.username;
                   // delete headers.password;
                    console.log("***********Custom new view controller*******");
                   console.log(req.body);
                    let okeys="created_By,organisationId";
                    let ovlaues=[req.user.user_id,req.user.organisation_Id];
                    let pvalues="?,?";
                    for (const key of Object.keys(req.body)) {
                        okeys=okeys+","+key;
                        ovlaues.push(req.body[key]);
                        pvalues=pvalues+',?';
                    }
                    let ourl=req.originalUrl.split('/');
                    let objectname=ourl[2];
                    let gettablname='SELECT ob.name,ob.TABLE_NAME FROM objects ob\n' +
                        'WHERE ob.NAME=\''+objectname+'\' AND (ob.organisationId=\''+req.user.organisation_Id+'\' or ob.organisationId=\'\' or ob.organisationId IS NULL)';

                    const  db=require('../../db.js');
                    db.query(gettablname,function (error1,results1,fields1){
                        if(error1) {
                            db.rollback(function() {
                                res.render('error', { title: 'No Table Found' , object : req.query.object, id : req.query.id, error : error1});
                                return;

                            });
                        }
                        if(results1.length===0) {
                            db.rollback(function() {
                                let error={};
                                error.message ='No Object has been found with this name';
                                res.render('error', { title: 'No Table Found' , object : req.query.object, id : req.query.id, error : error });
                                return;

                            });
                        }

                        let sql='INSERT INTO '+results1[0].TABLE_NAME+' ('+okeys+') VALUES ('+pvalues+')';
                        db.query(sql,ovlaues, function
                            (error,results,fields){
                            if(error) {
                                console.log('error:'+ error.sqlMessage);
                                // let s1 = require('./objects_edit_view_controllers');
                                //  s1.edit_view_results(req, res);
                                if(error.sqlMessage.includes("Duplicate")){
                                    error.sqlMessage="There is already a Object w`ith this name in your Organisation"
                                }
                                res.render('error',{title:'Objects New', error : error});
                                return;

                            }
                            console.log(JSON.stringify(results));
                            const user_id = results.insertId;
                            console.log(results.insertId);
                            res.redirect('/c/'+objectname+"/details?id="+results.insertId);
                            return;
                        });
                    });
                    // res.json("{user_id: "+results[0].id+", organisation_Id : "+results[0].organisationId+", is_Admin : "+results[0].Profile_Name+" }");
                    return;
                }else {
                    console.log('hash fail');
                    res.status(500).json(
                        {
                            status: 'Authentication Failure',
                            message : "No User found with this Username and Password"
                        });
                    return;
                }
            });
        }
    });
}

module.exports.pushresults = pushresults;





