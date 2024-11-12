const {expressjwt} = require('express-jwt');
const JWT_SECRET='4d2c9d17ab134f5eacee0f1c8bb9ff8e17c93d5b7b62280729a5a9f8dc6013a77c12e0bde6b68ab3c07e8f5e1bcd68df2e5747c1e1db4d349b9f1f9ad3b3e8b4';

function auth(){
    const secret=JWT_SECRET;
    return expressjwt({
        secret,
        algorithms:['HS256'],
        isRevoked: isRevoked
    }).unless({
        path:[
            { url: '/Produkty', methods: ['GET'] },
            { url: '/Uzytkownicy/Logowanie', methods: ['POST'] },
            { url: '/Uzytkownicy/Rejestracja', methods: ['POST'] }
        ]
    })
}

async function isRevoked (req,payload,done) {
    if(!payload.admin){
        done(null,true)
    }
    done();
}
module.exports=auth

// function verifyToken(req, res, next) {
// const token = req.header('Authorization');
// if (!token) return res.status(401).json({ error: 'Access denied' });
// try {
//  const decoded = jwt.verify(token, 'your-secret-key');
//  req.userId = decoded.userId;
//  next();
//  } catch (error) {
//  res.status(401).json({ error: 'Invalid token' });
//  }
//  };

// module.exports = verifyToken;