var express = require('express');
var router = express.Router();

var sqlite3 = require('sqlite3'); 

var connenction = new sqlite3.Database('./db/sqlite.db', sqlite3.OPEN_READWRITE, (err) => {
  if(err) 
  { 
      console.log("Error Occurred - " + err.message); 
  } 
  else
  { 
      console.log("DataBase Connected"); 
  } 
}) 

router.get('/add',function(req, res, next) {
  console.log("123");
    res.render('department/department_add');
    
  });

router.post('/add',function(req, res){
    console.log(req.body);
    const mybodydata = {
      name : req.body.name
    }
    connenction.run("insert into department set ?",mybodydata,function(err, result){
      if(err) throw err;
      res.render('department/department_add',{ success : 'Data inserted' });
    })
});
  
router.get('/display', function(req, res, next) {
    connenction.run("select * from department", function(err, db_rows){
      if(err) throw err;
      console.log(db_rows);
      res.render('department/department_display', {db_rows_array: db_rows});
    })
});
  
router.get('/delete/:id/', function(req,res,next){
    var deleteid = req.params.id;
    console.log("Delete is is:"+ deleteid);
  
    connenction.query("Delete from department where dept_id = ?", [deleteid], function(err,db_rows){
      if(err) throw err;
      console.log(db_rows);
      console.log("Record Deleted");
      res.redirect('/department/display');
    })
});
  
router.get('/show/:id/', function(req,res,next){
    var showid = req.params.id;
    console.log("Show id is:" + showid);
  
    connenction.query("Select * from department where dept_id = ?" , [showid], function(err, db_rows){
      console.log(db_rows);
      if(err) throw err;
      res.render('department/department_show',{db_rows_array:db_rows});
    })
});
  
router.get('/edit/:id/',function(req,res,next){
  console.log("Edit id is:" + req.params.id);
  var dept_id = req.params.id;

  connenction.query("Select * from department where dept_id = ?", [dept_id], function(err, db_rows){
    if(err) throw error;
    console.log(db_rows);
    res.render('department/department_edit', {db_rows_array: db_rows});
  })
});

router.post('/edit/:id/', function(req,res,next){
  console.log("Edit id is:" + req.params.id);

  var departmentid = req.params.id;

  var name = req.body.name;

  connenction.query("Update department set dept_name = ? where dept_id = ?", [name, departmentid], function(err, respond){
    if(err) throw err;
    res.redirect('/department/display');
  })
});
  
module.exports = router;