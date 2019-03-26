var  dbu=require('../../db.js');
var someVar = [];
var list_of_results="";
function detailresults(req,res) {

    dbu.query('SELECT p.id,p.Profile_Name,p.type,p.created_Date,p.lastModified_Date,u2.username AS created_By,u3.username AS lastModified_By FROM profiles p\n' +
        'LEFT JOIN users u2 ON p.created_By=u2.id \n' +
        'LEFT JOIN users u3 ON p.lastModified_By=u3.id\n' +
        'where p.id=?;',[req.query.id], function(err, results){
        if(err) {
            throw err;
        } else {
            // let list_of_results="";
            console.log("JSON Detail"+ JSON.stringify(results));

            setValue(results, function () {
                    res.render('setup',
                        {
                            items : someVar,
                            tdata : list_of_results,
                            error : req.query.error,
                            uresult: results,
                            title: "Profiles Detail"
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


module.exports.detailresults = detailresults;




