class Activity {
    Id_activity;
    name;
    startDate;
    endDate;
    materials;

    constructor(){ }

    fillActivityInfo(info){
        Object.keys(info).forEach(key => {
            if(info[key] != this[key]){
              this[key] = info[key];
            }
      });
    }

}//closes class

 //export so other modules can access it
module.exports = Activity;