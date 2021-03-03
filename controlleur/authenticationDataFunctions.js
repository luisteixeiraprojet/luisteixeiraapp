//Import other Modules

const poolConnectDB = require("../models/connectionDB");
const Employee = require("../models/employee");
const jwt = require("jsonwebtoken");
const md5 = require('md5');
const dotenv = require("dotenv");
const employeeDAO = require("./employeeDataFunctions");
const sendMail = require("./sendMail");

class AuthDao{

  theEmployee = new Employee();

  //variables in doc.env
  constructor(){
    dotenv.config();
  }
//_______________________________________________________
//when updating all profil
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
        let e =  new Error("Your userName and/or password are incorrects");
        e.status=401
        throw e;
      }else{
     
       this.theEmployee.fillEmployeeInfo(rowsDb[0][0]);
       this.theEmployee.sessionId = this.generateAccessToken({ username: bodyValues.userName});
       return this.theEmployee.safeUserDetailed();
      };
    }

//_______________________________________________
  generateAccessToken(username) {
  return jwt.sign(username, process.env.TOKEN_SECRET, { expiresIn: '3500s' });
}

//_______________________________________________
createResponse(content, token){
  return {content : content, newToken: token }
}

//_____________________________________________
//when employee forgets psw
async createAndUpdateNewPsw(infosEmplObj){

  let idEmpl = infosEmplObj.Id_employee;
  let pass = employeeDAO.generatePsw();

  infosEmplObj.password=pass;
 employeeDAO.updatePassword(idEmpl,infosEmplObj);
 
  sendMail(infosEmplObj, pass );
} 

//________________________________________________
//when employee forgets psw
async userNameExists(bodyValues){

  let userName =  bodyValues.userName;
  let emplInfosFromDB;

    let rowsDb;
    try {
        rowsDb = await poolConnectDB.query(
            "SELECT * FROM employee WHERE userName= ? ",
            [userName]
        );
        emplInfosFromDB =  rowsDb[0][0];
       
      } catch (error) {
        console.log("Error: userNameExists " + error.message);
        error.status = 500; //when problems serveur erreurs the message comes from the library
        throw error;
      }
      if (rowsDb[0].length < 1) {
       let e = new Error("Your userName is incorrect");
        e.status = 403; //code forbidden 
        throw e;
      }else{
      this.createAndUpdateNewPsw(emplInfosFromDB);

      return emplInfosFromDB;
      };
}

//____________________________________________
}//closes class

//export to become accessible by other modules
module.exports = new AuthDao();