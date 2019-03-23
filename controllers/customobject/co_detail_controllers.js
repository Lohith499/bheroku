var  dbu=require('../../db.js');
var someVar = [];
var list_of_results="";
function pushresults(req,res) {

    let ovlaues=[req.user.user_id,req.user.organisation_Id];
    let ourl=req.originalUrl.split('/');
    let objectname=ourl[2];
    let obj_id='';
    let table_name='';
    let contentresults =[];
    let cj=0;
    let logresult={};
    let fresults=[];
    let lookupObjects=[];
    let lookupTables=[];
    let lookupresults={};
    let k1="pp";
    let gettablname='SELECT ob.id,ob.name,ob.TABLE_NAME FROM objects ob\n' +
        'WHERE ob.NAME=\''+objectname+'\' AND (ob.organisationId=\''+req.user.organisation_Id+'\' or ob.organisationId=\'\' or ob.organisationId IS NULL)';
    const  db=require('../../db.js');
    db.query(gettablname,function (error1,results1,fields1){
        if(error1 || results1.length===0) {
            db.rollback(function() {
                res.render('error', { title: 'No Object Found' , object : req.query.object, id : req.query.id, error : error});
                return;

            });
        }
        obj_id=results1[0].id;
        table_name=results1[0].TABLE_NAME;
        let getfieldsql='select * from objects_fields obf where obf.object_id='+results1[0].id+' AND (obf.organisationId=\''+req.user.organisation_Id+'\' or obf.organisationId=\'\' or obf.organisationId IS NULL) ORDER BY id';
        db.query(getfieldsql,function (error,fieldresults) {
            if(error || fieldresults.length===0) {
                db.rollback(function() {
                    res.render('error', { title: 'No Fields Found for this Object' , object : req.query.object, id : req.query.id, error : error});
                    return;

                });
            }

            let sql='SELECT t3.*,u.username AS ccreated_By, u1.username AS llastModified_By FROM '+results1[0].TABLE_NAME+' t3 INNER JOIN users u on t3.created_By=u.id LEFT JOIN users u1 ON t3.lastModified_By=u1.username where t3.id='+req.query.id+';';
            db.query(sql,function
                (error,results,fields){
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
                if(results.length===0){
                    let message="No record found with this ID in this object";
                    res.render('error',{title:'Objects New', error : error , message : message});
                    return;
                }
                for (let key in results[0]) {

                    if(key==='ccreated_By' || key==='llastModified_By' || key==='created_Date' || key==='created_By' || key==='lastModified_Date' || key==='lastModified_By' || key==='organisationId'){
                        if(key==='created_By' || key==='lastModified_By'){
                            delete results[0][key];
                        } else {
                            if(key==='ccreated_By'){
                                logresult['created_By']=results[0][key];
                            } else if (key==='llastModified_By'){
                                logresult['lastModified_By']=results[0][key];
                            }else {
                                logresult[key]=results[0][key];
                            }
                            delete results[0][key];
                        }

                    }else {
                        fresults.push([key, results[0][key]]);
                    }
                }
                for(let i=0;i<fieldresults.length;i++){
                   let  key=fieldresults[i].field_name;
                    if(key==='created_Date' || key==='created_By' || key==='lastModified_Date' || key==='lastModified_By' || key==='organisationId'){

                    }else {
                        contentresults[cj]=fieldresults[i];
                        cj=cj+1
                    }
                }
                for(let i=0;i<contentresults.length;i++){
                    for (let key in results[0]) {
                        if(key===contentresults[i].field_name ){
                            contentresults[i].value=results[0][key];
                        }
                    }
                }
                //Lookup data
                let lookupObfsql='SELECT ob.TABLE_NAME,obf.field_name AS lookupField,ob.NAME,obf1.field_name FROM objects_fields obf INNER JOIN objects ob ON ob.id=obf.object_id INNER JOIN objects_fields obf1 ON obf1.object_id=ob.id WHERE obf.lookup="'+objectname+'" AND obf.organisationId=\''+req.user.organisation_Id+'\' AND obf1.showinlist=\'Y\' ORDER BY ob.name,obf1.id;';
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
                                                subtabdisplay:req.query.menu,
                                                // uresult: fresults,
                                                lookupObjects:lookupObjects,
                                                lookupresults:lookupresults,
                                                uresult:contentresults,
                                                pagetitle: '',
                                                k:k1,
                                                objectname : objectname,
                                                id :req.query.id,
                                                logresult:logresult,
                                                everify : "custom controller",
                                                title: "Custom Details"
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
                                    subtabdisplay:req.query.menu,
                                    // uresult: fresults,
                                    lookupObjects:lookupObjects,
                                    lookupresults:lookupresults,
                                    uresult:contentresults,
                                    pagetitle: '',
                                    k:k1,
                                    objectname : objectname,
                                    id :req.query.id,
                                    logresult:logresult,
                                    everify : "custom controller",
                                    title: "Custom Details"
                                });
                            return;
                        }
                    } else {
                        res.render('home_Loggedin',
                            {
                                standard_menu: req.user.standard_menu,
                                custom_menu:req.user.custom_menu,
                                subtabdisplay:req.query.menu,
                                // uresult: fresults,
                                lookupObjects:lookupObjects,
                                lookupresults:lookupresults,
                                uresult:contentresults,
                                pagetitle: '',
                                k:k1,
                                objectname : objectname,
                                id :req.query.id,
                                logresult:logresult,
                                everify : "custom controller",
                                title: "Custom Details"
                            });
                        return;
                    }
                });
            });
        });
    });
}

module.exports.pushresults = pushresults;





