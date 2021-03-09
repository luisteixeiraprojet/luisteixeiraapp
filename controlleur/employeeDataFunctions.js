
//Import other Modules
const fakeEmployees = require("../models/employeesFakeDB"); //all the content of employeeFakeDB is inside this variable
const Employee = require("../models/employee");
const poolConnectDB = require("../models/connectionDB");
const md5 = require('md5');
const sendMailCont = require("../controlleur/sendMail");

class EmployeeDAO {

  psw;

  async getAllEmployees() {
    try {
      const queryResult = await poolConnectDB.query("SELECT * from employee");

      let safeUserDetails = [];

      const rowsDB = queryResult[0];
      if (rowsDB.length < 1) {
        throw new Error("No employees were found");
      }
      rowsDB.forEach((row) => {
        const employee = new Employee();
        employee.fillEmployeeInfo(row);
        safeUserDetails.push(employee.safeUserForList());
      });
      return safeUserDetails;

    } catch (error) {
      return "getAllEmployees " + error.message;
    }
  }
  //__________________________________________________________________________
  async getEmployeeById(id) {

    try {
      console.log("========= id ", id);
       //search it in DB
    const rowsDb = await poolConnectDB.query(
      "SELECT * from employee WHERE Id_employee= ?",
      [id]
    ); //all rows

    if (rowsDb[0].length < 1) {
      throw new Error("There is no employee with that id ");
    }
    let employee = new Employee();
    employee.fillEmployeeInfo(rowsDb[0][0]);

    return employee;
      
    } catch (error) {
      console.log("Error getEmployeeById ", error.message);
    }
   
  }

  //__________________________________________________________________________
  //create password when creating an employee
  generatePsw() {
    let length = 10,
      characters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let psw = "";
    for (let i = 0, n = characters.length; i < length; ++i) {
      psw += characters.charAt(Math.floor(Math.random() * n));
    }
    console.log("pppp 3. - employeeDAO 61- generatePsw a psw é ", psw);
    return psw;
  }
  //___________________________________________________________________________

  async emailAlreadyExists(email) {

    //search it in DB
    try {
      const rowsDb = await poolConnectDB.query(
        "SELECT * from employee WHERE email= ?",
        [email]
      );
      return rowsDb[0]; //all rows
    } catch (error) {
      console.log("Error emailAlreadyExists() ", error.message);
    }
  }

  //______________________________________
  async createEmployee(employeeObject) {

    //first of all veify if the email is unique
    let email = employeeObject.email;
    let emailExists = await this.emailAlreadyExists(email);

    if (emailExists.length > 0) {

     return ({error : "ko", message : "That email already exists "});
    }
    else {

      //add to the fake db
      //let id = fakeEmployees.length +1;
      const newEmployee = new Employee();
      let queryResult;
      let pass = this.generatePsw();

      let employeePassword = pass;
      //fill with the infos from the form, employeeObject
      newEmployee.fillEmployeeInfo(employeeObject);
      newEmployee.password = md5(employeePassword);
      newEmployee.userName = employeeObject.email;

      //query
      const demandedInfos =
        "firstName, lastName," +
        "mobilePhone,homePhone, email," +
        "address, addressComplement, zipCode," +
        "nationality, identityNumber, socialNumber," +
        "birthdayDate, iban, typeContract, joinDate," +
        "hourlyPrice, userName, password, sessionId, role";

      const newEmployeeInfos = [
        newEmployee.firstName,
        newEmployee.lastName,
        newEmployee.mobilePhone,
        newEmployee.homePhone,
        newEmployee.email,
        newEmployee.address,
        newEmployee.adressComplement,
        newEmployee.zipCode,
        newEmployee.nationality,
        newEmployee.identityNumber,
        newEmployee.socialNumber,
        newEmployee.birthdayDate,
        newEmployee.iban,
        newEmployee.typeContract,
        newEmployee.joinDate,
        newEmployee.hourlyPrice,
        newEmployee.userName,
        newEmployee.password,
        newEmployee.sessionId,
        newEmployee.role
      ];
      try {
        queryResult = await poolConnectDB.query(
          "INSERT INTO employee ( " +
          demandedInfos +
          ") VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
          newEmployeeInfos
        );
        //get the id from the DB
        newEmployee.Id_employee = queryResult[0].insertId;

        //send Mail with pass
        sendMailCont(newEmployee, employeePassword);

        return newEmployee.safeUserDetailed();
      } catch (error) {
        console.log("An error: " + error);
        return error.message;
      }
    }//ends if 


  }//ends function create

  //_________________________________________________________________
  async updateEmployee(id, bodyEmployee) {

    //search by id in the DB
    let updateThisEmployee;
    try {
      updateThisEmployee = await this.getEmployeeById(id); //object Employee
    } catch (error) {
      console.log("Could not find this user by id:" + id);
      return error.message;
    }
    if (!updateThisEmployee) return false;

    //fill the object employee with the new info
    updateThisEmployee.fillEmployeeInfo(bodyEmployee);

    //variables to use
    const demandedInfos =
      `firstName=?, lastName=?,` +
      "mobilePhone=?,homePhone=?, email=?," +
      "address=?, addressComplement=?, zipCode=?," +
      "nationality=?, identityNumber=?, socialNumber=?," +
      "birthdayDate=?, iban=?, typeContract=?, joinDate=?, hourlyPrice=?, " +
      "userName=?, password=?, sessionId=?, role=?";

    //update
    let updateInfo;
    try {
      updateInfo = await poolConnectDB.query(
        "UPDATE employee SET " + demandedInfos + " WHERE Id_employee= ?",
        [
          updateThisEmployee.firstName,
          updateThisEmployee.lastName,
          updateThisEmployee.mobilePhone,
          updateThisEmployee.homePhone,
          updateThisEmployee.email,
          updateThisEmployee.address,
          updateThisEmployee.adressComplement,
          updateThisEmployee.zipCode,
          updateThisEmployee.nationality,
          updateThisEmployee.identityNumber,
          updateThisEmployee.socialNumber,
          updateThisEmployee.birthdayDate,
          updateThisEmployee.iban,
          updateThisEmployee.typeContract,
          updateThisEmployee.joinDate,
          updateThisEmployee.hourlyPrice,
          updateThisEmployee.userName,
          updateThisEmployee.password,
          updateThisEmployee.sessionId,
          updateThisEmployee.role,
          updateThisEmployee.Id_employee,

        ]
      );
    } catch (error) {
      return error.message;
    }
    return updateThisEmployee;
  }

  //________________________________________________________________
  async updateProfil(id, bodyProfil) {

    //console.log("pppp 3. - employeeDAO-193- dentro updateProfil ");
    //console.log("pppp 3.1 - employeeDAO-193- dc id ", id);
    // console.log("pppp 3.2 - employeeDAO-193- c bodyProfil ", bodyProfil);

    //search by id in the DB
    let updateThisEmplProfil;
    try {
      updateThisEmplProfil = await this.getEmployeeById(id); //object Employee


    } catch (error) {
      console.log("Could not find this user by id:" + id);
      return error.message;
    }
    if (!updateThisEmplProfil) return false;

    //fill the object employee with the new info
    updateThisEmplProfil.fillEmployeeInfo(bodyProfil);

    updateThisEmplProfil.password = md5(bodyProfil.password);
    //updateThisEmplProfil.email = bodyProfil.email;
    updateThisEmplProfil.userName = updateThisEmplProfil.email;

    //variables to use
    const demandedInfos =
      "email=?,userName=?,password=?";

    //update
    let updateInfo;
    try {
      updateInfo = await poolConnectDB.query(
        "UPDATE employee SET " + demandedInfos + " WHERE Id_employee= ?",
        [
          updateThisEmplProfil.email,
          updateThisEmplProfil.userName,
          updateThisEmplProfil.password,
          updateThisEmplProfil.Id_employee
        ]
      );

    } catch (error) {
      console.log("Error Update Profil ", error.message);
      return error.message;
    }
    console.log("---------- ver se assume a nova pass c md5 ", updateThisEmplProfil);
    return updateThisEmplProfil;
  }

  //_______________________________________________________________
  async updatePassword(idEmpl, emplObj) {

    // console.log("pswwwww 2.4. authDAO 245-  dentro updatePassword c emplObj VER SE IGUAL AO ANTERIOR  ", emplObj);

    //search by id in the DB
    let updateThisEmplPsw;
    try {
      console.log("pswwwww §§§§ inicio:  2.5. authDAO 250-  vai chamar getEmployeeById  ");
      updateThisEmplPsw = await this.getEmployeeById(idEmpl); //object Employee
      console.log("pswwwww  2.7. authDAO 252-  result de  getEmployeeById  ", updateThisEmplPsw[0][0]);

    } catch (error) {
      return error.message;
    }
    if (!updateThisEmplPsw) return false;

    console.log("pswwwww  2.7.1. authDAO 261-  vai fazer fill do anterior com eplObj ", emplObj);
    updateThisEmplPsw.fillEmployeeInfo(emplObj);
    console.log("pswwwww  2.8. authDAO 259-  depois de fill updateThisEmplPsw IGUAL AO ANTERIOR? ", updateThisEmplPsw);
    updateThisEmplPsw.password = md5(emplObj.password);
    console.log("pswwwww  2.9. authDAO 261-  depois do md5 PASS COM EFEITO MD5?? ", updateThisEmplPsw);

    //update
    let updateInfo;
    try {
      updateInfo = await poolConnectDB.query(
        "UPDATE employee SET password=? WHERE Id_employee= ?",
        [
          updateThisEmplPsw.password,
          updateThisEmplPsw.Id_employee
        ]);
    } catch (error) {
      console.log("Error Update Profil ", error.message);
      return error.message;
    }
    return updateThisEmplPsw;
  }

  //_________________________________________________________________
  async deleteEmployee(id) {
    let queryResult;

    //search by id in the DB
    const deleteThisEmployee = this.getEmployeeById(id);
    if (!deleteThisEmployee) return false;

    let employeeId = [id];
    queryResult = await poolConnectDB.query(
      "DELETE FROM employee WHERE Id_employee= ?",
      employeeId,
      function (error, results, fields) {
        if (error) throw error;
      }
    );
    return deleteThisEmployee;
  }
}

//export to become accessible by other modules
module.exports = new EmployeeDAO();
