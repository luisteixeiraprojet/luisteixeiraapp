class Absence {
    Id_absence;
    justification;
    typeOfAbsence;
    requestDate;
    startDate;
    endDate;
    status; 
    statusDate;
    Id_employee;

    constructor(){ }

    fillAbsenceInfo(info){
     
        Object.keys(info).forEach(key => {
            if(info[key] != this[key]){
              this[key] = info[key];
            }
      });
     
    }

}//closes class








 //export so other modules can access it
module.exports = Absence;