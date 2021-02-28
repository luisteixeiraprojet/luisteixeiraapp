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

async getTSById(id) {
try {

   //search it in DB
   const rowsDb = await poolConnectDB.query(
    "SELECT * FROM timesheet WHERE Id_timeSheet= ?",
    [id]
  ); //all rows

  if (rowsDb[0].length < 1) {
    throw new Error("There is no timeSheet with that id ");
  }
  let timeSheet = new TimeSheet();
  timeSheet.fillInfoTS(rowsDb[0][0]);

  return timeSheet;
  
} catch (error) {
  console.log("Error getTSById ", error.message);

}
}

//____________________________________________________________

async getMyTS(idEmployee){
  console.log("o id é passado? ")
  
  try {
    const queryResult = await poolConnectDB.query(
      "SELECT * FROM timesheet WHERE Id_employee = ? ORDER BY Id_timeSheet DESC",
      [idEmployee]
    );
      console.log("***** queryResult ",queryResult[0]);
    let allMyTimeShts = [];
    const rowsDb = queryResult[0];
    if (rowsDb[0].length < 1) {
      throw new Error("There are no absences for this employee");
    }

    rowsDb.forEach((row) => {
      const timesheet = new TimeSheet();
      timesheet.fillInfoTS(row);
      allMyTimeShts.push(timesheet);
    });

    return allMyTimeShts;

  } catch (error) {
    console.log("Error getMyTS tsDAO ", error.message);
  }
 
}
//_____________________________________________________________
//Create Absence 
    async createTimeSheet(tSObject){

        const newTimeSheet = new TimeSheet();
        let queryResult; 

    //Id_timeSheet;
    newTimeSheet.beginningDate = tSObject.beginningDate;
    newTimeSheet.finishDate = tSObject.finishDate;
    newTimeSheet.priceHour = tSObject.priceHour;
    newTimeSheet.totalHours = tSObject.totalHours;
    newTimeSheet.Id_activity = tSObject.Id_activity;
    newTimeSheet.Id_employee = tSObject.Id_employee;
    
     //query 
     const demandedInfos =
     "beginningDate,finishDate,priceHour," +
     "totalHours, Id_activity,Id_employee";     
     
     const newTSInfos = [
        newTimeSheet.beginningDate,
        newTimeSheet.finishDate,
        newTimeSheet.priceHour,
        newTimeSheet.totalHours,
        newTimeSheet.Id_activity,
        newTimeSheet.Id_employee
     ];

try {
        queryResult = await poolConnectDB.query(
        "INSERT INTO timesheet ( " +
          demandedInfos +
          ") VALUES (?,?,?,?,?,?)",
          newTSInfos
      );
    } catch (error) {
    console.log(error.message);
    return error.message
    }
newTimeSheet.Id_timeSheet=queryResult[0].insertId;


return newTimeSheet;
 } //closes create

 
 //_________________________________
 //UPDATE ABSENCE 
 
 async updateTS(bodyTS) {


     //search by id in the DB
     let updateThisTS;

     try {
    
        updateThisTS = await this.getTSById(bodyTS.Id_timeSheet); //object Absence
      
     } catch (error) {
       console.log("Error -Could not find that TS with id ", bodyTS.Id_timeSheet);
       return error.message;
     }
     if (!updateThisTS) return false;
 
     //fill the object absence with the new info

     updateThisTS.fillInfoTS(bodyTS);
 
     //variables to use
     const demandedInfos =
     "beginningDate=?,finishDate=?," +
     "totalHours=?,priceHour=?,Id_activity=?," +
     "Id_employee=?";   

     //update
     let updateInfo;
     try {
       updateInfo = await poolConnectDB.query(
        "UPDATE timesheet SET " + demandedInfos +  " WHERE Id_timeSheet=?",
         [
            updateThisTS.beginningDate,
            updateThisTS.finishDate,
            updateThisTS.totalHours,
            updateThisTS.priceHour,
            updateThisTS.Id_activity,
            updateThisTS.Id_employee, 
            updateThisTS.Id_timeSheet
         ]
       );
     } catch (error) {
       console.log("Error Update TS ", error.message);
       return error.message;
     }
     return updateThisTS;
   }
//_____________________________________________
//DELETE 

async deleteTS(id) {
  
    let queryResult;

    //search by id in the DB
    const deleteThisTS = this.getTSById(id);
  
    if (!deleteThisTS) return false;

    let tSId = id;
    queryResult = await poolConnectDB.query(
      "DELETE FROM timesheet WHERE Id_timeSheet=?",
      tSId,
      function (error, results, fields) {
        if (error) throw error;
      }
      
    );


    return deleteThisTS;
  
}



}//closes class


//export to become accessible by other modules
module.exports = new AbsenceDAO();
