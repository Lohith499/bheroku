var  dbu=require('../../db.js');
var someVar = [];
var list_of_results="";
function detailresults(req,res) {

    dbu.query('SELECT users.id,users.username,users.email,users.organisationId,' +
        'users.created_Date,users.lastModified_Date,u2.username AS created_By,u3.username AS lastModified_By FROM users ' +
        'INNER JOIN users u2 ON users.created_By=u2.id ' +
        'LEFT JOIN users u3 ON users.lastModified_By=u3.id ' +
        'where users.id=? ;',[req.query.id], function(err, results){
        if(err) {
            res.render('setup', {title : "Users List", error : err});
            return;
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
                            title: "Users Detail"
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




