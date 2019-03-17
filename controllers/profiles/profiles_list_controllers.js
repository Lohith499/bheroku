var  dbu=require('../../db.js');
var someVar = [];
var list_of_results="";
function popresults(req,res) {

    dbu.query('SELECT id,name,type,organisationId FROM profiles where organisationId=? or organisationId="";',[req.user.organisation_Id], function(err, results){
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
                            title: "Profiles List"
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
            title: "Profiles List"
        });
}

module.exports.popresults = popresults;




