var  dbu=require('../../db.js');
var someVar = [];
var list_of_results="";
function detailresults(req,res) {

    dbu.query('SELECT p.id,p.name,p.type,p.table_name,p.created_Date,p.lastModified_Date,' +
        'u2.username AS created_By,u3.username AS lastModified_By FROM objects p\n' +
        'LEFT JOIN users u2 ON p.created_By=u2.id \n' +
        'LEFT JOIN users u3 ON p.lastModified_By=u3.id\n' +
        'where p.id=?;',[req.query.id], function(err, results){
        if(err) {
            res.render('setup', {title : "Objects List", error : err});
            return;
        }

        let db1=require('../../db.js');
        db1.query('SELECT obf.id,obf.NAME,obf.field_name,obf.`type`,obf.field_type, "objects_fields" as tablename FROM objects_fields obf ' +
            'WHERE obf.object_id=? ORDER BY obf.id; ;',[req.query.id], function(err, subresults) {
            if (err) {
                res.render('setup', {title: "Objects List", error: err});
                return;
            }

            let filtered = subresults.filter(function(value, index, arr){
                if (value.field_name==='id'
                    || value.field_name==='created_Date'
                    || value.field_name==='created_By'
                    || value.field_name==='lastModified_Date'
                    || value.field_name==='lastModified_By'
                    || value.field_name==='organisationId'
                ){
                    return false;
                } else {
                    return true;
                }
            });
            console.log("JSON Detail"+ JSON.stringify(filtered));
            setValue(results, function () {
                    res.render('setup',
                        {
                            items : someVar,
                            tdata : list_of_results,
                            error : req.query.error,
                            uresult: results,
                            subresults :  filtered,
                            title: "Objects Detail"
                        });

                }
            );
        });

    });
}

function setValue(value,callback) {
    someVar = value;
    console.log("somevar:"+someVar);
    callback();
}


module.exports.detailresults = detailresults;




