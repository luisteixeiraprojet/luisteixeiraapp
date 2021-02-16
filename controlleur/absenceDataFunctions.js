const Absence = require("../models/absence");
const poolConnectDB = require("../models/connectionDB");

class AbsenceDAO { 

//______________________________________________________________
//Get All Absence

async getAllAbsences() {
 // console.log("++++++ 5. dentro de getAllAbsences em absencesDataFunction")
    try {
      const queryResult = await poolConnectDB.query("SELECT * from absence");
       // console.log("+++++ 5.1. dentro de getAll query request é:", queryResult[0]);

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
     // console.log("+++++5.2. retorna allAbsences ", allAbsences);  
      return allAbsences;
      
    } catch (error) {
      return "getAllAbsences " + error.message;
    }
  }

//_________________________________________________________
//get absence by Id

async getAbsenceById(id) {
    console.log("dentro de getById")
    //search it in DB
    const rowsDb = await poolConnectDB.query(
      "SELECT * from absence WHERE Id_absence= ?",
      [id]
    ); //all rows
        console.log("resultado query byId ", rowsDb[0]);
    if (rowsDb[0].length < 1) {
      throw new Error("There is no absence with that id ");
    }
    let absence = new Absence();
    absence.fillAbsenceInfo(rowsDb[0][0]);

    return absence;
  }


//_____________________________________________________________
//Create Absence 
    async createAbsence(absenceObject){
      console.log("/////2. dentro de crreateAbsence -absenceDataFunction ");
      console.log("2.1. o que tem no body da chamada da funçao é ", absenceObject);
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
    
    console.log("//// 2.2. verificar qe esta bom newAbsence.typeOfAbsence = absenceObject.typeOfAbsence ",  newAbsence.typeOfAbsence )
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

console.log("//////3.linha 44 ID absenceDataFunction ", queryResult[0].insertId);
newAbsence.Id_absence=queryResult[0].insertId;

console.log("o id da nova absence é ", newAbsence.Id-absence);
return newAbsence;
 } //closes create


 //_________________________________
 //UPDATE ABSENCE 
 
 async updateAbsence(id, bodyAbsence) {
    //falta fazer a verificaçao d econteudo de campos
    console.log("2.Dentro de updateAbsence - absenceDataFunction");
     //search by id in the DB
     let updateThisAbsence;
     console.log("absence id é ", id);
     try {
        console.log("2.1.UPdate id e body",id,JSON.stringify(bodyAbsence));
        updateThisAbsence = await this.getAbsenceById(id); //object Absence
        console.log("2.2. a updateThisAbsence é ", updateThisAbsence);
     } catch (error) {
       console.log("2.3. Erro depois do getById - Could not find that absence with id:" + id);
       return error.message;
     }
     if (!updateThisAbsence) return false;
 
     //fill the object absence with the new info
     console.log("Antes de fill");
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
