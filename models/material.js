class Material {
    Id_materiale;
    purchaseDate;
    name;
    quantity;
    unitaryPrice;
    supplier;
    

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
module.exports = Material;