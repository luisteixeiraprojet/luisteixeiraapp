//tipo controlador, camada intermedia 

//Import other Modules
const fakeEmployees = require('../models/employeesFakeDB'); //all the content of employeeFakeDB is inside this variable
const Employee = require('../models/employee');
const employees = require('../models/employeesFakeDB');
const connectionDB = require('../models/connectionDB');


class EmployeeDAO{

  getAllEmployees(){
    return fakeEmployees;
  }
 
  getEmployeeById(id){
    //search it in DB
    const employeeById = fakeEmployees.find(eachEmployee => eachEmployee.id === id); 
    if(!employeeById) return false;
    return employeeById;
  }

  createEmployee(employeeObject){
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
    const allColumns = "firstName, lastName," +
                       "mobilePhone,homePhone, email," +
                       "address, addressComplement, zipCode," +
                       "nationality, identityNumber, socialNumber," +
                       "birthdayDate, age, iban, typeContract, joinDate";

    const allValues =   [newEmployee.firstName,newEmployee.lastName, 
                        newEmployee.mobilePhone,newEmployee.homePhone,newEmployee.email,
                        newEmployee.address, newEmployee.adressComplement,newEmployee.zipCode,
                        newEmployee.nationality, newEmployee.identityNumber,newEmployee.socialNumber,
                        newEmployee.birthdayDate, newEmployee.age,newEmployee.iban, newEmployee.typeContract, newEmployee.joinDate]               
/*
connectionDB.query('INSERT INTO employees (firstName, lastName, mobilePhone, homePhone, email, address, addressComplement, zipCode, nationality, identityNumber, socialNumber,birthdayDate, age, iban, typeContract, joinDate) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
  [newEmployee.firstName,newEmployee.lastName, 
    newEmployee.mobilePhone,newEmployee.homePhone,newEmployee.email,
    newEmployee.address, newEmployee.adressComplement,newEmployee.zipCode,
    newEmployee.nationality, newEmployee.identityNumber,newEmployee.socialNumber,
    newEmployee.birthdayDate, newEmployee.age,newEmployee.iban, newEmployee.typeContract, newEmployee.joinDate],
   
    function (error, results, fields) {
    if (error) throw error;
    
    console.log("Employee created with the id: " + results.insertId)
    newEmployee.id = results.id;
  });
    fakeEmployees.push(newEmployee);   
    return newEmployee; 
  }*/
      

  /* connectionDB.query('INSERT INTO employees ( ' + allColumns + ') VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
   allValues,
   function (error, results, fields) {
    if (error) throw error;
    
    console.log("Employee created with the id: " + results.insertId)
    newEmployee = results.id;
  });
    fakeEmployees.push(newEmployee);   
    return newEmployee; 
  }*/

  updateEmployee(id, bodyEmployee){
    //search by id in the DB
    const theEmployee = this.getEmployeeById(id); 
    if(!theEmployee) return false;

    //loop all the updated properties of the newObject, compare with others already existents and update
    Object.keys(bodyEmployee).forEach(key => {
      if(bodyEmployee[key] != theEmployee[key]){
        theEmployee[key] = bodyEmployee[key];
      }
    });

    return fakeEmployees;
  }

  deleteEmployee(id){
    //search it in DB
    const employeeToDelete = fakeEmployees.find(eachEmployee => eachEmployee.id === id); 
    if(!employeeToDelete) return false;
    
    //delete
    const indexEmployeeToDelete = fakeEmployees.indexOf(employeeToDelete);
    fakeEmployees.splice(indexEmployeeToDelete, 1);
    return fakeEmployees;
  }

}

//export to become accessible by other modules
module.exports = new EmployeeDAO(); 