function pushresults(req,res) {
    let tablename=req.query.object;
    if(req.query.type==='Custom'){
        tablename=tablename+req.user.organisation_Id;
    }
    let object_id=req.query.id;;
    let sql= 'SELECT * FROM customscripts cs WHERE cs.object_id='+object_id+' AND cs.organisationId=\''+req.user.organisation_Id+'\';';
    const  db=require('../../db.js');
        db.query(sql, function
            (error,results,fields){
            if(error) {
                console.log('error:'+ error.sqlMessage);
                res.render('error',{title:'Home_LoggedIn', error : error});
                return;
            } else if(results.length===0){
                res.render('setup', {
                    title : 'Customscripts' ,
                    value: '',
                    logresult:[],
                    logavailable:'Yes',
                    type:req.query.type,
                    object : req.query.object,
                    id : req.query.id,
                    tablename : tablename
                });
                return;
            } else {
                let logresult={};
                for (let key in results[0]) {

                    if(key==='created_Date' || key==='created_By' || key==='lastModified_Date' || key==='lastModified_By'){
                        logresult[key]=results[0][key];
                    }
                }
                let customcode=results[0].scriptcode;
                console.log('customcode');
                console.log(logresult.length);
                console.log(JSON.stringify(logresult));
                res.render('setup', {
                    title : 'Customscripts' ,
                    value: customcode,
                    type:req.query.type,
                    logavailable:'Yes',
                    logresult: logresult,
                    object : req.query.object,
                    id : req.query.id,
                    tablename : tablename
                });
                return;
            }
        });
}

module.exports.pushresults = pushresults;





