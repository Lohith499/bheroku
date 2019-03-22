var  dbu=require('../../db.js');
var someVar = [];

var list_of_results="";
function popresults(req,res,callback) {
    let standard_menu = [];
    let custom_menu = [];
    dbu.query('SELECT name,type FROM objects where organisationId=? or organisationId="" or organisationId is NULL;',[req.user.organisation_Id], function(err, results){
        if(err) {
            err.status=err.code;
            console.log(JSON.stringify(err));
            res.render('error',
                {
                    message : err.sqlMessage,
                    error : err,
                    title: "Home List"
                });
                return;
        } else {

            for(let i=0; i<results.length; i++){
                if(results[i].type==='Standard'){
                    standard_menu.push(results[i].name);
                } else if(results[i].type==='Custom'){
                    custom_menu.push(results[i].name);
                }
            }
            standard_menu.push('More1');
            standard_menu.push('More2');
            standard_menu.push('More3');
            standard_menu.push('More4');
            req.user.standard_menu=standard_menu;
            req.user.custom_menu=custom_menu;
            return callback();
        }
    });
}

function setValue(value,callback) {
    someVar = value;
    console.log("somevar:"+someVar);
    callback();
}



module.exports.popresults = popresults;




