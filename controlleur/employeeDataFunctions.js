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
      const employeeById = await poolConnectDB.query('SELECT * from employees WHERE id = ?', [id]);
      if (employeeById[0].length < 1) {
        throw new Error('There is no employee with that id ');
      }
      return employeeById[0][0];
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
  
    //query
    const demandedInfos = "firstName, lastName," +
                       "mobilePhone,homePhone, email," +
                       "address, addressComplement, zipCode," +
                       "nationality, identityNumber, socialNumber," +
                       "birthdayDate, age, iban, typeContract, joinDate";

    const newEmployeeInfos = [newEmployee.firstName,newEmployee.lastName, 
                        newEmployee.mobilePhone,newEmployee.homePhone,newEmployee.email,
                        newEmployee.address, newEmployee.adressComplement,newEmployee.zipCode,
                        newEmployee.nationality, newEmployee.identityNumber,newEmployee.socialNumber,
                        newEmployee.birthdayDate, newEmployee.age,newEmployee.iban, newEmployee.typeContract, newEmployee.joinDate];          

    await poolConnectDB.query('INSERT INTO employees ( ' + demandedInfos + ') VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
    newEmployeeInfos,
    function (error, results, fields) {
    if (error) throw error;
  })
    //fakeEmployees.push(newEmployee);   
    console.log("O novo empregado é: " + newEmployee);
    return newEmployee; 

  };

//_________________________________________________________________
  async updateEmployee(id, bodyEmployee){

      console.log("o id passado é " + id);
      //search by id in the DB
      const updateThisEmployee = this.getEmployeeById(id); 
      console.log("Pelo id dado o employee a fazer update é: " + JSON.stringify(updateThisEmployee));
      if(!updateThisEmployee) return false;

      console.log("o nome antes da query é: " + bodyEmployee.firstName);

      //variables to use
      const demandedInfos = "firstName, lastName," +
                            "mobilePhone,homePhone, email," +
                            "address, addressComplement, zipCode," +
                            "nationality, identityNumber, socialNumber," +
                            "birthdayDate, age, iban, typeContract, joinDate";
      //update
      let firstName = bodyEmployee.firstName;
      try {
        let updatedEmployee = await poolConnectDB.query('UPDATE employees SET firstName = '  + firstName + ' WHERE id = ' + id);
        console.log("o updatedEmployee " + JSON.stringify(updatedEmployee));
      } catch (error) {
        return error.message;
      }
      
    
    console.log("o employee a update é : " + updateThisEmployee.firstName + ", id: " + updateThisEmployee.id);
    return updateThisEmployee;
  };

    

      
/*
  updateEmployee(id, bodyEmployee){
    //search by id in the DB
    const updateThisEmployee = this.getEmployeeById(id); 
    console.log("Pelo id dado o employee a fazer update é: " + updateThisEmployee);
    if(!updateThisEmployee) return false;

    //loop all the updated properties of the newObject, compare with others already existents and update
    Object.keys(bodyEmployee).forEach(key => {
      if(bodyEmployee[key] != updateThisEmployee[key]){
        updateThisEmployee[key] = bodyEmployee[key];
      }
    });

    return fakeEmployees;
  }*/

//_________________________________________________________________
  async deleteEmployee(id){

     //search by id in the DB
     const deleteThisEmployee = this.getEmployeeById(id); 
     console.log("Pelo id dado o employee a fazer update é: " + deleteThisEmployee);
     if(!deleteThisEmployee) return false;

    let employeeId = [id];
    await poolConnectDB.query('DELETE FROM employees WHERE id = ?',
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
