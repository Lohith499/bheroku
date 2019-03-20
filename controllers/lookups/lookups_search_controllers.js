var  dbu=require('../../db.js');
var someVar = [];
var list_of_results="";
function popresults(req,res) {
    let ourl=req.originalUrl.split('/');
    let objectname=ourl[2];

    res.render('lookups_search',
    {
        objectname : objectname,
        returnTo: req.query.returnTo,
        title: "Lookups Search",
        values: ''
    });
    return;
}



module.exports.popresults = popresults;




