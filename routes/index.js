var express = require('express');

var router = express.Router();


//**************
const { JSDOM } = require( 'jsdom' );
const jsdom = new JSDOM( '<!DOCTYPE html>' );
// Set window and document from jsdom
const { window } = jsdom;
const { document } = window;
// Also set global window and document before requiring jQuery
global.window = window;
global.document = document;
//const $ = global.jQuery = require( 'jquery' );

//**************


const { check, validationResult } = require('express-validator/check');
var passport=require('passport');
var bcrypt= require('bcryptjs');

const saltRound=10;
/* GET home page. */

router.get('/', function(req, res, next) {
    //console.log(req.isAuthenticated());
    if(req.isAuthenticated()){
        //console.log("JSON "+JSON.stringify(req.user));
       // console.log("Logged in as "+req.user.user_id);
        res.header("user_id",req.user.user_id);
        res.header("organisation_id",req.user.organisation_Id);
        let s1 = require('../controllers/homepage/homepage_menus');
        s1.popresults(req, res,function(){
            let s2 = require('../controllers/homepage/cases_tasks_list_controllers');
            s2.popresults(req, res);
            return;
        });

    } else {
        res.render('home_Loggedout', { title: 'home_Loggedout' });
        console.log("not yet logged in");
        return;
    }


});

//*****************Accounts********************************************
//List
router.get('/s/accounts', authenticationMiddleware(),function(req, res, next) {
    //console.log(req.user);
    //console.log(req.isAuthenticated());
    res.header("organisation_id",req.user.organisation_Id);
    let s1 = require('../controllers/homepage/homepage_menus');
    s1.popresults(req, res,function(){
        let s2 = require('../controllers/accounts/accounts_list_controllers');
        s2.popresults(req, res);
        return;
    });
});

router.post('/s/cases/edit/', authenticationMiddleware(),function(req, res, next) {
    //console.log('Accounts Edit');
    let s1 = require('../controllers/homepage/homepage_menus');
    s1.popresults(req, res,function(){
        if(req.query.action==='view'){
            let s2 = require('../controllers/cases/cases_edit_view_controllers');
            s2.pushresults(req, res);
            return;
        } else if(req.query.action==='save'){
            let s2 = require('../controllers/customobject/co_edit_controllers');
            s2.pushresults(req, res);
            return;

        }else {
            res.redirect("/");
        }
    });
});





//***********************Web Services****************************************
router.get(/\/c\/.*\/details/, function(req, res, next) {
    let s2 = require('../controllers/webservices/webservice_detail_controllers');
    s2.pushresults(req, res);
    return;
});

router.get(/\/c\/.*\/search/, function(req, res, next) {
    let s2 = require('../controllers/webservices/webservice_search_controllers');
    s2.pushresults(req, res);
    return;
});

router.get(/\/c\/.*\/def/, function(req, res, next) {
    let s2 = require('../controllers/webservices/webservice_object_def_controllers');
    s2.pushresults(req, res);
    return;
});


router.get(/\/c\/.*\/list/, function(req, res, next) {
    let s2 = require('../controllers/webservices/webservice_list_controllers');
    s2.pushresults(req, res);
    return;
});


router.get(/\/c\/.*\/new/, function(req, res, next) {
    let s2 = require('../controllers/webservices/webservice_new_view_controllers');
    s2.pushresults(req, res);
    return;
});


router.post(/\/c\/.*\/new/,function(req, res, next) {
    let s2 = require('../controllers/webservices/webservice_new_save_controllers');
    s2.pushresults(req, res);
    return;
});

//***********************Web Services****************************************



router.get(/\/s\/.*\/list/, authenticationMiddleware(),function(req, res, next) {
    //console.log(req.user);
    //console.log(req.isAuthenticated());
    res.header("organisation_id",req.user.organisation_Id);

    let s1 = require('../controllers/homepage/homepage_menus');
    s1.popresults(req, res,function(){
        let s2 = require('../controllers/customobject/co_list_controllers');
        s2.popresults(req, res);
        return;
    });
});


router.get(/\/s\/.*\/lookup/, authenticationMiddleware(),function(req, res, next) {
    //console.log(req.user);
    //console.log(req.isAuthenticated());
    res.header("organisation_id",req.user.organisation_Id);
        let s2 = require('../controllers/lookups/lookups_search_controllers');
        s2.popresults(req, res);
        return;
});

router.post(/\/s\/.*\/lookup/, authenticationMiddleware(),function(req, res, next) {
    //console.log(req.user);
    //console.log(req.isAuthenticated());
    res.header("organisation_id",req.user.organisation_Id);
        let s2 = require('../controllers/lookups/lookups_list_controllers');
        s2.popresults(req, res);
        return;
});


router.get(/\/s\/.*\/new/, authenticationMiddleware(),function(req, res, next) {
    let s1 = require('../controllers/homepage/homepage_menus');
    s1.popresults(req, res,function(){
        let ourl=req.originalUrl.split('/');
        if(ourl[2].toUpperCase()==='BACCOUNTS'){
            let s2 = require('../controllers/accounts/accounts_new_view_controllers');
            s2.pushresults(req, res);
            return;
        }else {
            let s2 = require('../controllers/customobject/co_new_view_controllers');
            s2.pushresults(req, res);
            return;
        }
    });
});


router.post(/\/s\/.*\/edit/, authenticationMiddleware(),function(req, res, next) {
    //console.log('Accounts Edit');
    let s1 = require('../controllers/homepage/homepage_menus');
    s1.popresults(req, res,function(){
            if(req.query.action==='view'){
            let s2 = require('../controllers/customobject/co_edit_view_controllers');
            s2.pushresults(req, res);
            return;
            } else if(req.query.action==='save'){
                let s2 = require('../controllers/customobject/co_edit_controllers');
                s2.pushresults(req, res);
                return;

            }else {
                res.redirect("/");
            }
    });
});

router.get(/\/s\/.*\/details.*/, authenticationMiddleware(),function(req, res, next) {
    //console.log('Accounts New');
    //console.log(req.params.actionperform);
    if(req.query.menu==='false'){
        let s2 = require('../controllers/customobject/co_detail_controllers');
        s2.pushresults(req, res);
        return;
    }else {
        let s1 = require('../controllers/homepage/homepage_menus');
        s1.popresults(req, res, function () {
            let ourl = req.originalUrl.split('/');
            if (ourl[2].toUpperCase() === 'BACCOUNTS') {
                let s2 = require('../controllers/accounts/accounts_detail_controllers');
                s2.pushresults(req, res);
                return;
            } else {
                let s2 = require('../controllers/customobject/co_detail_controllers');
                s2.pushresults(req, res);
                return;
            }

        });
    }
});


router.get(/\/s\/.*/, authenticationMiddleware(),function(req, res, next) {
    res.header("organisation_id",req.user.organisation_Id);
    res.redirect(req.originalUrl+"/list");
});





//Opening New Account Form


//Saving Account
router.post(/\/s\/.*\/new/, authenticationMiddleware(),function(req, res, next) {
    //console.log('Accounts New');
    let s1 = require('../controllers/homepage/homepage_menus');
    s1.popresults(req, res,function(){
        let ourl=req.originalUrl.split('/');
        if(ourl[2].toUpperCase()==='BACCOUNTS') {
            let s2 = require('../controllers/accounts/accounts_new_save_controllers');
            s2.pushresults(req, res);
            return;
        } else {
            let s2 = require('../controllers/customobject/co_new_save_controllers');
            s2.pushresults(req, res);
            return;
        }

    });
});



router.get('/setup', authenticationMiddleware(),function(req, res, next) {
    if(req.user.is_Admin===1){
    //console.log(req.user);
    //console.log(req.isAuthenticated());
    res.header("organisation_id",req.user.organisation_Id);
    res.render('setup', { title: 'Setup' });
    } else {
        res.render('error',{title:'Objects New', message : "You Dont have access to Setup Page"});
        return;
    }
});


//Users Home page
router.get('/setup/bUsers', authenticationMiddleware(),function(req, res, next) {
    if(req.user.is_Admin===1) {
        console.log("Users Index");
        let s1 = require('../controllers/users/users_list_controllers');
        s1.popresults(req, res);
    }else {
        res.render('error',{title:'Objects New', message : "You Dont have access to Setup Page"});
        return;
    }
});


//Users List,Detail,New,Edit Actions
router.get('/setup/bUsers/:actionperform', authenticationMiddleware(),function(req, res, next) {
    if(req.user.is_Admin===1) {
        if (req.params.actionperform === "list") {
            return res.redirect('/setup/bUsers');
        } else if (req.params.actionperform === 'new') {
            res.header("organisation_id", +req.user.organisation_Id);
            res.render('setup', {title: 'Users New'});
        } else if (req.params.actionperform === 'details') {
            let s1 = require('../controllers/users/users_detail_controllers');
            s1.detailresults(req, res);
        } else if (req.params.actionperform === 'edit') {
            res.render('setup', {title: 'Users Edit'});
        } else {
            res.render('setup', {title: 'Setup Post'});
        }
    }else {
        res.render('error',{title:'Objects New', message : "You Dont have access to Setup Page"});
        return;
    }
});


//Users Post New Record
router.post('/setup/bUsers/new', authenticationMiddleware(),function(req, res, next) {
    if(req.user.is_Admin===1) {
        let s1 = require('../controllers/users/users_new_controllers');
        s1.pushresults(req, res);
    }else {
        res.render('error',{title:'Objects New', message : "You Dont have access to Setup Page"});
        return;
    }
});

//Users Post Edit Record
router.post('/setup/bUsers/edit', authenticationMiddleware(),function(req, res, next) {
    if (req.user.is_Admin === 1) {
        if (req.query.action === "view") {
            let s1 = require('../controllers/users/users_edit_view_controllers');
            s1.edit_view_results(req, res);
        } else if (req.query.action === "save") {
            let s1 = require('../controllers/users/users_edit_controllers');
            s1.editresults(req, res);
        } else {
            res.render('setup', {title: 'Users List'});
        }
    }else {
        res.render('error',{title:'Objects New', message : "You Dont have access to Setup Page"});
        return;
    }
});


//End of Users Routes



//Profiles Home page
router.get('/setup/profiles', authenticationMiddleware(),function(req, res, next) {
    if (req.user.is_Admin === 1) {
        let s1 = require('../controllers/profiles/profiles_list_controllers');
        s1.popresults(req, res);
    }else {
        res.render('error',{title:'Objects New', message : "You Dont have access to Setup Page"});
        return;
    }
});


//Profiles List,Detail,New,Edit Actions
router.get('/setup/profiles/:actionperform', authenticationMiddleware(),function(req, res, next) {
    if (req.user.is_Admin === 1) {
        // let pattern = /^details\?[a-z0-9]/g;

        if (req.params.actionperform === "list") {
            return res.redirect('/setup/profiles');
        } else if (req.params.actionperform === 'new') {
            res.header("organisation_id", +req.user.organisation_Id);
            res.render('setup', {title: 'Profiles New'});
        } else if (req.params.actionperform === 'details') {
            let s1 = require('../controllers/profiles/profiles_detail_controllers');
            s1.detailresults(req, res);
        } else if (req.params.actionperform === 'edit') {
            res.render('setup', {title: 'Profiles Edit'});
        } else {
            res.render('setup', {title: 'Setup Post'});
        }
    }else {
        res.render('error',{title:'Objects New', message : "You Dont have access to Setup Page"});
        return;
    }
});


//Profiles Post New Record
router.post('/setup/profiles/new', authenticationMiddleware(),function(req, res, next) {
    if (req.user.is_Admin === 1) {
        let s1 = require('../controllers/profiles/profiles_new_controllers');
        s1.pushresults(req, res);
    }else {
        res.render('error',{title:'Objects New', message : "You Dont have access to Setup Page"});
        return;
    }
});

//Profiles Post Edit Record
router.post('/setup/profiles/edit', authenticationMiddleware(),function(req, res, next) {
    if (req.user.is_Admin === 1) {
        if (req.query.action === "view") {
            let s1 = require('../controllers/profiles/profiles_edit_view_controllers');
            s1.edit_view_results(req, res);
        } else if (req.query.action === "save") {
            let s1 = require('../controllers/profiles/profiles_edit_controllers');
            s1.editresults(req, res);
        } else {
            res.render('setup', {title: 'Profiles List'});
        }
    }else {
        res.render('error',{title:'Objects New', message : "You Dont have access to Setup Page"});
        return;
    }
});

//End of Profiles routes




//Objects Home page
router.get('/setup/objects', authenticationMiddleware(),function(req, res, next) {
    if (req.user.is_Admin === 1) {
        let s1 = require('../controllers/objects/objects_list_controllers');
        s1.popresults(req, res);
    }else {
        res.render('error',{title:'Objects New', message : "You Dont have access to Setup Page"});
        return;
    }
});


//Objects List,Detail,New,Edit Actions
router.get('/setup/objects/:actionperform', authenticationMiddleware(),function(req, res, next) {
    if (req.user.is_Admin === 1) {
        if (req.params.actionperform === "list") {
            return res.redirect('/setup/objects');
        } else if (req.params.actionperform === 'new') {
            res.header("organisation_id", +req.user.organisation_Id);
            res.render('setup', {title: 'Objects New'});
        } else if (req.params.actionperform === 'details') {
            let s1 = require('../controllers/objects/objects_detail_controllers');
            s1.detailresults(req, res);
        } else if (req.params.actionperform === 'edit') {
            res.render('setup', {title: 'Objects Edit'});
        } else {
            res.render('setup', {title: 'Setup Post'});
        }
    }else {
        res.render('error',{title:'Objects New', message : "You Dont have access to Setup Page"});
        return;
    }
});


//Objects Post New Record
router.post('/setup/objects/new', authenticationMiddleware(),function(req, res, next) {
    if (req.user.is_Admin === 1) {
        let s1 = require('../controllers/objects/objects_new_controllers');
        s1.pushresults(req, res);
    }else {
        res.render('error',{title:'Objects New', message : "You Dont have access to Setup Page"});
        return;
    }
});

//Objects Post Edit Record
router.post('/setup/objects/edit', authenticationMiddleware(),function(req, res, next) {
    if (req.user.is_Admin === 1) {
        if (req.query.action === "view") {
            let s1 = require('../controllers/objects/objects_edit_view_controllers');
            s1.edit_view_results(req, res);
            return;
        } else if (req.query.action === "save") {
            let s1 = require('../controllers/objects/objects_edit_controllers');
            s1.editresults(req, res);
            return;
        } else {
            res.render('setup', {title: 'Setup Post'});
            return;
        }
    }else {
        res.render('error',{title:'Objects New', message : "You Dont have access to Setup Page"});
        return;
    }
});

//End of Objects routes



//Objects Fields

router.post('/setup/objects/objectfields/:actionperform', authenticationMiddleware(),function(req, res, next) {
    if (req.user.is_Admin === 1) {
        if (req.params.actionperform === 'new' && req.query.action === "view") {

            let s1 = require('../controllers/object_fields/objectfields_new_view_controllers');
            s1.pushresults(req, res);
            return;

        } else if (req.params.actionperform === 'new' && req.query.action === "save") {
            let s1 = require('../controllers/object_fields/objectfields_new_controllers');
            s1.pushresults(req, res);
            return;
        } else {
            res.render('setup', {title: 'Setup Post'});
            return;
        }
    }else {
        res.render('error',{title:'Objects New', message : "You Dont have access to Setup Page="+req.user.is_Admin});
        return;
    }
});

//Custom Scripts

router.post('/setup/objects/customscripts/:actionperform', authenticationMiddleware(),function(req, res, next) {
    if (req.user.is_Admin === 1) {
        if (req.params.actionperform === 'new' && req.query.action === "view") {
            let s1 = require('../controllers/customScripts/customscript_new_view_controllers');
            s1.pushresults(req, res);
            return;
        } else if (req.params.actionperform === 'new' && req.query.action === "save") {
            let s1 = require('../controllers/customScripts/customscript_new_controllers');
            s1.pushresults(req, res);
            return;
        } else {
            res.render('setup', {title: 'Setup Post'});
            return;
        }
    }else {
        res.render('error',{title:'Objects New', message : "You Dont have access to Setup Page"});
        return;
    }
});

router.post('/setup/objects/lookups/:actionperform', authenticationMiddleware(),function(req, res, next) {
    if (req.user.is_Admin === 1) {
        if (req.params.actionperform === 'new' && req.query.action === "view") {
            let s1 = require('../controllers/object_lookups/objlookup_new_view_controllers');
            s1.pushresults(req, res);
            return;
        } else if (req.params.actionperform === 'new' && req.query.action === "save") {
            let s1 = require('../controllers/object_lookups/objlookup_new_controllers');
            s1.pushresults(req, res);
            return;
        } else {
            res.render('setup', {title: 'Setup Post'});
            return;
        }
    }else {
        res.render('error',{title:'Objects New', message : "You Dont have access to Setup Page"});
        return;
    }
});





router.post('/setup', authenticationMiddleware(),function(req, res, next) {
    if (req.user.is_Admin === 1) {
        //console.log(req.isAuthenticated());
      //  var noticia = req.body;
        //console.log(e.target.getAttribute('id'));
        // var so =require('../controllers/setup_organisation');
        res.render('setup', {title: 'Setup Post'});
    }else {
        res.render('error',{title:'Objects New', message : "You Dont have access to Setup Page"});
        return;
    }
});



router.get('/login', function(req, res, next) {

    if(req.hasOwnProperty('query')){
        if(req.query.hasOwnProperty('error')){
            res.render('login', { title: 'Login', erro:"Please enter correct Username and Password" });
            return;
        } else {
            res.render('login', { title: 'Login'});
            return;
        }
    }else {
    res.render('login', { title: 'Login'});
    return;
    }
});


/*
router.post('/login' , passport.authenticate(
    'local',
    {
        successRedirect: '/',
        failureRedirect: '/login'
    })
); */

router.post('/login', function(req, res, next) {
    passport.authenticate('local', function(err, user, info) {
        if (err) { return next(err); }
        if (!user) { return res.redirect('/login'); }
        req.logIn(user, function(err) {
            if (err) { return next(err); }
            let  ldb=require('../db');
            let location='';
            let iplocation = require("iplocation").default;
            iplocation(req.ip)
            .then((rest) => {
                location=JSON.stringify(rest);
                console.log("Logging In from");
                console.log(location);
                let lsql='INSERT INTO Logsession (user_id,organisation_id ,user_action,locationdata) VALUES (?,?,\'LoggedIn\',?);'
                ldb.query(lsql,[req.user.user_id,req.user.organisation_Id,location],function(lerr,lresults){
                    if(lerr) {
                        res.render('error',{message:'Unable to log into Logsession', error : lerr});
                        return;
                    } else {
                        console.log(JSON.stringify(lresults));
                        return setTimeout(function() {
                            res.redirect('/');
                        }, 1000);
                    }
                });
            })
            .catch(err => {
                console.log("error");
            });
        });
    })(req, res, next);
});

router.get('/logout', function(req, res, next) {
    let  ldb=require('../db');
    let location='';
    let iplocation = require("iplocation").default;
    iplocation(req.ip)
        .then((rest) => {
            location=JSON.stringify(rest);
            console.log("Logging Out from");
            console.log(location);
            let lsql='INSERT INTO Logsession (user_id,organisation_id ,user_action,locationdata) VALUES (?,?,\'LoggedOut\',?);'
            ldb.query(lsql,[req.user.user_id,req.user.organisation_Id,location],function(lerr,lresults){
                if(lerr) {
                    res.render('error',{message:'Unable to log into Logsession', error : lerr});
                    return;
                } else {
                    console.log(JSON.stringify(lresults));
                    req.logout();
                    console.log("logged out id:"+req.sessionID);
                    req.session.destroy(() => {
                        res.clearCookie('connect.sid')
                        setTimeout(function() {
                            res.redirect('/');
                        }, 1000);
                    });
                }
            });
        })
        .catch(err => {
            console.log("error");
        });
});



router.get('/register', function(req, res, next) {
    req.session.destroy(() => {
        res.clearCookie('connect.sid');
        res.render('register', { title: 'Registration' });
    });
});





router.post('/register', function(req, res, next) {
    var noticia = req.body;
    console.log(noticia);
    //req.assert('username','username cannot be empty').notEmpty();
    //req.assert('username','Username should be in between  15 and 5 characters').len(5,15);
    //req.assert('email','Email cannot be empty').notEmpty();
    //req.assert('email','Email should be in xyz@***.** format').isEmail();
    req.checkBody('username', 'Username field cannot be empty.').notEmpty();
    req.checkBody('username', 'Username must be between 4-15 characters long.').len(4, 15);
    req.checkBody('email', 'The email you entered is invalid, please try again.').isEmail();
    req.checkBody('email', 'Email address must be between 4-100 characters long, please try again.').len(4, 100);
    req.checkBody('password', 'Password must be between 8-100 characters long.').len(8, 100);
    req.checkBody("password", "Password must include one lowercase character, one uppercase character, a number, and a special character.").matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?!.* )(?=.*[^a-zA-Z0-9]).{8,}$/, "i");
    req.checkBody('passwordMatch', 'Password must be between 8-100 characters long.').len(8, 100);
    req.checkBody('passwordMatch', 'Passwords do not match, please try again.').equals(req.body.password);
// Additional validation to ensure username is alphanumeric with underscores and dashes
    req.checkBody('username', 'Username can only contain letters, numbers, or underscores.').matches(/^[A-Za-z0-9_-]+$/, 'i');
    const errors= req.validationErrors();
    if(errors){
        console.log('errors:'+ JSON.stringify(errors));
        res.render('register',{title:'Registration Errors', errors : errors});
        return;
    }
    console.log("Next Statement");
      const username=req.body.username;
      const password=req.body.password;
      const email=req.body.email;
      console.log("Hello"+req.body.username);
      const  db=require('../db.js');
      bcrypt.hash(password,saltRound,function (err,hash) {
          db.query('INSERT INTO users (username,email,password,Profile_Name) VALUES (?,?,?,?)',[username,email,hash,1], function
              (error,results,fields){
              if(error) throw error;
              db.query('SELECT LAST_INSERT_ID() as user_id',function (error,results,fields) {
                  if(error) throw error;
                  const user_id = results[0]['user_id'];
                  let orgid='u00000'+user_id;
                  console.log('user_id='+user_id+' orgid='+orgid);
                  db.query('call Update_Organisation_Id(?,?)',[orgid,user_id], function (error1,results1) {
                      if(error1) throw error1;
                      console.log('updating procedure'+orgid+" and  "+user_id);
                      console.log(JSON.stringify(results1));
                      req.login(user_id,function (err) {
                          res.redirect('/logout');
                      });
                      return;
                  });

              });
          });
      });
});



router.get(/.*/, function(req, res, next) {
    res.redirect('/');
    return;
});


passport.serializeUser(function (user_id,done) {
    done(null,user_id);
});

passport.deserializeUser(function (user_id,done) {
    done(null,user_id);
});

function authenticationMiddleware () {
    return (req, res, next) => {
        //console.log(`req.session.passport.user: ${JSON.stringify(req.session.passport)}`);

        if (req.isAuthenticated()) return next();
        req.logout();
        req.session.destroy(() => {
            res.clearCookie('connect.sid')
            setTimeout(function() {
                res.redirect('/');
            }, 1000);
        });
        res.redirect('/login');
        return;
    }
}

module.exports = router;
