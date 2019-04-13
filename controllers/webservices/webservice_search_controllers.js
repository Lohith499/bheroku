var  dbu=require('../../db.js');
//var someVar = [];
var list_of_results="";
var bcrypt=require('bcryptjs');
function pushresults(req,res) {
    let headers =req.headers;
    let username=headers["username"];
    let password=headers["password"];
    const  dbs =require('../../db.js');
    let id_searhc=req.url
    dbs.query('SELECT id,password,organisationId,Profile_Name FROM users where username=? ',[username],function (err,results,fields) {
        if(err) {res.status(500).json(
            {
                message : error.sqlMessage,
                error : error,
                title: "Home List"
            });
            return;}
        if(results.length===0){
            res.status(500).json(
                {
                    status: 'Authentication Failure',
                    message : "No User found with this Username and Password"
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
                    let ourl=req.originalUrl.split('/');
                    let objectname=ourl[2];
                    let obj_id='';
                    let id_search='';
                    let table_name='';
                    let cj=0;
                    let searchresults=[];
                    let gettablname='SELECT ob.id,ob.name,ob.TABLE_NAME FROM objects ob\n' +
                        'WHERE ob.NAME=\''+objectname+'\' AND (ob.organisationId=\''+req.user.organisation_Id+'\' or ob.organisationId=\'\' or ob.organisationId IS NULL)';
                    const  db=require('../../db.js');
                    db.query(gettablname,function (error1,results1,fields1){
                        if(error1 || results1.length===0) {
                            res.status(500).json( { "Message": 'No Object Found with name='+objectname });
                            return;
                        }
                        obj_id=results1[0].id;
                        table_name=results1[0].TABLE_NAME;
                        let getfieldsql='select * from objects_fields obf where obf.object_id='+results1[0].id+' AND (obf.organisationId=\''+req.user.organisation_Id+'\' or obf.organisationId=\'\' or obf.organisationId IS NULL) ORDER BY id';
                        db.query(getfieldsql,function (error,fieldresults) {
                            if(error || fieldresults.length===0) {
                                res.status(500).json( { "Message": 'No Object Fields Found for the object='+objectname });
                                return;
                            }
                            let queries=req.query;
                            let qfields_keys=Object.keys(queries);
                            //console.log(JSON.stringify(qfields_keys));
                            let qfields_values=Object.values(queries);
                           // console.log(JSON.stringify(qfields_values));
                            let matchedStatus=true;
                            for(let qi=0;qi<qfields_keys.length;qi++) {
                                let met=false;
                                for(let fi=0;fi<fieldresults.length;fi++){
                                    if(fieldresults[fi]['field_name'].toUpperCase()===qfields_keys[qi].toUpperCase()){
                                        met=true;
                                        break;
                                    }

                                }
                                matchedStatus=matchedStatus&&met;
                            }
                            if(matchedStatus===false){
                                let available_Fields=[];
                                for(let fi=0;fi<fieldresults.length;fi++){
                                    available_Fields.push(fieldresults[fi]['field_name']);
                                }
                                res.status(500).json( {
                                    "Message": 'Object='+objectname+' doesnt has one or many fields sent in request',
                                    "Available Fields" : available_Fields
                                });
                                return;
                            }
                            let cond='';
                            let s_val=[];
                            for(let qi=0;qi<qfields_keys.length;qi++) {
                                let param=qfields_keys[qi];
                                let param_value=qfields_values[qi];
                                param_value=param_value.replace(/%20or%20/g, '');
                                //param_value=param_value.replace(/ /g, '');
                                param_value=param_value.replace(/%20/g, ' ');

                                cond=cond+param+"=?";
                                if(qi!=qfields_keys.length-1){
                                    cond=cond+" and ";
                                }
                                s_val.push(param_value);
                            }
                            console.log(JSON.stringify(s_val));
                            let sql='SELECT t3.*,u.username AS ccreated_By, u1.username AS llastModified_By FROM '+results1[0].TABLE_NAME+' t3 INNER JOIN users u on t3.created_By=u.id LEFT JOIN users u1 ON t3.lastModified_By=u1.username where ';
                            sql=sql+cond+' and ( t3.organisationId=\''+req.user.organisation_Id+'\' or t3.organisationId=\'\' or t3.organisationId IS NULL);';
                            console.log("System   " +sql);
                            db.query(sql,s_val,function
                                (error,results,fields){
                                if(error) {
                                    console.log(JSON.stringify(error));
                                    // let s1 = require('./objects_edit_view_controllers');
                                    //  s1.edit_view_results(req, res);
                                    if(error.sqlMessage.includes("Duplicate")){
                                        error.sqlMessage="There is already a Object with this name in your Organisation"
                                    }
                                    res.status(500).json({title:'Objects New', error : error});
                                    return;
                                }
                                if(results.length===0){
                                    let message="No record found with this ID in this object";
                                    res.status(500).json({title:'Objects New', error : error , message : message});
                                    return;
                                }

                                for(let si=0;si<results.length;si++){
                                    cj=0;
                                    let contentresults=[];
                                    for(let i=0;i<fieldresults.length;i++){
                                        contentresults[cj]=fieldresults[i];
                                        cj=cj+1
                                    }
                                    for(let i=0;i<contentresults.length;i++){
                                        for (let key in results[si]) {
                                            if(key===contentresults[i].field_name ){
                                                contentresults[i].value=results[si][key];
                                            }
                                        }
                                    }
                                    for(let i=0;i<contentresults.length;i++){
                                        for (let key in contentresults[i]){
                                            if(key==='value' || key==='name' || key==='field_name' || key==='type' || key==='field_type' || key==='lookup'){
                                            }else {
                                                delete contentresults[i][key];
                                            }
                                        }
                                    }
                                    searchresults.push({contentresults });
                                }
                                res.json({
                                    record_id: id_search,
                                    'Details': searchresults
                                });
                                return;
                            });
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





