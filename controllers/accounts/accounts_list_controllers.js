var  dbu=require('../../db.js');
var someVar = [];
var list_of_results="";
function popresults(req,res) {
    let ourl=req.originalUrl.split('/');
    let objectname=ourl[2];
    let sql='SELECT obf.field_name,ob.NAME, ob.table_name FROM objects_fields obf\n' +
        '      INNER JOIN objects ob ON obf.object_id=ob.id \n' +
        '      LEFT JOIN information_schema.`COLUMNS` ic  on ic.TABLE_NAME=ob.TABLE_NAME AND obf.field_name=ic.COLUMN_NAME \n' +
        'WHERE ob.NAME=\''+ourl[2]+'\' AND  obf.showinlist=\'Y\' AND'+
        '     (obf.organisationId=\'u000002\' or obf.organisationId=\'\' or obf.organisationId IS NULL) ORDER BY obf.id';
    dbu.query(sql,function(error,fresults){
        if(error || fresults.length===0){
            error.status=error.code;
            console.log(JSON.stringify(error));
            res.render('error',
                {
                    message : error.sqlMessage,
                    error : error,
                    title: "Home List"
                });
            return;
         } else {
            let tablename=fresults[0].table_name;
            let fsql = '';
            for (let i=0;i<fresults.length;i++){
                fsql=fsql+fresults[i].field_name+',';
            }
            fsql=fsql.substring(0,fsql.length-1);
            let sql='SELECT '+fsql+' , \''+objectname+'\' AS tablename FROM '+tablename+ ' where organisationId=\'\' or organisationId IS NULL or organisationId=?';
            console.log(sql);
            dbu.query(sql,[req.user.organisation_Id], function(err, results){
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
                    console.log(JSON.stringify(results))

                    setValue(results, function () {
                            res.render('home_Loggedin',
                                {
                                    standard_menu: req.user.standard_menu,
                                    custom_menu:req.user.custom_menu,
                                    uresult: results,
                                    pagetitle: '',
                                    objectname : objectname,
                                    title: "Accounts List"
                                });

                        }
                    );
                    return;
                }
            });

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




