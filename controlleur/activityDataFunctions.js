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

//________________________________________
async getPrevSelectedMat(idActivity){
//info actpreviouslyselected

console.log("mmmmmm 1. dentro de getPrevSelectedMat");

let previouslySelectMat = [];
try {
 const rowsDb = await poolConnectDB.query(
   "SELECT * FROM materialusedinactivity WHERE Id_activity= ?",
   [idActivity]
 ); 

 console.log("mmmmmm 1.1 rowsDb ", rowsDb[0]);

 if (rowsDb[0].length < 1) {
   throw new Error("There is no material with that id ");
 }
 previouslySelectMat = rowsDb[0];
 console.log("mmmmmm 1.2. rowsDb ",previouslySelectMat);


} catch (error) {
 console.log("Error getMaterialById ", error.message);
}
console.log("vai retornar previouslySelectAct", previouslySelectMat);
return previouslySelectMat;

}
//_________________________________________________________
//get activity by Id

async getActivityById(id) {
 // console.log("uuuu 4. getByID - 39-  c id  ", id);
    //search it in DB
    try {
      const rowsDb = await poolConnectDB.query(
        "SELECT * FROM activity WHERE Id_activity= ?",
        [id]
      ); //all rows
     // console.log("uuuu 4.1. getById-45- resultado query rowsDb[0] ", rowsDb[0]);
      if (rowsDb[0].length < 1) {
        throw new Error("There is no activity with that id ");
      }
      let activity = new Activity();
      activity.fillActivityInfo(rowsDb[0][0]);
     // console.log("uuuu 4.2. getById-51-act depois de fill q é retornada ", activity);
  
      return activity;
      
    } catch (error) {
      console.log("Error getActById ", error.message)
      return error
    }
  }

//_____________________________________________________________
//Create Activity

    async createActivity(activityObject){

    //  console.log("ccccc 0. dentro de create-93- c activityObject ", activityObject );
    //  console.log("ccccc 0.1 o id de materials: ", activityObject.materials );
      const newActivity = new Activity();
      let queryResult; 

    //Id_activity;
    newActivity.name = activityObject.name;
  //  console.log("0.2.newActivity.name ", newActivity.name);
    newActivity.startDate = activityObject.startDate;
 //   console.log("0.3. newActivity.startDate ",  newActivity.startDate);
    newActivity.endDate = activityObject.endDate;
  //  console.log("0.4. newActivity.endDate",  newActivity.endDate);

    
 //query 1    
try {
  const demandedInfos =
  "name, startDate, endDate"    
  
  const newActivityInfos = [
     newActivity.name,
     newActivity.startDate,
     newActivity.endDate
  ];
        queryResult = await poolConnectDB.query(
        "INSERT INTO activity ( " +
          demandedInfos +
          ") VALUES ( ?,?,?)",
          newActivityInfos
      );
    } catch (error) {
    console.log(error.message);
    return error.message
    }
  newActivity.Id_activity=queryResult[0].insertId;
  console.log("ccccc 0.1 o id da atividade criada: ", newActivity.Id_activity);

    //_____query 2 - complete materialUsedInActivity table
    let idActivity =  newActivity.Id_activity;
    let idMaterials = activityObject.materials;
    console.log("ccccc 0. dentro de create-93- idMaterial do novo material ", idActivity );
    console.log("ccccc 1. id de materials dessa atividade ",idMaterials );

    try {
      //query insert inside the for because we never know how many activities will be selected so it'll correpsond to the length of idActivities 
      for (let index = 0; index < idMaterials.length; index++) {
      console.log("cccc 2. idMaterials.length: ", idMaterials.length);
        const element = idMaterials[index];
      console.log("cccc 2.1 element no for: ", element );
        const newIds = [idActivity, element];
      console.log("cccc 2.2. newIds no for: ", newIds );
        //query to insert
        try {
          await poolConnectDB.query(
            "INSERT INTO materialusedinactivity ( Id_activity, Id_material) VALUES (?,?)",
            newIds
          );
        } catch (error) {
          console.log("Error Update insert new infos matAndAct", error.message);
          return error.message;
        }
      }
    } catch (error) {
      console.log("Error Update Material ", error.message);
    }
return newActivity;
 } //closes create

 //_________________________________
 //UPDATE Activity 
 
 async updateActivity(bodyActivity) {
  
     //search by id in the DB
     let updateThisActivity;
     let verifIfNewIdMat;
   
     try {
   
      updateThisActivity = await this.getActivityById(bodyActivity.Id_activity); //object Activity
     
      } catch (error) {
       console.log("Could not find an activity with that id ", bodyActivity.Id_activity, " ", error.message);
       
       return error.message;
     }
     if (!updateThisActivity) return false;
 
     //fill the object activity with the new info

     updateThisActivity.fillActivityInfo(bodyActivity);
 
     //variables to use
     const demandedInfos =
     "name=?, startDate=?, endDate=? ";   

     //update
     
     try {
      // update activity SET name, startDate, endDate WHERE Id_activity
       await poolConnectDB.query(
        "UPDATE activity SET " + demandedInfos +  " WHERE Id_activity=?",
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
    // console.log("uuuuu 5.updateThisActivityDAO -140 ", updateThisActivity);
    
//_____query 2 - materialUsedInActivity table

    let idActivity = updateThisActivity.Id_activity;
   // console.log("uuuuu 5.1. updateThisActivityDAO -145 ",idActivity);
   //console.log("uuuuu 5.2. material id é ?? ", updateThisActivity.materials);
    verifIfNewIdMat = updateThisActivity.materials;
  console.log("uuuuu 5.0. Id_material desta activity é ",verifIfNewIdMat);

    try {
    //  console.log("uuuuu 5.. dentro do 1o try ");

      //to be simple: delete all in materialusedinactivity table - there will never be a big amount of data so its more practical like this otherwise i would have compare line by line
      try {
     //   console.log("uuuuu 5.5. dentro do 2o try ");
        console.log("uuuuu 5.0. vai fazer query delete c idActivity ", idActivity);
        await poolConnectDB.query(
          "DELETE FROM materialusedinactivity WHERE Id_activity= ?",
          [idActivity]
        );
      } catch (error) {
        console.log("Error Update table Act ", error.message);
      }

 
      //query insert inside the for because we never know how many activities will be selected so it'll correpsond to the length of idActivities 
      for (let index = 0; index < verifIfNewIdMat.length; index++) {
        const element = verifIfNewIdMat[index];
       // console.log("uuuuu 5.1. for element ", element);
        
        const newIds = [idActivity, element];
       // console.log("uuuuu 5.2. for newIds ", newIds);
        //query to insert
        try {
          //console.log("uuuuu 5.3. vai fazer insert com newId", newIds);
          await poolConnectDB.query(
            "INSERT INTO materialusedinactivity ( Id_activity, Id_material ) VALUES (?,?)",
            newIds
          );
        } catch (error) {
          console.log("Error Update insert new infos matAndAct", error.message);
          return error.message;
        }
      }
    } catch (error) {
      console.log("Error Update Material ", error.message);
    }
    
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
