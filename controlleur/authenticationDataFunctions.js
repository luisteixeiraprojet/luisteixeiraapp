//Import other Modules

const poolConnectDB = require("../models/connectionDB");

 async function employeeExists(identif, psw){
    try {
        rowsDb = await poolConnectDB.query(
            "SELECT * FROM employee WHERE userName= ? AND password= ?",
            [identif, psw]
        );
           console.log("AuthenticationData employeeExists: rowsDb ",  rowsDb)
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