var  dbu=require('../../db.js');
var someVar = [];
var list_of_results="";
function popresults(req,res) {

    dbu.query('SELECT id,name,type,table_name,organisationId FROM objects where organisationId=? or organisationId="" or organisationId is NULL',[req.user.organisation_Id], function(err, results){
        if(err) {
            throw err;
        } else {
            // let list_of_results="";

            setValue(results, function () {
                    res.render('setup',
                        {
                            items : someVar,
                            tdata : list_of_results,
                            uresult: results,
                            title: "Objects List"
                        });

                }
            );
        }
    });
}

function setValue(value,callback) {
    someVar = value;
    console.log("somevar:"+someVar);
    callback();
}

function reedirect (res) {

    res.render('setup',
        {
            items : someVar,
            tdata : list_of_results,
            title: "Objects List"
        });
}

module.exports.popresults = popresults;




