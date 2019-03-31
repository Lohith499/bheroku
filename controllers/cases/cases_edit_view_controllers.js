var  dbu=require('../../db.js');
var someVar = [];
var list_of_results="";
var bcrypt=require('bcryptjs');
const saltRound=10;

function pushresults(req,res) {
    console.log('Custom Edit View Controller');
    let standardFields=[];
    let customFields=[];
    let tasks =[];
    let customscript='';
    console.log(JSON.stringify(req.query));
    let fid= req.query.id;
    let ourl=req.originalUrl.split('/');
    let tablename=ourl[2].toLowerCase();
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
                error.sqlMessage="There is already a Object with this name in your Organisation"
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
        }
        let tablenamesql='select table_name from objects where name=\''+ourl[2]+'\'';
        db.query(tablenamesql,function (err,resultst) {
            if(error) {
                console.log('error:'+ error.sqlMessage);
                if(error.sqlMessage.includes("Duplicate")){
                    error.sqlMessage="There is already a Object with this name in your Organisation"
                }
                res.render('error',{title:'Home_LoggedIn', error : error});
                return;
            }

            let fetchrecordsql='Select * from '+resultst[0].table_name+' obf where obf.id='+fid+' AND (obf.organisationId=\''+req.user.organisation_Id+'\' or obf.organisationId=\'\' or obf.organisationId IS NULL);'
            db.query(fetchrecordsql,function (err,resultsValues) {
                if(error) {
                    console.log('error:'+ error.sqlMessage);
                    if(error.sqlMessage.includes("Duplicate")){
                        error.sqlMessage="There is already a Object with this name in your Organisation"
                    }
                    res.render('error',{title:'Home_LoggedIn', error : error});
                    return;
                }
                let columns=Object.keys(resultsValues[0]);
                let columnValues=Object.values(resultsValues[0]);
                for (let i=0;i<columns.length;i++){
                    for(let j=0;j<results.length;j++){

                        if(results[j].field_name===columns[i]){
                            if(results[j].field_type.toUpperCase()==='DATE'){
                                console.log(columnValues[i]);
                                columnValues[i]=JSON.stringify(columnValues[i]).substring(1,11);
                                console.log(columnValues[i]);
                            }
                            if(results[j].field_type.toUpperCase()==='DATETIMESTAMP' || results[j].field_type.toUpperCase()==='TIMESTAMP' || results[j].field_type.toUpperCase()==='DATETIME'){
                                console.log( columnValues[i]);
                                columnValues[i]=JSON.stringify(columnValues[i]).substring(1,17);
                            }
                            results[j].value=columnValues[i];
                        }
                    }
                }
                for(let i=0; i<results.length;i++) {
                    if(results[i].type==='Standard'){
                        standardFields.push(results[i]);
                    } else {
                        customFields.push(results[i]);
                    }
                }
                let cssql='SELECT ob.NAME,css.scriptcode FROM customscripts css INNER JOIN objects ob ON ob.id=css.object_id WHERE ' +
                    'ob.NAME=\''+ourl[2]+'\';';
                db.query(cssql,function (errs,csresults,fields) {
                    if(errs){
                        console.log('error:'+ errs.sqlMessage);
                        res.render('error', { title: 'ObjectFields' , message : "Error while fetching to see if there is record from Customscript table fo this object", id : req.query.id, error : errs});
                        return;
                    }else if(csresults) {
                        if(csresults.length>0){
                            for(let i=0;i<csresults.length;i++){
                                customscript=csresults[i].scriptcode;
                            }
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
                    let tasql='Select * from tasks obf where obf.Case_Number='+req.query.id+' and (obf.organisationId=\''+req.user.organisation_Id+'\' or obf.organisationId=\'\' or obf.organisationId IS NULL)';
                    db.query(tasql,function(error,taskresults){
                        if(error){
                            console.log('error:'+ errs.sqlMessage);
                            res.render('error', { title: 'CaseEdit Page' , message : "Error while fetching tasks records for the case number="+req.query.id, id : req.query.id, error : errs});
                            return;
                        }
                        //if(taskresults){
                        if(true){
                            if(taskresults.length>0){
                                for(let i=0;i<taskresults.length;i++){
                                    tasks.push(taskresults[i]);
                                }
                                standardFields=[];
                                standardFields=filtered;
                                console.log('standardFields');
                                console.log(JSON.stringify(standardFields));
                                console.log('Custom');
                                console.log(JSON.stringify(customFields));
                                console.log('tasks');
                                console.log(JSON.stringify(tasks));
                                res.render('home_Loggedin', {
                                    title : 'Cases Edit' ,
                                    standard_menu: req.user.standard_menu,
                                    custom_menu:req.user.custom_menu,
                                    standardFields : standardFields,
                                    customFields : customFields,
                                    customscript : customscript,
                                    tablename : tablename,
                                    tasks : tasks,
                                    id:fid,
                                    objectname : objectname
                                });
                                return;
                            }
                        } else {
                            standardFields=[];
                            standardFields=filtered;
                            console.log('standardFields');
                            console.log(JSON.stringify(standardFields));
                            console.log('Custom');
                            console.log(JSON.stringify(customFields));
                            res.render('home_Loggedin', {
                                title : 'Cases Edit' ,
                                standard_menu: req.user.standard_menu,
                                custom_menu:req.user.custom_menu,
                                standardFields : standardFields,
                                customFields : customFields,
                                customscript : customscript,
                                tablename : tablename,
                                tasks : tasks,
                                id:fid,
                                objectname : objectname
                            });
                            return;
                        }


                    });
                    //Getting custom script

                });
            });
        });
    });
}

module.exports.pushresults = pushresults;





