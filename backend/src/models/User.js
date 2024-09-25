// const maria = require("../config/database");
// const sequelize = require('sequelize')
// const User = {
//   findByEmail: async (email) => {
//     try {
//       console.log('Attempting to find user with email:', email);
//       const {rows, fields} = await maria.query('SELECT * FROM user WHERE email = '+'\'' + email+'\'');
//       console.log('Query result:', rows[0]);
//       if (rows.length === 0) {
//         console.log('No user found with this email');
//         return null;
//       }
//       return rows[0];
//     } catch (error) {
//       console.error('Database query error:', error);
//       throw error;
//     }
//   }
// }
    
  
//   module.exports = User;


//   //메인에서 모듈 함수로 구분하는 방식 사용 