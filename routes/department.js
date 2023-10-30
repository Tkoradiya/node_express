var express = require('express');
var router = express.Router();

var mysql = require('mysql');

var connenction = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'db_test'
});

connenction.connect(function(err){
  if(!err){
    console.log("Department Database Connected");
  }
  else{
    console.log("Error Connecting Database");
  }
});

router.get('/add',function(req, res, next) {
    res.render('department/department_add');
  });

router.post('/add',function(req, res){
    console.log(req.body);
    const mybodydata = {
      name : req.body.name
    }
    connenction.query("insert into db_department set ?",mybodydata,function(err, result){
      if(err) throw err;
      res.render('department/department_add',{ success : 'Data inserted' });
    })
});
  
router.get('/display', function(req, res, next) {
    connenction.query("select * from db_department", function(err, db_rows){
      if(err) throw err;
      console.log(db_rows);
      res.render('department/department_display', {db_rows_array: db_rows});
    })
});
  
router.get('/delete/:id/', function(req,res,next){
    var deleteid = req.params.id;
    console.log("Delete is is:"+ deleteid);
  
    connenction.query("Delete from db_department where department_id = ?", [deleteid], function(err,db_rows){
      if(err) throw err;
      console.log(db_rows);
      console.log("Record Deleted");
      res.redirect('/department/display');
    })
});
  
router.get('/show/:id/', function(req,res,next){
    var showid = req.params.id;
    console.log("Show id is:" + showid);
  
    connenction.query("Select * from db_department where department_id = ?" , [showid], function(err, db_rows){
      console.log(db_rows);
      if(err) throw err;
      res.render('department/department_show',{db_rows_array:db_rows});
    })
});
  
router.get('/edit/:id/',function(req,res,next){
  console.log("Edit id is:" + req.params.id);
  var department_id = req.params.id;

  connenction.query("Select * from db_department where department_id = ?", [department_id], function(err, db_rows){
    if(err) throw error;
    console.log(db_rows);
    res.render('department/department_edit', {db_rows_array: db_rows});
  })
});

router.post('/edit/:id/', function(req,res,next){
  console.log("Edit id is:" + req.params.id);

  var departmentid = req.params.id;

  var name = req.body.name;

  connenction.query("Update db_department set name = ? where department_id = ?", [name, departmentid], function(err, respond){
    if(err) throw err;
    res.redirect('/department/display');
  })
});
  
module.exports = router;