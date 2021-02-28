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
    console.log("----------- update c id ", id);
    //search it in DB
    const rowsDb = await poolConnectDB.query(
      "SELECT * from material WHERE Id_material= ?",
      [id]
    ); //all rows
    if (rowsDb[0].length < 1) {
      throw new Error("There is no material with that id ");
    }
    let material = new Material();
    material.fillMaterialInfo(rowsDb[0][0]);

    return material;
  }

  //_____________________________________________________________
  //Create Absence

  async createMaterial(matObject) {
    const newMaterial = new Material();
    let queryResult;

    //complete new material with infos from the sent material format object
    newMaterial.fillMaterialInfo(matObject);

    //Id_absence;
    //materialUsedInActivity
    newMaterial.activities = matObject.activities;

    //_____query 1 - complete material table
    const demandedInfos =
      "purchaseDate, name," + "quantity,unitaryPrice, supplier";

    const newMatInfos = [
      newMaterial.purchaseDate,
      newMaterial.name,
      newMaterial.quantity,
      newMaterial.unitaryPrice,
      newMaterial.supplier,
    ];

    try {
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
    const materialAndActivitiesId = "Id_material, Id_activity";

    const newMatInfosMatAct = [newMaterial.Id_material, newMaterial.activities];

    try {
      queryResult = await poolConnectDB.query(
        "INSERT INTO materialusedinactivity ( " +
        materialAndActivitiesId +
        ") VALUES (?,?)",
        newMatInfosMatAct
      );
    } catch (error) {
      console.log(error.message);
      return error.message;
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
      updateThisMaterial = await this.getMatById(bodyMaterial.Id_material); //object Absence
      console.log(
        "------------o updateThisMaterial antes de fill tem ",
        updateThisMaterial
      );
    } catch (error) {
      console.log("Error updateMaterial ", error.message);
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
      console.log("Error Update Material ", error.message);
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
