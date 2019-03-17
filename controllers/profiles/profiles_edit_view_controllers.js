var  dbu=require('../../db.js');
var someVar = [];
function edit_view_results(req,res) {


    dbu.query('SELECT id,name FROM profiles where id =?;',[req.query.id], function(err, results){
        if(err) {
            throw err;
        } else {
            // let list_of_results="";

            setValue(results, function () {
                    res.render('setup',
                        {
                            items : someVar,
                            uresult: results,
                            error : req.query.error,
                            title: "Profiles Edit"
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
module.exports.edit_view_results = edit_view_results;





