var  dbu=require('../../db.js');
var someVar = [];
var list_of_results="";
var bcrypt=require('bcryptjs');
const saltRound=10;

function pushresults(req,res) {
    console.log('Custom Edit View Controller');
    let standardFields=[];
    let customFields=[];
    let customscript='';
    let lookupObjects=[];
    let lookupTables=[];
    let lookupresults={};
    let k1="pp";
    let obj_id=req.query.id;
    console.log(JSON.stringify(req.query));
    let fid= req.query.id;
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
                    'ob.NAME=\''+ourl[2]+'\' and (css.organisationId=\''+req.user.organisation_Id+'\' or css.organisationId=\'\' or css.organisationId IS NULL);';
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
                    //Getting custom script
                    standardFields=[];
                    standardFields=filtered;
                    console.log('standardFields');
                    console.log(JSON.stringify(standardFields));
                    console.log('Custom');
                    console.log(JSON.stringify(customFields));




                    //Lookup data
                    let lookupObfsql='SELECT ob.TABLE_NAME,obf.field_name AS lookupField,ob.NAME,obf1.field_name FROM objects_fields obf INNER JOIN objects ob ON ob.id=obf.object_id INNER JOIN objects_fields obf1 ON obf1.object_id=ob.id WHERE obf.lookup="'+objectname+'" AND (ob.organisationId=\''+req.user.organisation_Id+'\' or ob.organisationId=\'\' or ob.organisationId IS NULL) AND obf1.showinlist=\'Y\' ORDER BY ob.name,obf1.id;';
                    db.query(lookupObfsql,obj_id,function (error,lookupObfsql_results) {
                        if(error) {
                            console.log('error:'+ error.sqlMessage);
                            // let s1 = require('./objects_edit_view_controllers');
                            //  s1.edit_view_results(req, res);
                            if(error.sqlMessage.includes("Duplicate")){
                                error.sqlMessage="There is already a Object with this name in your Organisation"
                            }
                            res.render('error',{title:'Objects New', error : error});
                            return;
                        } else if(lookupObfsql_results){
                            if(lookupObfsql_results.length>0){

                                var arrays1 = {};
                                lookupObfsql_results.forEach(function (str) {
                                    // Get id piece
                                    let str_api =str.TABLE_NAME ;
                                    // check if existing property for this id, if not initialize new array
                                    if (!arrays1[str_api]) {
                                        arrays1[str_api] = [];
                                    }
                                    // get value piece
                                    let str_id = str.lookupField;
                                    // add to that id's array
                                    if(!arrays1[str_api].includes(str_id)){
                                        arrays1[str_api].push(str_id);
                                        str_id = str.NAME;
                                        arrays1[str_api].push(str_id);
                                    }
                                });
                                var arrays = {};
                                lookupObfsql_results.forEach(function (str) {
                                    // Get id piece
                                    let str_api =str.TABLE_NAME ;
                                    // check if existing property for this id, if not initialize new array
                                    if (!arrays[str_api]) {
                                        arrays[str_api] = [];
                                    }
                                    // get value piece
                                    let str_id = str.field_name;
                                    // add to that id's array
                                    arrays[str_api].push(str_id);
                                });
                                for(let i=0;i<Object.keys(arrays1).length;i++){
                                    lookupObjects.push(arrays1[Object.keys(arrays1)[i]][1]);
                                }

                                lookupTables=Object.keys(arrays);
                                for(let i=0;i<lookupTables.length;i++){
                                    let sql='Select ';
                                    for(let j=0;j<arrays[lookupTables[i]].length;j++){
                                        sql+=arrays[lookupTables[i]][j];
                                        if(j<(arrays[lookupTables[i]].length-1)){
                                            sql+=',';
                                        }
                                    }
                                    sql+=' from '+lookupTables[i]+' where '+arrays1[lookupTables[i]][0]+'='+req.query.id+';';
                                    db.query(sql,function (error,lookeachresult) {
                                        if(error) {
                                            console.log('error:'+ error.sqlMessage);
                                            // let s1 = require('./objects_edit_view_controllers');
                                            //  s1.edit_view_results(req, res);
                                            if(error.sqlMessage.includes("Duplicate")){
                                                error.sqlMessage="There is already a Object with this name in your Organisation"
                                            }
                                            res.render('error',{title:'Objects New', error : error});
                                            return;
                                        }
                                        for(let l=0;l<lookeachresult.length;l++){
                                            lookeachresult[l]['tablename']=lookupObjects[i];
                                        }
                                        lookupresults[lookupObjects[i]]=[];
                                        for(let k=0;k<lookeachresult.length;k++){
                                            lookupresults[lookupObjects[i]].push(lookeachresult[k]);
                                        }
                                        k1="Hi";
                                        console.log('************************');
                                        console.log(JSON.stringify(lookupresults));
                                        console.log('************************');
                                        if(i===(lookupTables.length-1)){
                                            res.render('home_Loggedin',
                                                {
                                                    standard_menu: req.user.standard_menu,
                                                    custom_menu:req.user.custom_menu,
                                                    lookupObjects:lookupObjects,
                                                    lookupresults:lookupresults,
                                                    standardFields : standardFields,
                                                    customFields : customFields,
                                                    customscript : customscript,
                                                    tablename : tablename,
                                                    id:fid,
                                                    objectname : objectname,
                                                    title: "Custom Edit"
                                                });
                                            return;
                                        }
                                    });
                                }
                            }else {
                                res.render('home_Loggedin',
                                    {
                                        standard_menu: req.user.standard_menu,
                                        custom_menu:req.user.custom_menu,
                                        lookupObjects:lookupObjects,
                                        lookupresults:lookupresults,
                                        standardFields : standardFields,
                                        customFields : customFields,
                                        customscript : customscript,
                                        tablename : tablename,
                                        id:fid,
                                        objectname : objectname,
                                        title: "Custom Edit"
                                    });
                                return;
                            }
                        } else {
                            res.render('home_Loggedin',
                                {
                                    standard_menu: req.user.standard_menu,
                                    custom_menu:req.user.custom_menu,
                                    lookupObjects:lookupObjects,
                                    lookupresults:lookupresults,
                                    standardFields : standardFields,
                                    customFields : customFields,
                                    customscript : customscript,
                                    tablename : tablename,
                                    id:fid,
                                    objectname : objectname,
                                    title: "Custom Edit"
                                });
                            return;
                        }
                    });
                   /* res.render('home_Loggedin', {
                        title : 'Custom Edit' ,
                        standard_menu: req.user.standard_menu,
                        custom_menu:req.user.custom_menu,
                        standardFields : standardFields,
                        customFields : customFields,
                        customscript : customscript,
                        tablename : tablename,
                        id:fid,
                        objectname : objectname
                    });
                    return;*/
                });
            });
        });
    });
}

module.exports.pushresults = pushresults;





