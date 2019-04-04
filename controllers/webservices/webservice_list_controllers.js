var  dbu=require('../../db.js');
var bcrypt=require('bcryptjs');
let page='';
let limitr='';
function pushresults(req,res) {
    let headers =req.headers;
    let queries= req.query;
    console.log(JSON.stringify(req.query));
    if(queries.hasOwnProperty('page')) {
        page=queries['page'];
    }
    if(queries.hasOwnProperty('limit')) {
        limitr=queries['limit'];
    }
    let username=headers["username"];
    let password=headers["password"];
    console.log(page+' -- '+limitr);
    const  dbs =require('../../db.js');
    dbs.query('SELECT id,password,organisationId,Profile_Name FROM users where username=? ',[username],function (err,results,fields) {
        if(err) {
            res.render('error',
                {
                    message : error.sqlMessage,
                    error : error,
                    title: "Home List"
                });
            return;
        }
        if(results.length===0){
            res.render('error',
                {
                    message : error.sqlMessage,
                    error : error,
                    title: "Home List"
                });
            return;
        } else {
            const hash =results[0].password.toString();
            bcrypt.compare(password,hash,function (err,response) {
                if(response===true){
                    req.user = {};
                    req.user.user_id=results[0].id;
                    req.user.organisation_Id=results[0].organisationId;
                    req.user.is_Admin=results[0].Profile_Name;
                    let ourl=req.originalUrl.split('/');
                    let objectname=ourl[2];
                    let sql='SELECT obf.field_name,ob.NAME, ob.table_name FROM objects_fields obf\n' +
                        '      INNER JOIN objects ob ON obf.object_id=ob.id \n' +
                        '      LEFT JOIN information_schema.`COLUMNS` ic  on ic.TABLE_NAME=ob.TABLE_NAME AND obf.field_name=ic.COLUMN_NAME \n' +
                        'WHERE ob.NAME=\''+ourl[2]+'\' AND  obf.showinlist=\'Y\' AND'+
                        '     (obf.organisationId=\''+req.user.organisation_Id+'\' or obf.organisationId=\'\' or obf.organisationId IS NULL) ORDER BY obf.id';
                    dbu.query(sql,function(error,fresults){
                        if(error || fresults.length===0){
                            console.log(JSON.stringify(error));
                            if(error){
                                if(error.hasOwnProperty(sqlMessage)){
                                    error.sqlMessage=error.sqlMessage;
                                }else {
                                    error.sqlMessage="Some error occured while fetching the data";
                                }
                                res.render('error',
                                    {
                                        message : error.sqlMessage,
                                        error : error,
                                        title: "Home List"
                                    });
                                return;
                            }else if(fresults.length===0){
                                let message ="No Object with this name has been found in your Organisation";
                                let error={};
                                error.status="Object not found create New Custom object or navigate as per rules defined for each action";
                                res.render('error',
                                    {
                                        message : message,
                                        error : error,
                                        title: "Home List"
                                    });
                                return;
                            }
                        } else {
                            let tablename=fresults[0].table_name;
                            let fsql = '';
                            for (let i=0;i<fresults.length;i++){
                                fsql=fsql+fresults[i].field_name+',';
                            }
                            fsql=fsql.substring(0,fsql.length-1);
                            let sql='SELECT '+fsql+' , \''+objectname+'\' AS tablename FROM '+tablename+ ' where organisationId=\'\' or organisationId IS NULL or organisationId=?';

                            if(queries.hasOwnProperty('page')) {

                                if(queries.hasOwnProperty('limit')) {
                                    sql=sql+' limit '+(parseInt(page-1)*parseInt(limitr))+','+parseInt(limitr);
                                } else {
                                    sql=sql+' limit '+(parseInt(page)*10)+','+10;
                                }
                            }
                            console.log(sql);
                            dbu.query(sql,[req.user.organisation_Id], function(err, results){
                                if(err) {
                                    err.status=err.code;
                                    console.log(JSON.stringify(err));
                                    res.render('error',
                                        {
                                            message : err.sqlMessage,
                                            error : err,
                                            title: "Home List"
                                        });
                                    return;
                                } else {
                                    console.log(JSON.stringify(results))
                                    res.json({
                                        'objectname' : objectname,
                                        'ListofResults': results
                                    });
                                    return;
                                }
                            });

                        }
                    });
                }else {
                    console.log('hash fail');
                    res.json('{Status : "Authentication Failed"}');
                    return;
                }
            });
        }
    });
}

module.exports.pushresults = pushresults;





