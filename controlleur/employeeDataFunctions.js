
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
    //  console.log("dentro de getAll query request é:  queryResult[0");
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
  }
  
//__________________________________________________________________________
    //create password when creating an employee
    generatePsw() {
        let length = 10,
        characters ="abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        let psw = "";
      for (let i = 0, n = characters.length; i < length; ++i) {
        psw += characters.charAt(Math.floor(Math.random() * n));
      }  
      return psw;
    }
//___________________________________________________________________________

  async createEmployee(employeeObject) {
    
    //add to the fake db
    //let id = fakeEmployees.length +1;
    const newEmployee = new Employee();
    let queryResult;
    let pass = this.generatePsw();

    let employeePassword = pass;
    
    //fill with the infos from the form, employeeObject
    newEmployee.fillEmployeeInfo(employeeObject);
    newEmployee.password = md5(employeePassword);

    //query
    const demandedInfos =
      "firstName, lastName," +
      "mobilePhone,homePhone, email," +
      "address, addressComplement, zipCode," +
      "nationality, identityNumber, socialNumber," +
      "birthdayDate, iban, typeContract, joinDate," +
      "hourlyPrice, userName, password, sessionId";

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
    ];
    try {
      queryResult = await poolConnectDB.query(
        "INSERT INTO employee ( " +
          demandedInfos +
          ") VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
        newEmployeeInfos
      );
      //get the id from the DB
      newEmployee.Id_employee=queryResult[0].insertId;

      //send Mail with pass
      sendMailCont(newEmployee, employeePassword);

      return newEmployee.safeUserDetailed();
    } catch (error) {
      console.log("An error: " + error);
      return error.message;
    }
  }

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
      "userName=?, password=?, sessionId=?";

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
          updateThisEmployee.Id_employee,
        ]
      );
    } catch (error) {
      return error.message;
    }
    return updateThisEmployee;
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
