//Import other Modules
const connectionDB = require('../models/connectionDB');
const employees = require('./employeesFakeDB');


class Table{ 

//CREATE TABLE EMPLOYEES
async createTables(){
 console.log("dentro da create all tables");

    let employeeTable = `  CREATE TABLE employee(
      Id_employee INT AUTO_INCREMENT NOT NULL,
      firstName VARCHAR(50) NOT NULL,
      lastName VARCHAR(50) NOT NULL,
      mobilePhone VARCHAR(30) NOT NULL,
      homePhone VARCHAR(50),
      email VARCHAR(50),
      address VARCHAR(50),
      addressComplement VARCHAR(50),
      zipCode VARCHAR(50),
      nationality VARCHAR(50),
      identityNumber VARCHAR(50),
      socialNumber VARCHAR(50),
      birthdayDate DATE,
      age INT,
      iban VARCHAR(50),
      typeContract VARCHAR(50),
      joinDate VARCHAR(50),
      hourlyPrice decimal(15,2),
      userName VARCHAR(50),
      password VARCHAR(50),
      sessionId VARCHAR(100),
      PRIMARY KEY(Id_employee)
   ); `

    let absenceTable = `  CREATE TABLE absence(
      Id_absence INT AUTO_INCREMENT NOT NULL,
      justification VARCHAR(50),
      typeOfAbsence VARCHAR(50) NOT NULL,
      requestDate VARCHAR(50) NOT NULL,
      startDate DATETIME NOT NULL,
      endDate DATETIME NOT NULL,
      status BOOLEAN,
      statusDate DATETIME,
      Id_employee INT NOT NULL,
      PRIMARY KEY(Id_absence),
      FOREIGN KEY(Id_employee) REFERENCES employee(Id_employee)
   );  `
   
   let activityTable = `CREATE TABLE activity(
      Id_activity INT AUTO_INCREMENT NOT NULL,
      name VARCHAR(50) NOT NULL,
      startDate DATE,
      endDate DATE,
      PRIMARY KEY(Id_activity)
   );`
   
   let materialTable = ` CREATE TABLE material(
      Id_material INT AUTO_INCREMENT NOT NULL,
      purchaseDate DATE NOT NULL,
      name VARCHAR(50) NOT NULL,
      quantity DECIMAL(15,2) NOT NULL,
      unitaryPrice decimal(15,2) NOT NULL,
      supplier VARCHAR(50),
      PRIMARY KEY(Id_material)
   ); `
   
   let timeSheet = `CREATE TABLE timeSheet(
      Id_timeSheet INT AUTO_INCREMENT NOT NULL,
      startAt DATETIME NOT NULL,
      finishAt DATETIME NOT NULL,
      priceHour decimal(15,2) NOT NULL,
      Id_activity INT,
      Id_employee INT NOT NULL,
      PRIMARY KEY(Id_timeSheet),
      FOREIGN KEY(Id_activity) REFERENCES activity(Id_activity),
      FOREIGN KEY(Id_employee) REFERENCES employee(Id_employee)
   ); `
   
   let materialUsedInActivity = `CREATE TABLE materialUsedInActivity(
      Id_use INT AUTO_INCREMENT NOT NULL,
      Id_material INT,
      Id_activity INT,
      PRIMARY KEY(Id_use),
      FOREIGN KEY(Id_material) REFERENCES material(Id_material),
      FOREIGN KEY(Id_activity) REFERENCES activity(Id_activity)
   ); `
    
  //conexao DB
  try {
    await connectionDB.query(employeeTable);
    await connectionDB.query(absenceTable);
    await connectionDB.query(activityTable);
    await connectionDB.query(materialTable);
    await connectionDB.query(timeSheet);
    await connectionDB.query(materialUsedInActivity);
    
    return ("depois da connexion");
  } catch (error) {
    console.log(error.message);
  }
}


deleteAllTables(){
  let deleteTables = 
  "DROP TABLE IF EXISTS material, materialUsedInActivity, activity, timeSheet, absence,employee";

  /* or like this: 
  "SET foreign_key_checks = 0;"+
  "DROP TABLE IF EXISTS employees,absence,workingHours, activity, materialUsedInActivity, material;"+
  "SET foreign_key_checks = 1;"*/
  
  try {
    connectionDB.query(deleteTables);
  } catch (error) {
    console.log(error.message);
  }
  }


//alter datatype: from varchar to date
changeDataType(){
  let datatype = "ALTER TABLE employee ALTER COLUMN joinDate DATE";  

  try {
    connectionDB.query(changeDataType);
  } catch (error) {
    console.log("deu erro na ligaçao");
    console.log(error.message);
  }
}
 

}
//export to be use par other modules
module.exports = new Table();