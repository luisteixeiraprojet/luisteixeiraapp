//Import other Modules

const poolConnectDB = require("../models/connectionDB");


class AuthDao{
    
    
    
 async employeeExists(bodyValues){
    let rowsDb;
    try {
        rowsDb = await poolConnectDB.query(
            "SELECT * FROM employee WHERE userName= ? AND password= ?",
            [bodyValues.userName, bodyValues.password]
        );
           console.log("AuthenticationData employeeExists: rowsDb ",  rowsDb[0]);
      } catch (error) {
        console.log("deu erro: " + error);
        return error.message;
      }

      if (rowsDb[0].length < 1) {
        throw new Error("Your userName and/or password are incorrects");
      }else{
          return "welcome to your account";
      };
    }
}//closes class

//export to become accessible by other modules
module.exports = new AuthDao();