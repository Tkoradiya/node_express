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
    console.log("Student Database Connected");
  }
  else{
    console.log("Error Connecting Database");
  }
})

router.get('/add',function(req, res, next) {
   
  connenction.query("select * from db_department",function(err,db_rows){
    if(err) throw err;
    console.log(db_rows);
    res.render('student/student_add',{db_rows_array:db_rows});
  });
});

router.post('/add',function(req, res){
    console.log(req.body);
    const mybodydata = {
    
      department_id : req.body.department_id,
      first_name : req.body.first_name,
      middle_name : req.body.middle_name,
      last_name : req.body.last_name,
      city : req.body.city,
      address : req.body.address,
      email : req.body.email,
      mobile : req.body.mobile
    }
    connenction.query("insert into db_student set ?",mybodydata,function(err, result){
      if(err) throw err;
      res.render('student/student_add',{ success : 'Data inserted' });
    })
});
  
router.get('/display', function(req, res, next) {
    connenction.query("select * from db_student", function(err, db_rows){
      if(err) throw err;
      console.log(db_rows);
      res.render('student/student_display', {db_rows_array: db_rows});
    })
});
  
router.get('/delete/:id/', function(req,res,next){
    var deleteid = req.params.id;
    console.log("Delete is is:"+ deleteid);
  
    connenction.query("Delete from db_student where student_id = ?", [deleteid], function(err,db_rows){
      if(err) throw err;
      console.log(db_rows);
      console.log("Record Deleted");
      res.redirect('/student/display');
    })
});
  
router.get('/show/:id/', function(req,res,next){
    var showid = req.params.id;
    console.log("Show id is:" + showid);
  
    connenction.query("Select * from db_student where student_id = ?" , [showid], function(err, db_rows){
      console.log(db_rows);
      if(err) throw err;
      res.render('student/student_show',{db_rows_array:db_rows});
    })
});
  
router.get('/edit/:id/',function(req,res,next){
  console.log("Edit id is:" + req.params.id);
  var student_id = req.params.id;

  connenction.query("Select * from db_student where student_id = ?", [student_id], function(err, db_rows){
    if(err) throw error;
    console.log(db_rows);

    connenction.query("select * from db_student",function(err,db_rows){
      if(err) throw err;
      console.log(db_rows);
    res.render('student/student_edit', {db_rows_array: db_rows});
  })
  })
});

router.post('/edit/:id/', function(req,res,next){
  console.log("Edit id is:" + req.params.id);

  var studentid = req.params.id;

  var departmentid = req.body.department_id;
  var firstname = req.body.first_name;
  var middlename = req.body.middle_name;
  var lastname = req.body.last_name;
  var city = req.body.city;
  var address = req.body.address;
  var email = req.body.email;
  var mobile = req.body.mobile;

  connenction.query("Update db_student set department_id = ?, first_name = ?, middle_name = ?, last_name = ?, city = ?, address = ?, email = ?, mobile = ? where student_id = ?", [departmentid, firstname, middlename, lastname, city, address, email, mobile, studentid], function(err, respond){
    if(err) throw err;
    res.redirect('/student/display');
  })
});
  
module.exports = router;