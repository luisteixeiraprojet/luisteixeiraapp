const TimeSheet = require("../models/timeSheet");
const poolConnectDB = require("../models/connectionDB");

class AbsenceDAO { 

//______________________________________________________________
//Get All TS

async getAllTimeSheets() {
    try {

      const queryResult = await poolConnectDB.query(

"SELECT employee.firstName, employee.lastName, activity.name, timesheet.Id_timeSheet, " +
" timesheet.beginningDate, timesheet.finishDate, timesheet.totalHours, timesheet.priceHour, timesheet.Id_activity, timesheet.Id_employee " +
" FROM timesheet INNER JOIN activity" +
" ON timesheet.Id_activity= activity.Id_activity" +
" INNER JOIN employee" +
" ON timesheet.Id_employee=employee.Id_employee" +
" ORDER BY Id_timeSheet DESC");
    
      let allTS = [];
      
      const rowsDB = queryResult[0];
      if (rowsDB.length < 1) {
        throw new Error("No timeSheet were found");
      }

      rowsDB.forEach((row) => {
        let timeSheet = new TimeSheet();
        timeSheet.fillInfoTS(row);
        allTS.push(timeSheet);
      });     
      
      return allTS;
      
    } catch (error) {
      return "getAllTSheets " + error.message;
    }
  }

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
 
}*/
//_____________________________________________________________
//Create Absence 
    async createTimeSheet(tSObject){
        const newTimeSheet = new TimeSheet();
        let queryResult; 

    //Id_timeSheet;
    newTimeSheet.startAt = tSObject.startAt;
    newTimeSheet.finishAt = tSObject.finishAt;
    newTimeSheet.priceHour = tSObject.priceHour;
    newTimeSheet.Id_activity = tSObject.Id_activity;
    newTimeSheet.Id_employee = tSObject.Id_employee;
    
     //query 
     const demandedInfos =
     "startAt,finishAt," +
     "priceHour,Id_activity,Id_employee";     
     
     const newTSInfos = [
        newTimeSheet.startAt,
        newTimeSheet.finishAt,
        newTimeSheet.priceHour,
        newTimeSheet.Id_activity,
        newTimeSheet.Id_employee
     ];
     
try {
        queryResult = await poolConnectDB.query(
        "INSERT INTO timesheet ( " +
          demandedInfos +
          ") VALUES (?,?,?,?,?)",
          newTSInfos
      );
    } catch (error) {
    console.log(error.message);
    return error.message
    }
newTimeSheet.Id_timeSheet=queryResult[0].insertId;
console.log("---------- o Id_timeSheet is: ", newTimeSheet.Id_timeSheet);

return newTimeSheet;
 } //closes create

 
 //_________________________________
 //UPDATE ABSENCE 
 
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
//_____________________________________________
//DELETE 
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
  
}

    











}//closes class


//export to become accessible by other modules
module.exports = new AbsenceDAO();
