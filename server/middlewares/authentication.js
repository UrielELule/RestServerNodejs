//validar token
const jwt = require('jsonwebtoken');

/////////////////////////////////
//Verificar token
/////////////////////////////////

let verificaToken = (req, resp, next) => {
    let token =  req.get('token'); //depende de como lo usamos en el header de postman

    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if (err) {
            return resp.status(401).json({
                ok: false,
                err: {
                    message: 'Token no valido'
                }
            });
        }
        req.usuario = decoded.usuario;
        next();
    });
};

/////////////////////////////////
//Verificar ROLE
/////////////////////////////////

let verificarAdmin_ROLE = (req, res, next) => {

    let usuario = req.usuario;

    if(usuario.role === 'ADMIN_ROLE'){
        next();
        return;
    } else {
       return res.json({
            ok: true,
            err: {
                message: 'El usuario no es administrador'
            }
        });
    }
    
}


/////////////////////////////////
//Verifica token para imagenes
/////////////////////////////////

let verificaTokenImg = (req, res, next) =>{

    let token = req.query.token;  //token es por postman en la url alfinal 'token='algo'

   jwt.verify(token, process.env.SEED, (err, decoded) =>{

    if(err){
        return res.status(401).json({
            ok: false,
            err: {
                message: 'Token Invalido'
            }
        });
    
    }

    req.usuario = decoded.usuario;
    next();

   });


}


module.exports = {
    verificaToken,
    verificarAdmin_ROLE,
    verificaTokenImg
}