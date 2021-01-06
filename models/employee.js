//Model employee - an employee has this fields
class Employee{
    id;
    joinDate;
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
    age;
    iban;
    typeContract; //model CDI/CDD, numero de horas

    constructor(){ }
    


}

//export so other modules can access it
module.exports = Employee;