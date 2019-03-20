function pushresults(req,res) {
    let tablename=req.query.object;
    if(req.query.type==='Custom'){
        tablename=tablename+req.user.organisation_Id;
    }
    let object_id=req.query.id;;
    let sql= 'SELECT obf.object_id,obf.field_name FROM objects_fields obf WHERE obf.object_id='+object_id+' AND (obf.organisationId=\''+req.user.organisation_Id+'\' or obf.organisationId=\'\' or obf.organisationId is NULL);';
    console.log(sql);
    const  db=require('../../db.js');
        db.query(sql, function
            (error,results,fields){
            if(error) {
                console.log('error:'+ error.sqlMessage);
                res.render('error',{title:'Home_LoggedIn', error : error});
                return;
            }
            let lookupfields=[];
            let j=0;
            for(let i=0;i<results.length;i++){
                let delField=results[i].field_name;
                if(delField==='id' || delField==='created_Date' || delField==='created_By' || delField==='lastModified_Date' || delField==='lastModified_By'){

                } else {
                    lookupfields.push(results[i]);
                    j=j+1;
                }
            }
            console.log(lookupfields);
            res.render('setup', {
                title : 'LookupScripts' ,
                type:req.query.type,
                object : req.query.object,
                id : req.query.id,
                lookupfields:lookupfields,
                tablename : tablename
            });
            return;
        });
}

module.exports.pushresults = pushresults;





