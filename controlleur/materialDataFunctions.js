const Material = require("../models/material");
const poolConnectDB = require("../models/connectionDB");

class MaterialDAO {
  //______________________________________________________________
  //Get All Absence

  async getAllMaterials() {
    try {
      const queryResult = await poolConnectDB.query(
        "SELECT * FROM material ORDER BY name ASC"
      );

      let allMaterials = [];

      const rowsDB = queryResult[0];
      if (rowsDB.length < 1) {
        throw new Error("No absences were found");
      }

      rowsDB.forEach((row) => {
        let material = new Material();
        material.fillMaterialInfo(row);
        allMaterials.push(material);
      });

      return allMaterials;
    } catch (error) {
      return "getAllAbsences " + error.message;
    }
  }

  //_________________________________________________________
  //get absence by Id

  async getMatById(id) {
    let material;
    //search it in DB
    try {
      const rowsDb = await poolConnectDB.query(
        "SELECT * from material WHERE Id_material= ?",
        [id]
      ); //all rows
      if (rowsDb[0].length < 1) {
        throw new Error("There is no material with that id ");
      }
      material = new Material();
      material.fillMaterialInfo(rowsDb[0][0]);
    } catch (error) {
      console.log("Error getMaterialById ", error.message);
    }
    return material;
  }
//______________________________________
  async getPrevSelectedAct(matId){
     //info actpreviouslyselected
     let previouslySelectAct = [];
     try {
      const rowsDb = await poolConnectDB.query(
        "SELECT * FROM materialusedinactivity WHERE Id_material= ?",
        [matId]
      ); 

      if (rowsDb[0].length < 1) {
        throw new Error("There is no material with that id ");
      }
      previouslySelectAct = rowsDb[0];
    } catch (error) {
      console.log("Error getMaterialById ", error.message);
    }
    return previouslySelectAct
  }

  //_____________________________________________________________
  //Create Absence

  async createMaterial(matObject) {

    const newMaterial = new Material();

//complete new material with infos from the sent material format object
    newMaterial.fillMaterialInfo(matObject);

//materialUsedInActivity
    newMaterial.activities = matObject.activities;
  let queryResult;
//_____query 1 - complete material table
    const newMatInfos = [
      newMaterial.purchaseDate,
      newMaterial.name,
      newMaterial.quantity,
      newMaterial.unitaryPrice,
      newMaterial.supplier,
    ]; 

    try {
      const demandedInfos =
      "purchaseDate, name," + "quantity,unitaryPrice, supplier";
       queryResult = await poolConnectDB.query(
        "INSERT INTO material ( " + demandedInfos + ") VALUES (?,?,?,?,?)",
        newMatInfos
      );
    } catch (error) {
      console.log(error.message);
      return error.message;
    }
    newMaterial.Id_material = queryResult[0].insertId;

//_____query 2 - complete materialUsedInActivity table
    let idMAterial =  newMaterial.Id_material;
    let idActivities = matObject.activities;
    

    try {
      //to be simple: delete all in materialusedinactivity table - there will never be a big amount of data so its more practical like this otherwise i would have compare line by line
      //query insert inside the for because we never know how many activities will be selected so it'll correpsond to the length of idActivities 
      for (let index = 0; index < idActivities.length; index++) {
        const element = idActivities[index];
        const newIds = [idMAterial, element];
      
        //query to insert
        try {
          await poolConnectDB.query(
            "INSERT INTO materialusedinactivity ( Id_material, Id_activity) VALUES (?,?)",
            newIds);

        } catch (error) {
          console.log("Error Update insert new infos matAndAct", error.message);
          return error.message;
        }
      }
    } catch (error) {
      console.log("Error Update Material ", error.message);
    }
    return newMaterial;
  } //closes create

  //_________________________________
  //UPDATE Material

  async updateMaterial(bodyMaterial) {
    //search by id in the DB
    let updateThisMaterial;
    let idActFromRowsDb;
    let verifIfNewIdAct;

    try {
      console.log("mmmm 0.bodyMaterial.Id_material ", bodyMaterial.Id_material);
      updateThisMaterial = await this.getMatById(bodyMaterial.Id_material); //object Absence

    } catch (error) {
      console.log("Error updateMaterial 11111 ", error.message);
      return error.message;
    }
    if (!updateThisMaterial) return false;

    //fill the object absence with the new info
    updateThisMaterial.fillMaterialInfo(bodyMaterial);

    //_____query 1 - complete material table
    //variables to use
    const demandedInfos =
      "purchaseDate=?, name=?, quantity=?," + "unitaryPrice=?, supplier=? ";

    //update
    let updateInfo;
    try {
      updateInfo = await poolConnectDB.query(
        "UPDATE material SET " + demandedInfos + "WHERE Id_material= ?",
        [
          updateThisMaterial.purchaseDate,
          updateThisMaterial.name,
          updateThisMaterial.quantity,
          updateThisMaterial.unitaryPrice,
          updateThisMaterial.supplier,
          updateThisMaterial.Id_material,
        ]
      );
    } catch (error) {
      return error.message;
    }

    //_____query 2 - materialUsedInActivity table

    let idMAterial = updateThisMaterial.Id_material;
    verifIfNewIdAct = updateThisMaterial.activities;

    try {
      //to be simple: delete all in materialusedinactivity table - there will never be a big amount of data so its more practical like this otherwise i would have compare line by line
      try {
        await await poolConnectDB.query(
          "DELETE FROM materialusedinactivity WHERE Id_material= ?",
          [idMAterial]
        );
      } catch (error) {
        console.log("Error Update table MAtAndAct ", error.message);
      }

      //query insert inside the for because we never know how many activities will be selected so it'll correpsond to the length of idActivities 
      for (let index = 0; index < verifIfNewIdAct.length; index++) {
        const element = verifIfNewIdAct[index];
        const newIds = [idMAterial, element];
        //query to insert
        try {
          await poolConnectDB.query(
            "INSERT INTO materialusedinactivity ( Id_material, Id_activity) VALUES (?,?)",
            newIds
          );
        } catch (error) {
          console.log("Error Update insert new infos matAndAct", error.message);
          return error.message;
        }
      }
    } catch (error) {
      console.log("Error Update Material 22222222  ", error.message);
    }
    return updateThisMaterial;
  }

  //_____________________________________________
  //DELETE

  async deleteMaterial(id) {
    let queryResult;

    //search by id in the DB
    const deleteThisMaterial = this.getMatById(id);

    if (!deleteThisMaterial) return false;

    let materialId = id;
    queryResult = await poolConnectDB.query(
      "DELETE FROM material WHERE Id_material= ?",
      materialId,
      function (error, results, fields) {
        if (error) throw error;
      }
    );
    return deleteThisMaterial;
  }
} //closes class

//export to become accessible by other modules
module.exports = new MaterialDAO();
