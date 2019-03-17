var  dbu=require('../../db.js');
var someVar = [];
var list_of_results="";
function pushresults(req,res) {

    let ovlaues=[req.user.user_id,req.user.organisation_Id];
    let ourl=req.originalUrl.split('/');
    let objectname=ourl[2];
    let gettablname='SELECT ob.name,ob.TABLE_NAME FROM objects ob\n' +
        'WHERE ob.NAME=\''+objectname+'\' AND (ob.organisationId=\''+req.user.organisation_Id+'\' or ob.organisationId=\'\' or ob.organisationId IS NULL)';
    console.log('id='+req.query.id);
    const  db=require('../../db.js');
    db.query(gettablname,function (error1,results1,fields1){
        if(error1 || results1.length===0) {
            db.rollback(function() {
                res.render('error', { title: 'No Table Found' , object : req.query.object, id : req.query.id, error : error});
                return;

            });
        }

        let sql='select * from '+results1[0].TABLE_NAME+' where id='+req.query.id+';';
        db.query(sql,function
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

            if(results.length===0){
                let message="No record found with this ID in this object";
                res.render('setup',{title:'Objects New', error : error , message : message});
                return;
            }
            let logresult={};
            let fresults=[]
            for (let key in results[0]) {

                if(key==='created_Date' || key==='created_By' || key==='lastModified_Date' || key==='lastModified_By' || key==='organisationId'){
                    logresult[key]=results[0][key];
                    delete results[0][key];
                }else {
                    fresults.push([key, results[0][key]]);
                }
            }

            console.log(fresults[0]);

            console.log('log info'+JSON.stringify(logresult));
            console.log(JSON.stringify(results));
            res.render('home_Loggedin',
                {
                    standard_menu: req.user.standard_menu,
                    custom_menu:req.user.custom_menu,
                    uresult: fresults,
                    pagetitle: '',
                    objectname : objectname,
                    logresult:logresult,
                    everify : "custom controller",
                    title: "Custom Details"
                });
            return;
        });
    });
}

module.exports.pushresults = pushresults;





