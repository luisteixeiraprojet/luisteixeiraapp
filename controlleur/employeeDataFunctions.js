//tipo controlador, camada intermedia 

//Import other Modules
const fakeEmployees = require('../models/employeesFakeDB'); //all the content of employeeFakeDB is inside this variable
const Employee = require('../models/employee');
const employees = require('../models/employeesFakeDB');
const poolConnectDB = require('../models/connectionDB');


class EmployeeDAO{

  async getAllEmployees() {

    const allEmployees = await poolConnectDB.query('SELECT * from employees');
    if (allEmployees[0].length < 1) {
      throw new Error('No employees were found');
    }
    console.log("results is: " + JSON.stringify(allEmployees[0]));
    return allEmployees[0];
  };

//__________________________________________________________________________
  async getEmployeeById(id){
    
    //search it in DB
      const rowsDb = await poolConnectDB.query('SELECT * from employees WHERE Id_employee= ?', [id]); //all rows
      if (rowsDb[0].length < 1) {
        throw new Error('There is no employee with that id ');
      }
      let employee = new Employee();
      employee.fillEmployeeInfo(rowsDb[0][0]);
      console.log("--------o employee depois de filled " + JSON.stringify(employee));
      //console.log("Employee by id is : " + JSON.stringify(employee));
      return employee;
    };

//___________________________________________________________________________
  async createEmployee(employeeObject){
    //add to the fake db of employees
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
      await poolConnectDB.query('INSERT INTO employees ( ' + demandedInfos + ') VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
    newEmployeeInfos);
    } catch (error) {
      console.log("deu erro: " + error );
      return error.message;
    }                 
    
    
    //fakeEmployees.push(newEmployee);   
    console.log("O novo empregado é: " + newEmployee);
    newEmployee.id = employeeObject.id ;
    return newEmployee; 

  };

//_________________________________________________________________
  async updateEmployee(id, bodyEmployee){

      console.log("o id passado é " + id)
      //search by id in the DB
      let updateThisEmployee;
      try {
        updateThisEmployee = await this.getEmployeeById(id); //object Employee
        console.log("----------------------" + updateThisEmployee.firstName + ' ' + updateThisEmployee.Id_employee);
      } catch (error) {
        console.log("Could not find this user by id:" + id);
        console.log("erro: " + error.message);
      }
      console.log("Pelo id dado o employee a fazer update é: " + updateThisEmployee.firstName);
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
        updateInfo = await poolConnectDB.query('UPDATE employees SET ' + demandedInfos + ' WHERE Id_employee= ?',
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
     console.log("Pelo id dado o employee a fazer update é: " + deleteThisEmployee);
     if(!deleteThisEmployee) return false;

    let employeeId = [id];
    await poolConnectDB.query('DELETE FROM employees WHERE Id_employee= ?',
      employeeId,
      function (error, results, fields) {
        if (error) throw error;
        console.log("Employee p apagar tem id: " + employeeId);
      });
        //fakeEmployees.push(newEmployee);   
        console.log("O empregado apagado é : " + deleteThisEmployee);
        return deleteThisEmployee; 
  }
} 
//export to become accessible by other modules
module.exports = new EmployeeDAO(); 
