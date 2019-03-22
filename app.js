var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var expressValidator=require('express-validator');

//Authentication Packages
var session=require('express-session');
var bcrypt=require('bcryptjs');

//Passport
var passport =require('passport');
var LocalStrategy = require('passport-local').Strategy;

var MySQLStore= require('express-mysql-session') (session);

var index = require('./routes/index');
var users = require('./routes/users');




var app = express();

require('dotenv').config();


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');


// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));




app.use(expressValidator());



app.use(cookieParser());
//app.use(express.static(path.join(__dirname, 'public')));
app.use('/public', express.static('public'))

var options = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    port:process.env.DB_PORT,
    password: process.env.DB_PASSWORD,
    database : process.env.DB_NAME
};

var sessionStore= new MySQLStore(options);

app.use(session(
    {
      secret: 'iosfsdsbjbcsjcknsdj',
      resave: false,
        store:sessionStore,
      saveUninitialized : false,
     // cookie: {secure: true}
    })
)
app.use(passport.initialize());
app.use(passport.session());

app.use(function (req,res,next) {
   res.locals.isAuthenticated=req.isAuthenticated();
   next();
});


app.use('/', index);
app.use('/users', users);

passport.use(new LocalStrategy(
    function (username,password,done) {
        console.log(username);
        console.log(password);
        const db =require('./db');
        db.query('SELECT id,password,organisationId FROM users where username=? ',[username],function (err,results,fields) {
            if(err) {done(err)}
            if(results.length===0){
                done(null,false);
            } else {
                console.log(results[0].password.toString());
                const hash =results[0].password.toString();

                bcrypt.compare(password,hash,function (err,response) {
                    if(response===true){
                        console.log('hash pass');
                        return done(null,{user_id: results[0].id, organisation_Id : results[0].organisationId});
                    }else {
                        console.log('hash fail');
                        return done(null,false);
                    }
                });
            }
        })
    }
));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


// Handlebars default config
const hbs = require('hbs');
const fs = require('fs');

//Adding partials for Main directory
const partialsDir = __dirname + '/views/partials';
const filenames = fs.readdirSync(partialsDir);
filenames.forEach(function (filename) {
  const matches = /^([^.]+).hbs$/.exec(filename);

  //Sub directory
  if (!matches) {
      const partialsDir1 = __dirname + '/views/partials/'+filename;
      const filenames1 = fs.readdirSync(partialsDir1);

      filenames1.forEach(function (filename1) {
          const matches1 = /^([^.]+).hbs$/.exec(filename1);
          if (!matches1) {
              return;
          }
          const name1 = matches1[1];
          const template1 = fs.readFileSync(partialsDir1 + '/' + filename1, 'utf8');
          hbs.registerPartial(name1, template1);
      });
      return;
  }


  const name = matches[1];
  const template = fs.readFileSync(partialsDir + '/' + filename, 'utf8');
  hbs.registerPartial(name, template);

});

//Adding partials for busers directory
const partialsDir1 = __dirname + '/views/partials/busers';
const filenames1 = fs.readdirSync(partialsDir1);

filenames1.forEach(function (filename) {
    const matches = /^([^.]+).hbs$/.exec(filename);
    if (!matches) {
        return;
    }
    const name = matches[1];
    const template1 = fs.readFileSync(partialsDir1 + '/' + filename, 'utf8');
    hbs.registerPartial(name, template1);
});


hbs.registerHelper('json', function(context) {
    return JSON.stringify(context, null, 2);
});

hbs.registerHelper("iseq", function(value1)
{
    return hbs.SafeString(value1===value2);
});

hbs.registerHelper('ifvalue', function (conditional, options) {
    if (options.hash.value === conditional) {
        return options.fn(this)
    } else {
        return options.inverse(this);
    }
});

hbs.registerHelper('JSONfetch', function (results) {
    return JSON.stringify(results);
});


hbs.registerHelper('ifCond', function (v1, operator, v2, options) {

    switch (operator) {
        case '==':
            return (v1 == v2) ? options.fn(this) : options.inverse(this);
        case '===':
            return (v1 === v2) ? options.fn(this) : options.inverse(this);
        case '!=':
            return (v1 != v2) ? options.fn(this) : options.inverse(this);
        case '!==':
            return (v1 !== v2) ? options.fn(this) : options.inverse(this);
        case '<':
            return (v1 < v2) ? options.fn(this) : options.inverse(this);
        case '<=':
            return (v1 <= v2) ? options.fn(this) : options.inverse(this);
        case '>':
            return (v1 > v2) ? options.fn(this) : options.inverse(this);
        case '>=':
            return (v1 >= v2) ? options.fn(this) : options.inverse(this);
        case '&&':
            return (v1 && v2) ? options.fn(this) : options.inverse(this);
        case '||':
            return (v1 || v2) ? options.fn(this) : options.inverse(this);
        default:
            return options.inverse(this);
    }
});


hbs.registerHelper('imgicon', function (titleicon) {
    titleicon=titleicon.split(" ");
    console.log("inside helper" + titleicon[0]);
    if(titleicon[0]==="Users"){
        let k="bUsers";
        return '<td><img src="/public/images/'+k+'.ico" style="width:50px;height:50px;"alt=""></td>';
    }else if(titleicon[0]==="Profiles"){
        let k="profile.png";
        return '<td><img src="/public/images/'+k+'" style="width:50px;height:50px;"alt=""></td>';

    }else if(titleicon[0]==="Objects"){
        let k="object.png";
        return '<td><img src="/public/images/'+k+'" style="width:50px;height:50px;"alt=""></td>';

    }else if(titleicon[0]==="ObjectFields"){
        let k="object.png";
        return '<td><img src="/public/images/'+k+'" style="width:50px;height:50px;"alt=""></td>';
    }else if(titleicon[0]==="Accounts"){
        let k="accounts.png";
        return '<td><img src="/public/images/'+k+'" style="width:50px;height:50px;"alt=""></td>';
    }
    else {
        let k="object.png";
        return '<td><img src="/public/images/'+k+'" style="width:50px;height:50px;"alt=""></td>';
    }
});


hbs.registerHelper('tablegen', function (results, header) {
    let tabletag='';


    let content="<thead style='text-align: center'>";
    if(header==='Y'){
        if(results.length>0){
            tabletag="<table id=\"list\" class=\" example table cell-border table-bordered hover\" style=\"width:100%\"> ";
        } else {
            tabletag="<table id=\"list\" class=\"table cell-border table-bordered hover\" style=\"width:100%\"> ";
        }

    }
    content=tabletag+content;
    for (let key in results[0]) {
        if(key==="tablename" || key==='source'){
        }else {
            content=content+"<th>"+key+"</th>";
        }
    }
    content=content+"</thead><tbody>";
    if(results.length>0){
        results.forEach(function(element) {
            content=content+"<tr>";
            for (let key in element) {
                if(key==="id"){
                    let url = '<p style="font-weight: bold;text-align: center;font-size: 15px;"><a href="/s/'+element['tablename']+'/details?id='+element[key]+'">'+element[key]+'</a></p>';
                    content=content+"<td>"+url+"</td>";
                }else if(key==="target"){
                    let url = '<p style="font-weight: bold;text-align: center;font-size: 15px;"><button type="button"  value="'+element['target']+'"onclick="post_value(event)">'+element[key]+'</button></p>';
                    content=content+"<td>"+url+"</td>";
                }
                else if(key==="tablename"){

                }
                else if(key==="source"){

                }
                else {
                    content=content+"<td>"+element[key]+"</td>";
                }
            }
            content=content+"</tr>";
        });
    }else {
        content=content+"<tr><td><h3 style='text-align: center'>No Records Available</h3></td></tr>";
    }

    content=content+"</tbody><tfoot style='text-align: center'>";
    for (let key in results[0]) {
        if(key==="tablename" || key==='source'){
        }else {
            content=content+"<th>"+key+"</th>";
        }
    }
    content=content+"</tfoot>";
    if(header==='Y'){
        tabletag='</table>';
    }else{
        tabletag='';
    }
    content=content+tabletag;
    return content;
});

hbs.registerHelper('contentgen', function (results) {
    let content='<table id="detail_form" style="width: 100%;border-collapse:separate; \n' +
        '                border-spacing:0 15px; ">';
   /*for (let key in results[0]) {
        if(key==="tablename"){
        }else {
            content=content+"<th>"+key+"</th>";
        }
    } */
    for(let i=0;i<results.length;i++){
        content=content+"<tr>";
        if(results[i]['lookup']){
            if(results[i]['lookup'].length>0){
               // content=content+'<td>'+results[i]["name"].toUpperCase()+'</td><td><p value="/s/'+results[i]['lookup']+'/details?id='+results[i]["value"]+'&menu=No" tabname="'+results[i]['lookup']+'" onclick="func(event)">'+results[i]["value"] +'</p></td>';
                content=content+'<td>'+results[i]["name"].toUpperCase()+'</td><td style="font-family:Arial,Helvetica,sans-serif;font-weight: bold;"><p style="margin:0px;color: blue;text-decoration: underline;font-weight: bold;" value="/s/'+results[i]['lookup']+'/details?id='+results[i]["value"]+'&menu=No" tabname="'+results[i]['lookup']+'" onclick="func(event)"> : '+results[i]["value"] +'</p></td>';

            }
        }else{
            content=content+"<td>"+results[i]['name'].toUpperCase()+"</td><td style='font-family:Arial,Helvetica,sans-serif;font-weight: bold;'> : "+results[i]['value']+"</td>";
        }

        i=i+1;
        if(i<results.length){
            if(results[i]['lookup']){
                if(results[i]['lookup'].length>0){
                    content=content+'<td>'+results[i]["name"].toUpperCase()+'</td><td style="font-family:Arial,Helvetica,sans-serif;font-weight: bold;"><p style="margin:0px;color: blue;text-decoration: underline;font-weight: bold;" value="/s/'+results[i]['lookup']+'/details?id='+results[i]["value"]+'&menu=No" tabname="'+results[i]['lookup']+'" onclick="func(event)"> : '+results[i]["value"] +'</p></td>';
                }
            }else{
                content=content+"<td>"+results[i]['name'].toUpperCase()+"</td><td style='font-family:Arial,Helvetica,sans-serif;font-weight: bold;'> : "+results[i]['value']+"</td>";
            }
        }else {
            content=content+"<td></td><td></td>"
        }
        content=content+"</tr>";
    }
    content=content+'</table>';
    return content;
});


hbs.registerHelper('logsection', function (logresult) {
    let content='';
    content=content+'<h5 style="text-decoration: underline;padding-top: 10px;padding-bottom: 5px;">Information History</h5>';
    content=content+' <div id="histoy">';
    content=content+'    <ul>';
    content=content+'    <li style="border-radius: 5px;background: #6895fa;">Created By</li>';
    content=content+'<li style="border-radius: 5px;background: #c2d4fd;">'+logresult.created_By+'</li>';
    content=content+'<li style="border-radius: 5px;background: #6895fa;">Created Date</li>';
    content=content+' <li style="border-radius: 5px;background: #c2d4fd;">'+logresult.created_Date+'</li>';
    content=content+'</ul>';
    content=content+'<ul>';
    content=content+'<li style="border-radius: 5px;background: #6895fa;">LastModified By</li>';
    content=content+'<li style="border-radius: 5px;background: #c2d4fd;">'+logresult.lastModified_By+'</li>';
    content=content+' <li style="border-radius: 5px;background: #6895fa;">LastModified Date</li>';
    content=content+'<li style="border-radius: 5px;background: #c2d4fd;">'+logresult.lastModified_Date+'</li>';
    content=content+'</ul>';
    content=content+' </div>';
    return content;
});





hbs.registerHelper('inputgen', function (results) {
        let content='';
        for(let i=0;i<results.length;i++) {
            let content1='';
            content = content + "<tr><td>"
            if (results[i].field_type.toUpperCase().includes("VARCHAR")) {
                content1 = '<div class="form-group"><label>' + results[i].NAME + '<span class="fb-required">*</span></label><span class="tooltips"><img src="/public/images/q1.png" height="15px" width="15px" alt=""><span class="tooltiptexts">50 characters Maximum</span></span><input type="text" class="form-control" name="' + results[i].field_name + '" maxlength="50" required="required" value="'+results[i].value+'" aria-required="true"></div>';

            }  else if (results[i].field_type.toUpperCase() === 'TEXT') {
                 content1 = '<div class="form-group"><label>' + results[i].NAME + '<span class="fb-required">*</span></label><span class="tooltips"><img src="/public/images/q1.png" height="15px" width="15px" alt=""><span class="tooltiptexts">300 characters Maximum</span></span><textarea type="textarea" class="form-control" name="' + results[i].field_name + '" maxlength="300" rows="3" id="textarea-1552382798244" title="300 characters Maximum" required="required" aria-required="true">'+results[i].value+'</textarea></div>';

            }  else if (results[i].field_type.toUpperCase() === 'LONGTEXT') {
                 content1 = '<div class="form-group"><label>' + results[i].NAME + '<span class="fb-required">*</span></label><span class="tooltips"><img src="/public/images/q1.png" height="15px" width="15px" alt=""><span class="tooltiptexts">2000 characters Maximum</span></span><textarea type="textarea" class="form-control" name="' + results[i].field_name + '" maxlength="2000" rows="6" id="textarea-1552382798244" title="2000 characters Maximum" required="required" aria-required="true">'+results[i].value+'</textarea></div>';

            }  else if (results[i].field_type.toUpperCase() === 'INT') {
                 content1='<div class="form-group"><label>'+results[i].NAME+'<span class="fb-required">*</span></label><span class="tooltips"><img src="/public/images/q1.png" height="15px" width="15px" alt=""><span class="tooltiptexts">value between -99999 to 99999</span></span><input type="number" class="form-control" name="'+results[i].field_name+'" value="'+results[i].value+'" min="-99999" max="99999" step="1" id="number-1552383218727" title="value between -99999 to 99999" required="required" aria-required="true"></div>';

            }  else if (results[i].field_type.toUpperCase() === 'BIGINT') {
                 content1='<div class="form-group"><label>'+results[i].NAME+'<span class="fb-required">*</span></label><span class="tooltips"><img src="/public/images/q1.png" height="15px" width="15px" alt=""><span class="tooltiptexts">value between -9999999999 to 9999999999</span></span><input type="number" class="form-control" name="'+results[i].field_name+'" value="'+results[i].value+'" min="-9999999999" max="9999999999" step="1" id="number-1552383218727" title="value between -9999999999 to 9999999999" required="required" aria-required="true"></div>';

            }  else if (results[i].field_type.toUpperCase() === 'DOUBLE') {
                 content1='<div class="form-group"><label>'+results[i].NAME+'<span class="fb-required">*</span></label><span class="tooltips"><img src="/public/images/q1.png" height="15px" width="15px" alt=""><span class="tooltiptexts">value length (12,4) with Max 4 decimals (red means error)</span></span><input type="number" class="form-control" name="'+results[i].field_name+'" value="'+results[i].value+'" name="price" min="0" value="0" step="0.01" pattern="^\\d+(?:\\.\\d{1,4})?$" onblur="\n' +
                    'this.parentNode.parentNode.style.backgroundColor=/^\\d+(?:\\.\\d{1,4})?$/.test(this.value)?\'inherit\':\'red\'\n' +
                    '" title="value with max 4 decimals" required="required" aria-required="true"></div>';
            } else if (results[i].field_type.toUpperCase() === 'DATE'){
                 content1='<div class="form-group"><label ">'+results[i].NAME+'<span class="fb-required">*</span></label><span class="tooltips"><img src="/public/images/q1.png" height="15px" width="15px" alt=""><span class="tooltiptexts">Select Date</span></span><input type="date" class="form-control" name="'+results[i].field_name+'" title="Select Date" value="'+results[i].value+'" required="required" aria-required="true"></div>'

            } else if (results[i].field_type.toUpperCase() === 'DATETIME' || results[i].field_type.toUpperCase() === 'DATETIMESTAMP' || results[i].field_type.toUpperCase() ==='TIMESTAMP' ){
                 content1='<div class="form-group"><label ">'+results[i].NAME+'<span class="fb-required">*</span></label><span class="tooltips"><img src="/public/images/q1.png" height="15px" width="15px" alt=""><span class="tooltiptexts">Select Date and Time</span></span><input type="datetime-local" class="form-control" name="'+results[i].field_name+'" value="'+results[i].value+'" title="Select Date and Time" required="required" aria-required="true"></div>'

            }  else if (results[i].field_type.toUpperCase() === 'LOOKUP'){
                content1='<div class="form-group"><label ">'+results[i].NAME+'<span class="fb-required">*</span></label><span class="tooltips"><img src="/public/images/q1.png" height="15px" width="15px" alt=""><span class="tooltiptexts">Click Search To Pull Results</span></span>' +
                    '<p class="form-control"><input type="text"   style="width:calc(100% - 30px);border: none" name="'+results[i].field_name+'" id="source'+results[i].field_name+'" value="'+results[i].value+'"><img src="/public/images/lookup.png" style="height: 24px;width:24px;" onclick=\'window.open("/s/'+results[i].lookup+'/lookup?returnTo=source'+results[i].field_name+'","Ratting","width=700,height=400,left=150,top=200,toolbar=1,status=1,");\'></p></div>';
            } else if (results[i].field_type.toUpperCase() === 'ENUM'){
                 content1='<div class="form-group"><label>'+results[i].NAME+'<span class="fb-required">*</span></label><span class="tooltips"><img src="/public/images/q1.png" height="15px" width="15px" alt=""><span class="tooltiptexts">Select one value</span></span><select class="form-control" name="'+results[i].field_name+'" value="'+results[i].value+'" required="required" aria-required="true">';
                    for(let j=0;j<results[i].COLUMN_TYPE.length;j++){
                        content1=content1+'<option value="'+results[i].COLUMN_TYPE[j]+'">'+results[i].COLUMN_TYPE[j]+'</option>';
                    }
                content1=content1+'</select></div>';
            }
            content=content+content1+'</td>';
            i=i+1;
            if(i<results.length){
                content1='';
                content=content+'<td>';
                if (results[i].field_type.toUpperCase().includes("VARCHAR")) {
                    content1 = '<div class="form-group"><label>' + results[i].NAME + '<span class="fb-required">*</span></label><span class="tooltips"><img src="/public/images/q1.png" height="15px" width="15px" alt=""><span class="tooltiptexts">50 characters Maximum</span></span><input type="text" class="form-control" name="' + results[i].field_name + '" maxlength="50" required="required" value="'+results[i].value+'" aria-required="true"></div>';

                }  else if (results[i].field_type.toUpperCase() === 'TEXT') {
                    content1 = '<div class="form-group"><label>' + results[i].NAME + '<span class="fb-required">*</span></label><span class="tooltips"><img src="/public/images/q1.png" height="15px" width="15px" alt=""><span class="tooltiptexts">300 characters Maximum</span></span><textarea type="textarea" class="form-control" name="' + results[i].field_name + '" maxlength="300" rows="3" id="textarea-1552382798244" title="300 characters Maximum" required="required" aria-required="true">'+results[i].value+'</textarea></div>';

                }  else if (results[i].field_type.toUpperCase() === 'LONGTEXT') {
                    content1 = '<div class="form-group"><label>' + results[i].NAME + '<span class="fb-required">*</span></label><span class="tooltips"><img src="/public/images/q1.png" height="15px" width="15px" alt=""><span class="tooltiptexts">2000 characters Maximum</span></span><textarea type="textarea" class="form-control" name="' + results[i].field_name + '" maxlength="2000" rows="6" id="textarea-1552382798244" title="2000 characters Maximum" required="required" aria-required="true">'+results[i].value+'</textarea></div>';

                }  else if (results[i].field_type.toUpperCase() === 'INT') {
                    content1='<div class="form-group"><label>'+results[i].NAME+'<span class="fb-required">*</span></label><span class="tooltips"><img src="/public/images/q1.png" height="15px" width="15px" alt=""><span class="tooltiptexts">value between -99999 to 99999</span></span><input type="number" class="form-control" name="'+results[i].field_name+'" value="'+results[i].value+'" min="-99999" max="99999" step="1" id="number-1552383218727" title="value between -99999 to 99999" required="required" aria-required="true"></div>';

                }  else if (results[i].field_type.toUpperCase() === 'BIGINT' || results[i].field_type === 'bigint') {
                    content1='<div class="form-group"><label>'+results[i].NAME+'<span class="fb-required">*</span></label><span class="tooltips"><img src="/public/images/q1.png" height="15px" width="15px" alt=""><span class="tooltiptexts">value between -9999999999 to 9999999999</span></span><input type="number" class="form-control" name="'+results[i].field_name+'" value="'+results[i].value+'" min="-9999999999" max="9999999999" step="1" id="number-1552383218727" title="value between -9999999999 to 9999999999" required="required" aria-required="true"></div>';

                }  else if (results[i].field_type.toUpperCase() === 'DOUBLE') {
                    content1='<div class="form-group"><label>'+results[i].NAME+'<span class="fb-required">*</span></label><span class="tooltips"><img src="/public/images/q1.png" height="15px" width="15px" alt=""><span class="tooltiptexts">value length (12,4) with Max 4 decimals (red means error)</span></span><input type="number" class="form-control" name="'+results[i].field_name+'" value="'+results[i].value+'" name="price" min="0" value="0" step="0.01" pattern="^\\d+(?:\\.\\d{1,4})?$" onblur="\n' +
                        'this.parentNode.parentNode.style.backgroundColor=/^\\d+(?:\\.\\d{1,4})?$/.test(this.value)?\'aqua\':\'red\'\n' +
                        '" title="value with max 4 decimals" required="required" aria-required="true"></div>';
                } else if (results[i].field_type.toUpperCase() === 'DATE'){
                    content1='<div class="form-group"><label ">'+results[i].NAME+'<span class="fb-required">*</span></label><span class="tooltips"><img src="/public/images/q1.png" height="15px" width="15px" alt=""><span class="tooltiptexts">Select Date</span></span><input type="date" class="form-control" name="'+results[i].field_name+'" title="Select Date" value="'+results[i].value+'" required="required" aria-required="true"></div>'

                } else if (results[i].field_type.toUpperCase() === 'DATETIME' || results[i].field_type.toUpperCase() === 'DATETIMESTAMP' || results[i].field_type.toUpperCase() ==='TIMESTAMP' ){
                     content1='<div class="form-group"><label ">'+results[i].NAME+'<span class="fb-required">*</span></label><span class="tooltips"><img src="/public/images/q1.png" height="15px" width="15px" alt=""><span class="tooltiptexts">Select Date and Time</span></span><input type="datetime-local" class="form-control" name="'+results[i].field_name+'" title="Select Date and Time" value="'+results[i].value+'" required="required" aria-required="true"></div>'

                } else if (results[i].field_type.toUpperCase() === 'LOOKUP'){
                    content1='<div class="form-group"><label ">'+results[i].NAME+'<span class="fb-required">*</span></label><span class="tooltips"><img src="/public/images/q1.png" height="15px" width="15px" alt=""><span class="tooltiptexts">Click Search To Pull Results</span></span>' +
                        '<p class="form-control"><input type="text"   style="width:calc(100% - 30px);border: none" name="'+results[i].field_name+'" id="source'+results[i].field_name+'" value="'+results[i].value+'"><img src="/public/images/lookup.png" style="height: 24px;width:24px;" onclick=\'window.open("/s/'+results[i].lookup+'/lookup?returnTo=source'+results[i].field_name+'","Ratting","width=700,height=400,left=150,top=200,toolbar=1,status=1,");\'></p></div>';
                }
                else if (results[i].field_type.toUpperCase() === 'ENUM'){
                    content1='<div class="form-group"><label>'+results[i].NAME+'<span class="fb-required">*</span></label><span class="tooltips"><img src="/public/images/q1.png" height="15px" width="15px" alt=""><span class="tooltiptexts">Select one Value</span></span><select class="form-control" name="'+results[i].field_name+'"  value="'+results[i].value+'" required="required" aria-required="true">';
                    for(let j=0;j<results[i].COLUMN_TYPE.length;j++){
                        content1=content1+'<option value="'+results[i].COLUMN_TYPE[j]+'">'+results[i].COLUMN_TYPE[j]+'</option>';
                    }
                    content1=content1+'</select></div>';
                }
                content=content+content1+'</td>';
            }
            content=content+'</tr>';
        }
        console.log(content);
    return content;
});

module.exports = app;
