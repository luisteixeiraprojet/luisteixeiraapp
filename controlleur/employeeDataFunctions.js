//tipo controlador, camada intermedia

//Import other Modules
const fakeEmployees = require("../models/employeesFakeDB"); //all the content of employeeFakeDB is inside this variable
const Employee = require("../models/employee");
const poolConnectDB = require("../models/connectionDB");

class EmployeeDAO {
  async getAllEmployees() {
    try {
      console.log("inicio da funçao;");
      const queryResult = await poolConnectDB.query("SELECT * from employee");
      console.log("dentro de getAll query request é: " + queryResult);
      let safeUserDetails = [];

      const rowsDB = queryResult[0];
      if (rowsDB.length < 1) {
        throw new Error("No employees were found");
      }

      rowsDB.forEach((row) => {
        console.log("A row : ", row);
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

    console.log("chamada funçao no servico byId e o employee é: ", employee);

    return employee;
  }

  //___________________________________________________________________________
  async createEmployee(employeeObject) {
    //add to the fake db
    //let id = fakeEmployees.length +1;
    const newEmployee = new Employee();
    let queryResult;

    let psw = generatePsw();
    let employeePassword = psw;

    // newEmployee.id = id;
    newEmployee.firstName = employeeObject.firstName;
    newEmployee.lastName = employeeObject.lastName;
    newEmployee.mobilePhone = employeeObject.mobilePhone;
    newEmployee.homePhone = employeeObject.homePhone;
    newEmployee.email = employeeObject.email;
    newEmployee.address = employeeObject.address;
    newEmployee.adressComplement = employeeObject.adressComplem;
    newEmployee.zipCode = employeeObject.zipCode;
    newEmployee.nationality = employeeObject.nationality;
    newEmployee.identityNumber = employeeObject.identityNumber;
    newEmployee.socialNumber = employeeObject.socialNumber;
    newEmployee.birthdayDate = employeeObject.birthdayDate;
    newEmployee.iban = employeeObject.iban;
    newEmployee.typeContract = employeeObject.typeContract;
    newEmployee.joinDate = employeeObject.joinDate;
    newEmployee.hourlyPrice = employeeObject.hourlyPrice;
    newEmployee.userName = employeeObject.email;
    newEmployee.password = employeePassword;
    newEmployee.sessionId = employeeObject.sessionId;

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
      // console.log(x[0].insertId);
      //console.log("--------- o userName é " + newEmployee.userName);
    } catch (error) {
      console.log("deu erro: " + error);
      return error.message;
    }

    //get the id from the DB
    newEmployee.Id_employee=  queryResult[0].insertId;

    console.log("-----------New employee all info: " + JSON.stringify(newEmployee));
    return newEmployee.safeUserDetailed();
  }

  //create password when creating an employee
  generatePsw() {
    console.log("-----funcao generatePSW ");
      let length = 10,
      characters ="abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
      let psw = "";
    for (let i = 0, n = characters.length; i < length; ++i) {
      psw += characters.charAt(Math.floor(Math.random() * n));
    }
    console.log("------ psw é: " + psw);
    return psw;
  }

  //_________________________________________________________________
  async updateEmployee(id, bodyEmployee) {
    console.log("UPDATE servidor funcaço update de employeeDataFunction ");
    console.log(
      "UPdate servidor dentro da funçao update de employeeDataFunction tem o id e o bodyEmployee e ",
      id,
      JSON.stringify(bodyEmployee)
    );
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
    //console.log("query de delete é esta: " + queryResult , JSON.stringify(queryResult));
    // console.log("funcao delete de api recebeu id : " + employeeId);
    //console.log("depois de apagar retornara: " + deleteThisEmployee);
    return deleteThisEmployee;
  }
}

//export to become accessible by other modules
module.exports = new EmployeeDAO();
