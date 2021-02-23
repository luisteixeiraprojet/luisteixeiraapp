class TimeSheet{
    Id_timeSheet;
    beginningDate;
    finishDate;
    totalHours;
    priceHour;
    Id_activity;
    Id_employee;

    constructor(){}

    fillInfoTS(info){
        Object.keys(info).forEach(key => {
            if(info[key] != this[key]){
              this[key] = info[key];
            }
      });
    }

}//closes class



 //export so other modules can access it
 module.exports = TimeSheet;

