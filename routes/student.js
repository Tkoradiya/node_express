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
   
  
    res.render('student/student_add');

  
});

router.post('/add',function(req, res){
    console.log(req.body);
    
   

    connenction.run("insert into student(fname,lname,city,age,address,email,mobile_no) VALUES (?,?,?,?,?,?,?) ",[req.body.fname,req.body.lname,req.body.city,null,req.body.address,req.body.email,req.body.mobile],function(err, result){
      if(err) throw err;
      res.render('department/department_add',{ success : 'Data inserted' });
    })
});
  
router.get('/display', function(req, res, next) {
    


    const sql = "SELECT student.*,course.course_name,department.dept_name,enrollment.grade FROM student JOIN enrollment ON student.student_id = enrollment.student_id JOIN course ON enrollment.course_id = course.course_id JOIN department on department.dept_id = course.dept_id"
    connenction.all(sql, [], (err, rows) => {
      if (err) {
        return console.error(err.message);
      }console.log(rows);
      res.render("student/student_display", { db_rows_array: rows });
    });
});
  

router.get("/delete/:id", (req, res) => {
  const id = req.params.id;
  const sql = "DELETE FROM student WHERE student_id = ?";
  connenction.run(sql, id, err => {
    // if (err) ...
    console.log("Record Deleted");
    res.redirect("/student/display");
  });
});
  
router.get('/show/:id/', function(req,res,next){
    const id = req.params.id;
  const sql = "Select * from student where student_id = ?";
  connenction.get(sql, id, (err, row) => {
    // if (err) ...
    res.render("student/student_show", { db_rows_array: row });
  });
});
  
router.get('/edit/:id/',function(req,res,next){
  


  const id = req.params.id;
  const sql = "Select * from student where student_id = ?";
  connenction.get(sql, id, (err, row) => {
    // if (err) ...
    res.render("student/student_edit", { db_rows_array: row });
  });
});

router.post('/edit/:id/', function(req,res,next){
  console.log("Edit id is:" + req.params.id);

  const id = req.params.id;
  const data = [req.body.fname,req.body.lname,req.body.city,req.body.address,null,req.body.email,req.body.mobile, id];
  const sql = "UPDATE student SET fname = ?, lname = ?, city = ?, address = ?, age = ?, email = ?, mobile_no = ? WHERE (student_id = ?)";
  connenction.run(sql, data, err => {
    // if (err) ...
    res.redirect('/student/display');
  });
});
  
module.exports = router;