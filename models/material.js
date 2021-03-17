class Material {
    Id_material;
    purchaseDate;
    name;
    quantity;
    unitaryPrice;
    supplier;
    materialUsedInActivity
    activities;

    constructor(){ }

    fillMaterialInfo(info){
        Object.keys(info).forEach(key => {
            if(info[key] != this[key]){
              this[key] = info[key];
            }
      });
    }

}//closes class

 //export so other modules can access it
module.exports = Material;