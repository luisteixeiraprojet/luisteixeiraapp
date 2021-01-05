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

module.exports = Employee;