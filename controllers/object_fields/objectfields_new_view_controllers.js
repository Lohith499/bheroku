
function pushresults(req,res) {
    let tablename=req.query.object;
    if(req.query.type==='Custom'){
        tablename=tablename+req.user.organisation_Id;
    }
    const  db=require('../../db.js');
    let sql='select name from objects ob WHERE ob.organisationId=\''+req.user.organisation_Id+'\' or ob.organisationId=\'\' or ob.organisationId IS NULL';
    db.query(sql,function (error,results,fields) {
        if(error) {
            db.rollback(function() {
                res.render('error', { title: 'No Objects Found' , object : req.query.object, id : req.query.id, error : error});
                return;
            });
        }
        let options='';
        for (let i=0;i<results.length;i++){
            options=options+'<option value="'+results[i].name+'" >'+results[i].name+'</option>';
        }

        res.render('setup',
            { title: 'ObjectFields' ,
                type: req.query.type,
                options:options,
                object : req.query.object,
                id : req.query.id,
                tablename : tablename});
        return;

    })


}

module.exports.pushresults = pushresults;





