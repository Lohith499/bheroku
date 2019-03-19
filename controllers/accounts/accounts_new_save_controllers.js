var someVar = [];
function pushresults(req,res) {
    console.log("***********Account new view controller*******");
    var noticia = req.body;
    console.log(JSON.stringify(noticia));
    let okeys="created_By,organisationId";
    let ovlaues=[req.user.user_id,req.user.organisation_Id];
    let pvalues="?,?";
    for (const key of Object.keys(req.body)) {
       okeys=okeys+","+key;
        ovlaues.push(req.body[key]);
        pvalues=pvalues+',?';

    }
    let ourl=req.originalUrl.split('/');
    let objectname=ourl[2];
    let gettablname='SELECT ob.name,ob.TABLE_NAME FROM objects ob\n' +
        'WHERE ob.NAME=\''+objectname+'\' AND (ob.organisationId=\''+req.user.organisation_Id+'\' or ob.organisationId=\'\' or ob.organisationId IS NULL)';

    const  db=require('../../db.js');
    db.query(gettablname,function (error1,results1,fields1){
        if(error1 || results1.length===0) {
            db.rollback(function() {
                res.render('error', { title: 'No Table Found' , object : req.query.object, id : req.query.id, error : error});
                return;

            });
        }

        let sql='INSERT INTO '+results1[0].TABLE_NAME+' ('+okeys+') VALUES ('+pvalues+')';
        db.query(sql,ovlaues, function
            (error,results,fields){
            if(error) {
                console.log('error:'+ error.sqlMessage);
               // let s1 = require('./objects_edit_view_controllers');
              //  s1.edit_view_results(req, res);
                if(error.sqlMessage.includes("Duplicate")){
                    error.sqlMessage="There is already a Object with this name in your Organisation"
                }
                res.render('setup',{title:'Objects New', error : error});
                return;

            }
            console.log(JSON.stringify(results));
            const user_id = results.insertId;
            console.log(results.insertId);
            res.redirect('/s/'+objectname+"/details?id="+results.insertId);
            return;
        });
    });
}

module.exports.pushresults = pushresults;





