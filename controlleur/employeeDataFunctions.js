//tipo controlador, camada intermedia 

//Import other Modules
const fakeEmployees = require('../models/employeesFakeDB'); //all the content of employeeFakeDB is inside this variable
const Employee = require('../models/employee');
const poolConnectDB = require('../models/connectionDB');




class EmployeeDAO{

  async getAllEmployees() {
    const queryResult = await poolConnectDB.query('SELECT * from employee');

    let safeUserDetails = [];

    const rowsDB = queryResult[0];
    if (rowsDB.length < 1) {
      throw new Error('No employees were found');
    }
   
    rowsDB.forEach(row => {
      console.log("A row : ", row);
      const employee = new Employee();
      employee.fillEmployeeInfo(row);
      safeUserDetails.push(employee.safeUserForList());
    });

    return safeUserDetails;
  };

//__________________________________________________________________________
  async getEmployeeById(id){
    
    //search it in DB
      const rowsDb = await poolConnectDB.query('SELECT * from employee WHERE Id_employee= ?', [id]); //all rows
      if (rowsDb[0].length < 1) {
        throw new Error('There is no employee with that id ');
      }
      let employee = new Employee();
      employee.fillEmployeeInfo(rowsDb[0][0]);

      return employee;
    };

//___________________________________________________________________________
  async createEmployee(employeeObject){
    //add to the fake db 
    //let id = fakeEmployees.length +1;
    const newEmployee = new Employee();

   // newEmployee.id = id;
    newEmployee.firstName        = employeeObject.firstName;
    newEmployee.lastName         = employeeObject.lastName;
    newEmployee.mobilePhone      = employeeObject.mobilePhone;
    newEmployee.homePhone        = employeeObject.homePhone;
    newEmployee.email            = employeeObject.email;
    newEmployee.address          = employeeObject.address;
    newEmployee.adressComplement = employeeObject.adressComplem;
    newEmployee.zipCode          = employeeObject.zipCode;
    newEmployee.nationality      = employeeObject.nationality;
    newEmployee.identityNumber   = employeeObject.identityNumber;
    newEmployee.socialNumber     = employeeObject.socialNumber;
    newEmployee.birthdayDate     = employeeObject.birthdayDate;
    newEmployee.age              = employeeObject.age;
    newEmployee.iban             = employeeObject.iban;
    newEmployee.typeContract     = employeeObject.typeContract;
    newEmployee.joinDate         = employeeObject.joinDate;
    newEmployee.hourlyPrice      = employeeObject.hourlyPrice;
    newEmployee.userName         = employeeObject.userName;
    newEmployee.password         = employeeObject.password;
    newEmployee.sessionId        = employeeObject.sessionId;
  
    //query
    const demandedInfos = "firstName, lastName," +
                       "mobilePhone,homePhone, email," +
                       "address, addressComplement, zipCode," +
                       "nationality, identityNumber, socialNumber," +
                       "birthdayDate, age, iban, typeContract, joinDate," +
                       "hourlyPrice, userName, password, sessionId";

    const newEmployeeInfos = [newEmployee.firstName,newEmployee.lastName, 
                        newEmployee.mobilePhone,newEmployee.homePhone,newEmployee.email,
                        newEmployee.address, newEmployee.adressComplement,newEmployee.zipCode,
                        newEmployee.nationality, newEmployee.identityNumber,newEmployee.socialNumber,
                        newEmployee.birthdayDate, newEmployee.age,newEmployee.iban, newEmployee.typeContract, newEmployee.joinDate, newEmployee.hourlyPrice, newEmployee.userName, newEmployee.password, newEmployee.sessionId];          
    try {
      await poolConnectDB.query('INSERT INTO employee ( ' + demandedInfos + ') VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
    newEmployeeInfos);
    } catch (error) {
      console.log("deu erro: " + error );
      return error.message;
    }                 
    newEmployee.id = employeeObject.id ;
    return newEmployee; 
  };

//_________________________________________________________________
  async updateEmployee(id, bodyEmployee){

      //search by id in the DB
      let updateThisEmployee;
      try {
        updateThisEmployee = await this.getEmployeeById(id); //object Employee
        
      } catch (error) {
        console.log("Could not find this user by id:" + id);
        return error.message;
      }
      if(!updateThisEmployee) return false;

      //fill the object employee with the new info
      updateThisEmployee.fillEmployeeInfo(bodyEmployee);

      //variables to use
      const demandedInfos = 'firstName="?", lastName="?",' +
                            'mobilePhone="?",homePhone="?", email="?",' +
                            'address="?", addressComplement="?", zipCode="?",' +
                            'nationality="?", identityNumber="?", socialNumber="?",'+
                            'birthdayDate="?", age="?", iban="?", typeContract="?", joinDate="?", hourlyPrice="?", '+
                            'userName="?", password="?", sessionId="?"'
      //update 
      let updateInfo;
      try {                                   
        updateInfo = await poolConnectDB.query('UPDATE employee SET ' + demandedInfos + ' WHERE Id_employee= ?',
        [ updateThisEmployee.firstName,
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
          updateThisEmployee.age,
          updateThisEmployee.iban,
          updateThisEmployee.typeContract,
          updateThisEmployee.joinDate,
          updateThisEmployee.hourlyPrice,
          updateThisEmployee.userName,
          updateThisEmployee.password,
          updateThisEmployee.sessionId,
          updateThisEmployee.Id_employee]);
      } catch (error) {
        return error.message;
      }
    return updateThisEmployee;
  };

//_________________________________________________________________
  async deleteEmployee(id){

     //search by id in the DB
     const deleteThisEmployee = this.getEmployeeById(id); 
     if(!deleteThisEmployee) return false;

    let employeeId = [id];
    await poolConnectDB.query('DELETE FROM employee WHERE Id_employee= ?',
      employeeId,
      function (error, results, fields) {
        if (error) throw error;
      });
        return deleteThisEmployee; 
  }
} 

//export to become accessible by other modules
module.exports = new EmployeeDAO(); 
