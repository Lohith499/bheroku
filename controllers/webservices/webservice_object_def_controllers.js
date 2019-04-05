var  dbu=require('../../db.js');
var someVar = [];
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
                    let ovlaues=[req.user.user_id,req.user.organisation_Id];
                    let ourl=req.originalUrl.split('/');
                    let objectname=ourl[2];
                    let obj_id='';
                    let id_search='';
                    if(ourl.length==5){
                        id_search=ourl[4];
                        id_search=id_search.replace(/%20or%20/g, '');
                        id_search=id_search.replace(/ /g, '');
                        id_search=id_search.replace(/%20/g, '');
                        id_search=id_search.replace(/[~`!@#$%^&()_={}[\]:;,.<>+\/?-]/g, '');
                    }else {
                        res.status(500).json({
                                error: "Enter only Record id after details/ "
                            });
                        return;
                    }
                    let table_name='';
                    let contentresults =[];
                    let cj=0;
                    let logresult={};
                    let fresults=[];
                    let lookupObjects=[];
                    let lookupTables=[];
                    let lookupresults={};
                    let gettablname='SELECT ob.id,ob.name,ob.TABLE_NAME,ob.type FROM objects ob\n' +
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



                            for(let i=0;i<fieldresults.length;i++){
                                for (let key in fieldresults[i]){
                                    if(key==='showinlist' || key==='name' || key==='field_name' || key==='type' || key==='field_type' || key==='lookup'){
                                    }else {
                                        delete fieldresults[i][key];
                                    }
                                }
                            }
                            for(let i=0;i<fieldresults.length;i++){
                                if(!(fieldresults[i].field_name==='organisationId' || fieldresults[i].field_name==='id' || fieldresults[i].field_name==='lastModified_By' || fieldresults[i].field_name==='lastModified_Date' || fieldresults[i].field_name==='created_By' || fieldresults[i].field_name==='created_Date')){
                                    fresults.push(fieldresults[i]);
                                }
                            }
                            res.json({
                                'object_name':results1[0].name,
                                'object_type' : results1[0].type,
                                'field_details': fresults
                            });
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





