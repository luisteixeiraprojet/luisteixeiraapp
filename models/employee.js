//Model employee - an employee has this fields
class Employee{
    Id_employee;
    firstName;
    lastName;
    mobilePhone;
    homePhone; //facultativo 
    email; //facultativo 
    address; //model
    adressComplement;
    zipCode;
    nationality;
    identityNumber; 
    socialNumber;
    birthdayDate;
    iban;
    typeContract; //model CDI/CDD, numero de horas
    joinDate;
    hourlyPrice;
    userName;
    password; 
    sessionId;

    constructor(){ }
    
    fillEmployeeInfo(info){
        Object.keys(info).forEach(key => {
            if(info[key] != this[key]){
              this[key] = info[key];
            }
      });
    }

    safeUserForList(){
    const cleanedUser = new Employee();
    cleanedUser.Id_employee = this.Id_employee;
    cleanedUser.firstName = this.firstName;
    cleanedUser.lastName = this.lastName;
    cleanedUser.mobilePhone = this.mobilePhone;
    return cleanedUser;
    } 

    safeUserDetailed(){
      const cleanedUserDetails = new Employee();
      cleanedUserDetails.Id_employee = this.Id_employee;
      cleanedUserDetails.firstName = this.firstName;
      cleanedUserDetails.lastName = this.lastName;
      cleanedUserDetails.mobilePhone = this.mobilePhone;
      cleanedUserDetails.homePhone= this.homePhone; 
      cleanedUserDetails.email= this.email; 
      cleanedUserDetails.address= this.address; 
      cleanedUserDetails.adressComplement= this.adressComplement;
      cleanedUserDetails.zipCode= this.zipCode;
      cleanedUserDetails.nationality= this.nationality;
      cleanedUserDetails.identityNumber= this.identityNumber;
      cleanedUserDetails.socialNumber= this.socialNumber;
      cleanedUserDetails.birthdayDate= this.birthdayDate;
      cleanedUserDetails.iban= this.iban;
      cleanedUserDetails.typeContract= this.typeContract; 
      cleanedUserDetails.joinDate= this.joinDate;
      cleanedUserDetails.hourlyPrice= this.hourlyPrice;
      cleanedUserDetails.userName=this.userName;
      cleanedUserDetails.sessionId=this.sessionId;
      return cleanedUserDetails;
    }

}
//export so other modules can access it
module.exports = Employee;