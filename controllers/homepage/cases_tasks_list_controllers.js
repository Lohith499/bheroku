var  dbu=require('../../db.js');
var someVar = [];
var list_of_results="";
function popresults(req,res) {
    let cases_results=[];
    let tasks_results=[];
    let ourl=req.originalUrl.split('/');
    let objectname='Cases';
    let sql='SELECT obf.field_name,ob.NAME, ob.table_name FROM objects_fields obf\n' +
        '      INNER JOIN objects ob ON obf.object_id=ob.id \n' +
        '      LEFT JOIN information_schema.`COLUMNS` ic  on ic.TABLE_NAME=ob.TABLE_NAME AND obf.field_name=ic.COLUMN_NAME \n' +
        'WHERE ob.NAME=\''+objectname+'\' AND  obf.showinlist=\'Y\' AND'+
        '     (obf.organisationId=\'u000002\' or obf.organisationId=\'\' or obf.organisationId IS NULL) ORDER BY obf.id';
    dbu.query(sql,function(error,fresults){
            if(error){
                if(error.hasOwnProperty(sqlMessage)){

                }else {
                    error.sqlMessage="Some error occured while fetching the data";
                }
                res.render('error',
                    {
                        message : error.sqlMessage,
                        error : error,
                        title: "Home Page Error"
                    });
                return;
            }else if(fresults.length===0){
                let message ="No Object with this name has been found in your Organisation";
                let error={};
                error.status="Object not found create New Custom object or navigate as per rules defined for each action";
                res.render('error',
                    {
                        message : message,
                        error : error,
                        title: "Home List"
                    });
                return;
            }
             else {
            let tablename=fresults[0].table_name;
            let fsql = '';
            for (let i=0;i<fresults.length;i++){
                fsql=fsql+fresults[i].field_name+',';
            }
            fsql=fsql.substring(0,fsql.length-1);
            let sql='SELECT '+fsql+' , \''+objectname+'\' AS tablename FROM '+tablename+ ' where (organisationId=\'\' or organisationId IS NULL or organisationId=?) and cases.`Status`<>\'Closed\' and Case_Owner='+req.user.user_id+';';
            console.log(sql);
            dbu.query(sql,[req.user.organisation_Id], function(err, cases_results){
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
                    console.log("Cases");
                    console.log(JSON.stringify(cases_results))
//***********************
                    let objectname='Tasks';
                    let sql='SELECT obf.field_name,ob.NAME, ob.table_name FROM objects_fields obf\n' +
                        '      INNER JOIN objects ob ON obf.object_id=ob.id \n' +
                        '      LEFT JOIN information_schema.`COLUMNS` ic  on ic.TABLE_NAME=ob.TABLE_NAME AND obf.field_name=ic.COLUMN_NAME \n' +
                        'WHERE ob.NAME=\''+objectname+'\' AND  obf.showinlist=\'Y\' AND'+
                        '     (obf.organisationId=\'u000002\' or obf.organisationId=\'\' or obf.organisationId IS NULL) ORDER BY obf.id';
                    dbu.query(sql,function(error,ftresults){
                        if(error){
                            if(error.hasOwnProperty(sqlMessage)){

                            }else {
                                error.sqlMessage="Some error occured while fetching the data";
                            }
                            res.render('error',
                                {
                                    message : error.sqlMessage,
                                    error : error,
                                    title: "Home Page Error"
                                });
                            return;
                        }else if(ftresults.length===0){
                            let message ="No Object with this name has been found in your Organisation";
                            let error={};
                            error.status="Object not found create New Custom object or navigate as per rules defined for each action";
                            res.render('error',
                                {
                                    message : message,
                                    error : error,
                                    title: "Home List"
                                });
                            return;
                        }
                        else {
                            let tablename=ftresults[0].table_name;
                            let fsql = '';
                            for (let i=0;i<ftresults.length;i++){
                                fsql=fsql+ftresults[i].field_name+',';
                            }
                            fsql=fsql.substring(0,fsql.length-1);
                            let sql='SELECT '+fsql+' , \''+objectname+'\' AS tablename FROM '+tablename+ ' where (organisationId=\'\' or organisationId IS NULL or organisationId=?) and tasks.`Status`<>\'Closed\' and Task_Owner='+req.user.user_id+';';
                            console.log(sql);
                            dbu.query(sql,[req.user.organisation_Id], function(err, tasks_results){
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
                                    console.log("Tasks");
                                    console.log(JSON.stringify(tasks_results))
                                    res.render('home_Loggedin',
                                        {
                                            standard_menu: req.user.standard_menu,
                                            custom_menu:req.user.custom_menu,
                                            cases_results: cases_results,
                                            tasks_results: tasks_results,
                                            pagetitle: '',
                                            objectname : objectname,
                                            everify: "custon controller",
                                            title: "Home Page"
                                        });
                                    return;
                                }
                            });

                        }
                    });
//********************************
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




