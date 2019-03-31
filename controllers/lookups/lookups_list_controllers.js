var  dbu=require('../../db.js');
var someVar = [];
var list_of_results="";
function popresults(req,res) {
    let ourl=req.originalUrl.split('/');
    let objectname=ourl[2];
    let table_name='';
    let returnTo=req.query.returnTo;
    let searchstring=req.body.searchbox;
    let lookupset=true;
    console.log(searchstring +" "+returnTo);

    let sql='select id,table_name from objects where name=\''+objectname+'\' and ' +
        '(organisationId=\'\' or organisationId=\''+req.user.organisation_Id+'\' or organisationId is NULL);'
    console.log(sql);
    const  db=require('../../db.js');
    db.query(sql,function (error,resultsT) {
        if(error) {
            console.log('error:'+ error.sqlMessage);
            // let s1 = require('./objects_edit_view_controllers');
            //  s1.edit_view_results(req, res);
            if(error.sqlMessage.includes("Duplicate")){
                error.sqlMessage="There is already a Object Field with this name in your Organisation; SQL error message ="+error.sqlMessage
            }
            res.render('error', { title: 'ObjectFields' , messgae : "Error while fetching data from CustomScripts table", id : req.query.id, error : error});
            return;
        }
        if(resultsT.length===0) {
            db.rollback(function() {
                let error={};
                error.message ='No Object has been found with this name';
                res.render('error', { title: 'No Table Found' , object : req.query.object, id : req.query.id, error : error });
                return;
            });
        }
        table_name=resultsT[0].table_name;
        lookupTsql='select Field_Name from  lookups where object_id='+resultsT[0].id+' and organisationId=\''+req.user.organisation_Id+'\'';
        console.log(lookupTsql);
        db.query(lookupTsql,function (error,resLook) {
            if(error) {
                console.log('error:'+ error.sqlMessage);
                // let s1 = require('./objects_edit_view_controllers');
                //  s1.edit_view_results(req, res);
                if(error.sqlMessage.includes("Duplicate")){
                    error.sqlMessage="There is already a Object Field with this name in your Organisation; SQL error message ="+error.sqlMessage
                }
                res.render('error', { title: 'ObjectFields' , messgae : "Error while fetching data from CustomScripts table", id : req.query.id, error : error});
                return;
            }
            if(resLook.length===0) {
                lookupset=false;
                res.render('lookups_list',
                    {
                        objectname : objectname,
                        lookupset:lookupset,
                        returnTo: req.query.returnTo,
                        title: "Lookups Search",
                        values: searchstring
                    });
                return;
            }
            let a='';
            let b='';
            for(let i=0;i<resLook.length;i++){
                a=a+resLook[i].Field_Name;
                b=b+resLook[i].Field_Name+' LIKE \'%'+searchstring+'%\'';
                if(i<(resLook.length-1)){
                    a=a+',';
                    b=b+' or ';
                }
            }
            let sqlsearch='select id as target,\''+returnTo+'\' as source,'+ a+' from  '+table_name+' where ('+b+') and (organisationId=\'\' or organisationId=\''+req.user.organisation_Id+'\' or organisationId is NULL);;';
            console.log(sqlsearch);
            db.query(sqlsearch,function (error,searchresults) {
                if(error) {
                    console.log('error:'+ error.sqlMessage);
                    // let s1 = require('./objects_edit_view_controllers');
                    //  s1.edit_view_results(req, res);
                    if(error.sqlMessage.includes("Duplicate")){
                        error.sqlMessage="There is already a Object Field with this name in your Organisation; SQL error message ="+error.sqlMessage
                    }
                    res.render('error', { title: 'ObjectFields' , messgae : "Error while fetching data from CustomScripts table", id : req.query.id, error : error});
                    return;
                }
                if(searchresults){
                    for(let i=0;i<searchresults.length;i++){
                        searchresults[i]['tablename']=objectname;
                    }
                }
                console.log(JSON.stringify(searchresults));
                res.render('lookups_list',
                    {
                        objectname : objectname,
                        lookupset:lookupset,
                        uresult:searchresults,
                        searchresults:searchresults,
                        returnTo: req.query.returnTo,
                        title: "Lookups Search",
                        values: searchstring
                    });
                return;

            });

        })


    });

}


module.exports.popresults = popresults;




