var  dbu=require('../../db.js');
var someVar = [];
var list_of_results="";
var bcrypt=require('bcryptjs');
const saltRound=10;

function pushresults(req,res) {
    console.log('Accounts New Controller');
    let standardFields=[];
    let customFields=[];
   // let customSection="Hi Lohith";
  //  res.render('home_Loggedin', {title : 'Accounts New' , CustomSection : customSection ,standard_menu: req.user.standard_menu, custom_menu:req.user.custom_menu});
    //return;
    let ourl=req.originalUrl.split('/');

    let tablename=ourl[2];

    let sql= 'SELECT obf.NAME,obf.field_name,obf.type,obf.field_type, obf.organisationId,ob.name,ob.table_name,ic.COLUMN_TYPE FROM objects_fields obf ' +
        'INNER JOIN objects ob ON obf.object_id=ob.id ' +
        'LEFT JOIN information_schema.`COLUMNS` ic ON ic.DATA_TYPE=\'enum\' AND ic.TABLE_NAME=ob.TABLE_NAME AND obf.field_name=ic.COLUMN_NAME ' +
        'WHERE ob.NAME=\''+ourl[2]+'\' AND ' +
        '(obf.organisationId=\''+req.user.organisation_Id+'\' or obf.organisationId=\'\' or obf.organisationId IS NULL) ' +
        'ORDER BY obf.id';

    const  db=require('../../db.js');
        db.query(sql, function
            (error,results,fields){
            if(error) {
                console.log('error:'+ error.sqlMessage);
                if(error.sqlMessage.includes("Duplicate")){
                    error.sqlMessage="There is already a Object with this name in your Organisation"
                }
                res.render('error',{title:'Home_LoggedIn', error : error});
                return;
            }
            tablename=results[0].table_name;
            let objectname=results[0].name;

            for(let i=0; i<results.length;i++) {
                if(String(results[i].COLUMN_TYPE).includes('enum')) {
                    let s=results[i].COLUMN_TYPE;
                    s=s.substring(5, s.length-1).split(",")
                    let v =[];
                    for (let i=0;i<s.length;i++){
                        v.push(s[i].substring(1,s[i].length-1))
                    }
                    results[i].COLUMN_TYPE=v;
                    console.log(results[i].COLUMN_TYPE);
                }
            }


            for(let i=0; i<results.length;i++) {
                  if(results[i].type==='Standard'){
                      standardFields.push(results[i]);
                  } else {
                      customFields.push(results[i]);
                  }
            }

            let filtered = standardFields.filter(function(value, index, arr){
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
            standardFields=[];
            standardFields=filtered;
            console.log(JSON.stringify(filtered));

            console.log(JSON.stringify(customFields));
            res.render('home_Loggedin', {
                title : 'Accounts New' ,
                standard_menu: req.user.standard_menu,
                custom_menu:req.user.custom_menu,
                standardFields : standardFields,
                customFields : customFields,
                tablename : tablename,
                objectname : objectname
            });
            return;
        });
}

module.exports.pushresults = pushresults;





