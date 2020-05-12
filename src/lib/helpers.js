// haseando la conyraseña para que no se guerde como textoplano por eso vamos a crear un constante llamda helpre que sera un objeto que contendra multiples metodos 
const bcrypt = require('bcryptjs');
const helpers = {};

// este helper es para cuando nos registremos la contraseña valla encriptada
helpers.encryptPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    const hashFinal= await bcrypt.hash(password, salt);
    return hashFinal;
};

helpers.matchPassword = async (password, savedPassword) => {
    try {
     return await bcrypt.compare(password, savedPassword);
    } catch (e) {
        console.log(e);
    }

};

module.exports = helpers;