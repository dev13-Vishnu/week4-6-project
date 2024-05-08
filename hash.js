const bcrypt=require('bcrypt')
const saltRounds=10; //  Number of salt rounds
const plainTextpassword='user'
  bcrypt.hash(plainTextpassword, saltRounds,(err, hash)=>{
    if(err)
    {
        console.error('Error hashing password:',err)
    }else{
        console.log('Hashed password:',hash);
    }
 });