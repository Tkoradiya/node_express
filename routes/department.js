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
    
    connenction.run("insert into department(dept_name) VALUES (?) ",[req.body.name],function(err, result){
      if(err) throw err;
      res.render('department/department_add',{ success : 'Data inserted' });
    })
});
  




     router.get("/display", (req, res) => {
      const sql = "SELECT * FROM department"
      connenction.all(sql, [], (err, rows) => {
        if (err) {
          return console.error(err.message);
        }console.log(rows);
        res.render("department/department_display", { db_rows_array: rows });
      });
    });
  

  
router.get("/delete/:id", (req, res) => {
  const id = req.params.id;
  const sql = "DELETE FROM department WHERE dept_id = ?";
  connenction.run(sql, id, err => {
    // if (err) ...
    res.redirect("/department/display");
  });
});
  
router.get("/show/:id", (req, res) => {
  const id = req.params.id;
  const sql = "Select * from department where dept_id = ?";
  connenction.get(sql, id, (err, row) => {
    // if (err) ...
    res.render("department/department_show", { db_rows_array: row });
  });
});

router.get("/edit/:id", (req, res) => {
  const id = req.params.id;
  const sql = "Select * from department where dept_id = ?";
  connenction.get(sql, id, (err, row) => {
    // if (err) ...
    res.render("department/department_edit", { db_rows_array: row });
  });
});




router.post("/edit/:id", (req, res) => {
  const id = req.params.id;
  const book = [req.body.dept_name, id];
  const sql = "UPDATE department SET dept_name = ? WHERE (dept_id = ?)";
  connenction.run(sql, book, err => {
    // if (err) ...
    res.redirect('/department/display');
  });
});
  
module.exports = router;