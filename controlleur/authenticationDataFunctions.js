//Import other Modules

const poolConnectDB = require("../models/connectionDB");
const Employee = require("../models/employee");
const jwt = require("jsonwebtoken");
const md5 = require('md5');
const dotenv = require("dotenv");


class AuthDao{

  theEmployee = new Employee();


  //variables in doc.env
  constructor(){
    dotenv.config();
  }
    
 async employeeExists(bodyValues){
   let psw =  bodyValues.password;
   let pswMd = md5(psw.toString());
    let rowsDb;
    try {
        rowsDb = await poolConnectDB.query(
            "SELECT * FROM employee WHERE userName= ? AND password= ?",
            [bodyValues.userName, pswMd]
        );
      } catch (error) {
        console.log("Error: " + error.message);
        return error.message;
      }
      if (rowsDb[0].length < 1) {
        throw new Error("Your userName and/or password are incorrects");
      }else{
       // console.log("return de employeeExists authDATAFunction  rowsDb[0] ", rowsDb[0][0]);
      
       this.theEmployee.fillEmployeeInfo(rowsDb[0][0]);
       this.theEmployee.sessionId = this.generateAccessToken({ username: bodyValues.userName});
       return this.theEmployee.safeUserDetailed();
      };
    }

//_______________________________________________
  generateAccessToken(username) {
  return jwt.sign(username, process.env.TOKEN_SECRET, { expiresIn: '200s' });
}

//_______________________________________________
createResponse(content, token){
  return {content : content, newToken: token }
}



}//closes class

//export to become accessible by other modules
module.exports = new AuthDao();