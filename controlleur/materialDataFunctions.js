const Material = require("../models/material");
const poolConnectDB = require("../models/connectionDB");

class MaterialDAO { 

//______________________________________________________________
//Get All Absence
/*
async getAllAbsences() {
    try {
      const queryResult = await poolConnectDB.query(
        "SELECT employee.firstName, employee.lastName, absence.Id_absence, absence.typeOfAbsence, absence.requestDate, absence.startDate, absence.endDate, absence.status, absence.statusDate, absence.Id_employee FROM absence INNER JOIN employee ON absence.Id_employee=employee.Id_employee ORDER BY statusDate ASC");
      
      let allAbsences = [];

      const rowsDB = queryResult[0];
      if (rowsDB.length < 1) {
        throw new Error("No absences were found");
      }

      rowsDB.forEach((row) => {
        let absence = new Absence();
        absence.fillAbsenceInfo(row);
        allAbsences.push(absence);
      });     
    
      return allAbsences;
      
    } catch (error) {
      return "getAllAbsences " + error.message;
    }
  }
*/
//_________________________________________________________
//get absence by Id
/*
async getAbsenceById(id) {

    //search it in DB
    const rowsDb = await poolConnectDB.query(
      "SELECT * from absence WHERE Id_absence= ?",
      [id]
    ); //all rows
    if (rowsDb[0].length < 1) {
      throw new Error("There is no absence with that id ");
    }
    let absence = new Absence();
    absence.fillAbsenceInfo(rowsDb[0][0]);

    return absence;
  }
*/
//____________________________________________________________
/*
async getMyAbsences(idEmployee){
  
  try {
    const queryResult = await poolConnectDB.query(
      "SELECT * from absence WHERE Id_employee = ? ORDER BY Id_absence DESC",
      [idEmployee]
    );
  
    let allMyAbsences = [];
    const rowsDb = queryResult[0];
    if (rowsDb[0].length < 1) {
      throw new Error("There are no absences for this employee");
    }

    rowsDb.forEach((row) => {
      const absence = new Absence();
      absence.fillAbsenceInfo(row);
      allMyAbsences.push(absence);
    });

    return allMyAbsences;

  } catch (error) {
    console.log("Error getMyAbsences ", error.message);
  }
 
}
*/
//_____________________________________________________________
//Create Absence 
/*
    async createAbsence(absenceObject){
        const newAbsence = new Absence();
        let queryResult; 

    //Id_absence;
    newAbsence.justification = absenceObject.justification;
    newAbsence.typeOfAbsence = absenceObject.typeOfAbsence;
    newAbsence.requestDate = absenceObject.requestDate;
    newAbsence.startDate = absenceObject.startDate;
    newAbsence.endDate = absenceObject.endDate;
    newAbsence.status = absenceObject.status;
    newAbsence.statusDate = absenceObject.statusDate;
    newAbsence.Id_employee = absenceObject.Id_employee;
    
     //query 
     const demandedInfos =
     "justification, typeOfAbsence," +
     "requestDate,startDate, endDate," +
     "status, statusDate, Id_employee";     
     
     const newAbsenceInfos = [
        newAbsence.justification,
        newAbsence.typeOfAbsence,
        newAbsence.requestDate,
        newAbsence.startDate,
        newAbsence.endDate,
        newAbsence.status,
        newAbsence.statusDate,
        newAbsence.Id_employee
     ];
     
try {
        queryResult = await poolConnectDB.query(
        "INSERT INTO absence ( " +
          demandedInfos +
          ") VALUES (?,?,?,?,?,?,?,?)",
          newAbsenceInfos
      );
    } catch (error) {
    console.log(error.message);
    return error.message
    }
newAbsence.Id_absence=queryResult[0].insertId;

return newAbsence;
 } //closes create
*/
 
 //_________________________________
 //UPDATE ABSENCE 
 /*
 async updateAbsence(bodyAbsence) {
  
     //search by id in the DB
     let updateThisAbsence;

     try {
        updateThisAbsence = await this.getAbsenceById(bodyAbsence.Id_absence); //object Absence

     } catch (error) {
       console.log("6.5. Erro depois do getById - Could not find that absence with id ", bodyAbsence.Id_absence);
       return error.message;
     }
     if (!updateThisAbsence) return false;
 
     //fill the object absence with the new info

     updateThisAbsence.fillAbsenceInfo(bodyAbsence);
 
     //variables to use
     const demandedInfos =
     "justification=?, typeOfAbsence=?," +
     "requestDate=?, startDate=?, endDate=?," +
     "status=?, statusDate=?, Id_employee=? ";   

     //update
     let updateInfo;
     try {
       
       updateInfo = await poolConnectDB.query(
        "UPDATE absence SET " + demandedInfos +  "WHERE Id_absence= ?",
         [
            updateThisAbsence.justification,
            updateThisAbsence.typeOfAbsence,
            updateThisAbsence.requestDate,
            updateThisAbsence.startDate,
            updateThisAbsence.endDate,
            updateThisAbsence.status,
            updateThisAbsence.statusDate,
            updateThisAbsence.Id_employee,
            updateThisAbsence.Id_absence
         ]
       );
     } catch (error) {
       return error.message;
     }
     console.log("///1.updateThisAbsence ", updateThisAbsence);
     return updateThisAbsence;
   }
   */
//_____________________________________________
//DELETE 
/*
async deleteAbsence(id) {

    let queryResult;

    //search by id in the DB
    const deleteThisAbsence = this.getAbsenceById(id);
   
    if (!deleteThisAbsence) return false;

    let absenceId = id;
    queryResult = await poolConnectDB.query(
      "DELETE FROM absence WHERE Id_absence= ?",
      absenceId,
      function (error, results, fields) {
        if (error) throw error;
      }
      
    );
    return deleteThisAbsence;
  
}*/

}//closes class


//export to become accessible by other modules
module.exports = new MaterialDAO();
