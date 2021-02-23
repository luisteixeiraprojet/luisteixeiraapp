const Activity = require("../models/activity");
const poolConnectDB = require("../models/connectionDB");

class ActivityDAO { 

//______________________________________________________________
//Get All Absence

async getAllActivities() {
    try {
      const queryResult = await poolConnectDB.query(
        "SELECT * FROM activity ORDER BY name DESC");


      let allActivities = [];

      const rowsDB = queryResult[0];
      if (rowsDB.length < 1) {
        throw new Error("No activities were found");
      }

      rowsDB.forEach((row) => {
        let activity = new Activity();
        activity.fillActivityInfo(row);
        allActivities.push(activity);
      });     
    
      return allActivities;
      
    } catch (error) {
      return "getAllActivities " + error.message;
    }
  }

//_________________________________________________________
//get activity by Id

async getActivityById(id) {

    //search it in DB
    const rowsDb = await poolConnectDB.query(
      "SELECT * FROM activity WHERE Id_activity= ?",
      [id]
    ); //all rows
    if (rowsDb[0].length < 1) {
      throw new Error("There is no activity with that id ");
    }
    let activity = new Activity();
    activity.fillActivityInfo(rowsDb[0][0]);

    return activity;
  }

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
//Create Activity

    async createActivity(activityObject){
        const newActivity = new Activity();
        let queryResult; 

    //Id_activity;
    newActivity.name = activityObject.name;
    newActivity.startDate = activityObject.startDate;
    newActivity.endDate = activityObject.endDate;
    
     //query 
     const demandedInfos =
     "name, startDate, endDate"    
     
     const newActivityInfos = [
        newActivity.name,
        newActivity.startDate,
        newActivity.endDate
     ];
     
try {
        queryResult = await poolConnectDB.query(
        "INSERT INTO activity ( " +
          demandedInfos +
          ") VALUES (?,?,?)",
          newActivityInfos
      );
    } catch (error) {
    console.log(error.message);
    return error.message
    }
newActivity.Id_activity=queryResult[0].insertId;

return newActivity;
 } //closes create

 
 //_________________________________
 //UPDATE Activity 
 
 async updateActivity(bodyActivity) {
  
     //search by id in the DB
     let updateThisActivity;

     try {
      
        updateThisActivity = await this.getActivityById(bodyActivity.Id_activity); //object Absence

     } catch (error) {
       console.log("Could not find an activity with that id ", bodyActivity.Id_activity);
       return error.message;
     }
     if (!updateThisActivity) return false;
 
     //fill the object activity with the new info

     updateThisActivity.fillActivityInfo(bodyActivity);
 
     //variables to use
     const demandedInfos =
     "name=?, startDate=?, endDate=? ";   

     //update
     let updateInfo;
     try {
      // update activity SET name, startDate, endDate WHERE Id_activity
       updateInfo = await poolConnectDB.query(
        "UPDATE activity SET " + demandedInfos +  "WHERE Id_activity= ?",
         [  
            updateThisActivity.name,
            updateThisActivity.startDate,
            updateThisActivity.endDate,
            updateThisActivity.Id_activity
         ]
       );
     } catch (error) {
       return error.message;
     }
     console.log("///1.updateThisActivity ", updateThisActivity);
     return updateThisActivity;
   }
   
//_____________________________________________
//DELETE 

async deleteActivity(id) {

    let queryResult;

    //search by id in the DB
    const deleteThisActivity = this.getActivityById(id);
   
    if (!deleteThisActivity) return false;

    let activityId = id;
  
    queryResult = await poolConnectDB.query(
      "DELETE FROM activity WHERE Id_activity= ?",
      activityId,
      function (error, results, fields) {
        if (error) throw error;
      }
      
    );
    return deleteThisActivity;
}

}//closes class


//export to become accessible by other modules
module.exports = new ActivityDAO();
