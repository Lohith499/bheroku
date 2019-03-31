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
        if(err) {
            res.json('{status : "No User found with this name"}');
            return;
        }
        if(results.length===0){
            res.json('{status : "No User found with this name"}');
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

                    let standardFields=[];
                    let customFields=[];
                    let customscript='';
                    let ourl=req.originalUrl.split('/');
                    let tablename=ourl[2];
                    let sql= 'SELECT obf.NAME,obf.field_name,obf.type,obf.field_type, obf.organisationId,obf.lookup,ob.name,ob.table_name,ic.COLUMN_TYPE FROM objects_fields obf ' +
                        'INNER JOIN objects ob ON obf.object_id=ob.id ' +
                        'LEFT JOIN information_schema.`COLUMNS` ic ON ic.DATA_TYPE=\'enum\' AND ic.TABLE_NAME=ob.TABLE_NAME AND obf.field_name=ic.COLUMN_NAME ' +
                        'WHERE ob.NAME=\''+ourl[2]+'\' AND ' +
                        '(obf.organisationId=\''+req.user.organisation_Id+'\' or obf.organisationId=\'\' or obf.organisationId IS NULL) ' +
                        'ORDER BY obf.id';
                    const  db=require('../../db.js');
                    db.query(sql, function
                        (error,results,fields){
                        if(error) {
                            console.log('error:'+ error.sqlMessage);
                            if(error.sqlMessage.includes("Duplicate")){
                                error.sqlMessage="There is no Object with this name in your Organisation"
                            }
                            res.render('error',{title:'Home_LoggedIn', error : error});
                            return;
                        }
                        tablename=results[0].table_name;
                        let objectname=results[0].name;

                        for(let i=0; i<results.length;i++) {
                            if(String(results[i].COLUMN_TYPE).includes('enum')) {
                                let s=results[i].COLUMN_TYPE;
                                s=s.substring(5, s.length-1).split(",")
                                let v =[];
                                for (let i=0;i<s.length;i++){
                                    v.push(s[i].substring(1,s[i].length-1))
                                }
                                results[i].COLUMN_TYPE=v;
                            }
                            results[i].value='';
                        }
                        for(let i=0; i<results.length;i++) {
                            if(results[i].type==='Standard'){
                                standardFields.push(results[i]);
                            } else {
                                customFields.push(results[i]);
                            }
                        }


                        let filtered = standardFields.filter(function(value, index, arr){
                            if (value.field_name==='id'
                                || value.field_name==='created_Date'
                                || value.field_name==='created_By'
                                || value.field_name==='lastModified_Date'
                                || value.field_name==='lastModified_By'
                                || value.field_name==='organisationId'
                            ){
                                return false;
                            } else {
                                return true;
                            }
                        });
                        //Getting custom script
                        standardFields=[];
                        standardFields=filtered;
                        let cssql='SELECT ob.NAME,css.scriptcode FROM customscripts css INNER JOIN objects ob ON ob.id=css.object_id WHERE ' +
                            'ob.NAME=\''+ourl[2]+'\' and (css.organisationId=\''+req.user.organisation_Id+'\' or css.organisationId=\'\' or css.organisationId IS NULL);';
                        console.log('customscript sql='+cssql);
                        db.query(cssql,function (errs,csresults,fields) {
                            if(errs){
                                console.log('error:'+ errs.sqlMessage);
                                res.render('error', { title: 'ObjectFields' , message : "Error while fetching to see if there is record from Customscript table fo this object", id : req.query.id, error : errs});
                                return;
                            }else if(csresults.length>0) {
                                for(let i=0;i<csresults.length;i++){
                                    customscript=csresults[i].scriptcode;
                                }
                            }
                            res.json({
                                'objectname' : objectname,
                                'standardFields' : standardFields,
                                'customFields' : customFields,
                                'customscript' : customscript,

                            });
                            return;
                        });
                    });
                    // res.json("{user_id: "+results[0].id+", organisation_Id : "+results[0].organisationId+", is_Admin : "+results[0].Profile_Name+" }");
                    //return;
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





