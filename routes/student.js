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
   
  connenction.run("select * from department",function(err,db_rows){
    if(err) throw err;
    console.log(db_rows);
    res.render('student/student_add',{db_rows_array:db_rows});
  });
});

router.post('/add',function(req, res){
    console.log(req.body);
    const mybodydata = {
    
      dept_id : req.body.dept_id,
      fname : req.body.fname,
      lname : req.body.lname,
      city : req.body.city,
      address : req.body.address,
      email : req.body.email,
      mobile : req.body.mobile
    }
    connenction.run("insert into student set ?",mybodydata,function(err, result){
      if(err) throw err;
      res.render('student/student_add',{ success : 'Data inserted' });
    })
});
  
router.get('/display', function(req, res, next) {
    connenction.query("select * from student", function(err, db_rows){
      if(err) throw err;
      console.log(db_rows);
      res.render('student/student_display', {db_rows_array: db_rows});
    })
});
  
router.get('/delete/:id/', function(req,res,next){
    var deleteid = req.params.id;
    console.log("Delete is is:"+ deleteid);
  
    connenction.query("Delete from student where student_id = ?", [deleteid], function(err,db_rows){
      if(err) throw err;
      console.log(db_rows);
      console.log("Record Deleted");
      res.redirect('/student/display');
    })
});
  
router.get('/show/:id/', function(req,res,next){
    var showid = req.params.id;
    console.log("Show id is:" + showid);
  
    connenction.query("Select * from student where student_id = ?" , [showid], function(err, db_rows){
      console.log(db_rows);
      if(err) throw err;
      res.render('student/student_show',{db_rows_array:db_rows});
    })
});
  
router.get('/edit/:id/',function(req,res,next){
  console.log("Edit id is:" + req.params.id);
  var student_id = req.params.id;

  connenction.query("Select * from student where student_id = ?", [student_id], function(err, db_rows){
    if(err) throw error;
    console.log(db_rows);

    connenction.query("select * from student",function(err,db_rows){
      if(err) throw err;
      console.log(db_rows);
    res.render('student/student_edit', {db_rows_array: db_rows});
  })
  })
});

router.post('/edit/:id/', function(req,res,next){
  console.log("Edit id is:" + req.params.id);

  var studentid = req.params.id;

  var departmentid = req.body.dept_id;
  var firstname = req.body.fname;
  var lastname = req.body.lname;
  var city = req.body.city;
  var address = req.body.address;
  var email = req.body.email;
  var mobile = req.body.mobile;

  connenction.query("Update student set dept_id = ?, fname = ?, lname = ?, city = ?, address = ?, email = ?, mobile = ? where student_id = ?", [departmentid, firstname, lastname, city, address, email, mobile, studentid], function(err, respond){
    if(err) throw err;
    res.redirect('/student/display');
  })
});
  
module.exports = router;