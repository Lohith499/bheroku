var  dbu=require('../../db.js');
var someVar = [];
var list_of_results="";
function popresults(req,res) {

    dbu.query('SELECT id,username,email,organisationId FROM users where organisationId=?;',[req.user.organisation_Id], function(err, results){
        if(err) {
            throw err;
        } else {
            // let list_of_results="";
          /*  for (each in results){
                list_of_results+="<tr>";
                list_of_results+="<td> "+results[each].id+"</td>";
                list_of_results+="<td> "+results[each].username+"</td>";
                list_of_results+="<td> "+results[each].email+"</td>";
                list_of_results+="<td> "+results[each].organisationId+"</td>";
                list_of_results+="</tr>";
            }*/

            setValue(results, function () {
                    res.render('setup',
                        {
                            items : someVar,
                            //tdata : list_of_results,
                            uresult: results,
                            title: "Users List"
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
            title: "Users List"
        });
}

module.exports.popresults = popresults;




