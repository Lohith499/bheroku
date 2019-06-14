
var  dbu=require('../../db.js');

var someVar = [];
var list_of_results="";
var bcrypt=require('bcrypt');

function pushresults(req,res) {
    let headers =req.headers;
    let username="Testing1";
    let password="Qwerty1$";
    const  dbs =require('../../db.js');
    let authentication = new Promise( (resolve,reject)=>{
        dbs.query('SELECT id,password,organisationId,Profile_Name FROM users where username=? ',[username],function (err,results,fields) {
        if(err) {
            reject(err);
        }
        if(results.length===0){
            reject(err);
        } else {
             const hash =results[0].password.toString();
              bcrypt.compare(password,hash,function (err,response) {
                if(response===true){
                    req.user ={};
                    req.user.user_id=results[0].id;
                    req.user.organisation_Id=results[0].organisationId;
                    req.user.is_Admin=results[0].Profile_Name;
                    console.log('authentication pass');
                    resolve(req);
                }
                else {
                  reject("username and password not matched");
                }
              });
            }

        });
    });
//Authentication Promise 
    authentication.then( (results)=> {
      console.log("Authentication Pass" + JSON.stringify(results));
      let ourl=req.originalUrl.split('/');
      let objectname=ourl[2];
      console.log(objectname);
      let sql='SELECT obf.field_name,ob.NAME, ob.table_name FROM objects_fields obf\n' +
          '      INNER JOIN objects ob ON obf.object_id=ob.id \n' +
          '      LEFT JOIN information_schema.`COLUMNS` ic  on ic.TABLE_NAME=ob.TABLE_NAME AND obf.field_name=ic.COLUMN_NAME \n' +
          'WHERE ob.NAME=\''+ourl[2]+'\' AND  obf.showinlist=\'Y\' AND'+
          '     (obf.organisationId=\''+req.user.organisation_Id+'\' or obf.organisationId=\'\' or obf.organisationId IS NULL) ORDER BY obf.id';

          let objectDetails= new Promise( (resolve,reject)=>{
              dbu.query(sql,function(error,fresults){
                        if(error || fresults.length===0){
                            if(error){
                                if(error.hasOwnProperty(sqlMessage)){
                                    error.status=error.sqlMessage;
                                }else {
                                    error.status="Some error occured while fetching the data";
                                }
                                reject(error);
                                return;
                            } else if(fresults.length===0){
                                let message ="No Object with this name has been found in your Organisation";
                                let error={};
                                error.status="Object not found create New Custom object or navigate as per rules defined for each action";
                                reject(error);
                                return;
                            }
                        } else {
                              resolve(fresults);
                        }
              });
          });

          objectDetails.then( (fresults)=> {
                            let tablename=fresults[0].table_name;
                            let fsql = '';
                            for (let i=0;i<fresults.length;i++){
                                fsql=fsql+fresults[i].field_name+',';
                            }
                            fsql=fsql.substring(0,fsql.length-1);
                            let sql='SELECT '+fsql+' , \''+objectname+'\' AS tablename FROM '+tablename+ ' where organisationId=\'\' or organisationId IS NULL or organisationId=?';
                            console.log(sql);
                            dbu.query(sql,[req.user.organisation_Id], function(err, results){
                                if(err) {
                                    err.status=err.code;
                                    console.log(JSON.stringify(err));
                                    return;
                                } else {
                                    console.log(JSON.stringify(results))
                                    return;
                                }
                            });


           }).catch((err)=>{
             console.log(err.status);
           });         
    }).catch( (err)=>{
      console.log(err);
    });
}


module.exports.pushresults = pushresults;
