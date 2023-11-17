const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql2");
const e = require("express");
const app = express();

const conn = mysql.createConnection({
  host:"localhost",
  port: 3306,
  user: "root",
  password: "root",
  database: "bicicentro"
});

var cors = require('cors')
const app = express()

app.use(cors())
app.post("/trabajadores",bodyParser.json(),(req,res) =>{
  let nombres = req.body.nombres;
  let apellidos = req.body.apellidos;
  let correo = req.body.correo;
  let dni = req.body["dni"];
  let idsede = req.body["idsede"];

  console.log("nombres: ",nombres, "| apellidos:", apellidos, "| correo:", correo, "| dni:", dni, "| idsede:", idsede );

  conn.query("select * from trabajadores", function (e, r) {
    if(e) throw e;

    if(r.length > 0){
      res.json({
        err:"un trabajador con ese dni ya existe!"
      })
    }else{
      let sql = "insert into sedes (nombres, apellidos, correo, dni, idsede) VALUES (?,?,?,?,?)";
      let params = [nombres, apellidos, correo, dni, idsede];
      conn.query(sql,params,(err) => {
        if(err) throw err;

        conn.query("select * from trabajadores",(err2, result) => {
          if(err2) throw err2;

          res.json(result);
        });
      });
    }
  });

});


app.get("/trabajadores/:dni",(req,res) => {

  let dni = req.params["dni"];

  let sql = "select * from trabajadores where dni = ?";

  conn.query(sql,[dni], (err, result, fields) => {
    if(err) throw err;

    res.json(result);
  });

});

app.get("/ventas/:dniTrabajador",(req,res) => {

  let dniTrabajador = req.params["dni"];

  let sql = "select * from ventas where dniTrabajador = ?";

  conn.query(sql,[dniTrabajador], (err, result, fields) => {
    if(err) throw err;

    res.json(result);
  });

});


app.post("/sedes",bodyParser.json(),(req,res) =>{
  let nombreSede = req.body.nombreSede;
  let idsede = req.body["idsede"];
  let direccion = req.body.direccion;

  console.log("idsede: ",idsede, "| nombreSede:", nombreSede, "| direccion:", direccion );

  conn.query("select * from sedes where idsede = ?",[idsede], function (e, r) {
    if(e) throw e;

    if(r.length > 0){
      res.json({
        err:"una sede con ese ID ya existe!"
      })
    }else{
      let sql = "insert into sedes (idsede, nombreSede, direccion) VALUES (?,?,?)";
      let params = [idsede,nombreSede,direccion];
      conn.query(sql,params,(err) => {
        if(err) throw err;

        conn.query("select * from sedes",(err2, result) => {
          if(err2) throw err2;

          res.json(result);
        });
      });
    }
  });

});

app.get("/sedes/:idsede",(req,res) => {

  let idsede = req.params["idsede"];

  let sql = "select * from sedes where idsede = ?";

  conn.query(sql,[idsede], (err, result, fields) => {
    if(err) throw err;

    res.json(result);
  });

});

app.get("/sedes/trabajadores/:idsede",(req,res) => {

  let idsede = req.params["idsede"];

  let sql = "select * from sedes where idsede = ?";

  conn.query(sql,[idsede], (err, result, fields) => {
    if(err) throw err;

    res.json(result);
  });

});

app.listen(3306,function(){
  console.log("Servidor desplegado correctamente");
});
