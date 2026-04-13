import jwt from "jsonwebtoken";

const SECRET = "exportations-secret";

export function login(req,res){

    const {username,password} = req.body;

    if(username==="admin" && password==="admin"){

        const token = jwt.sign(
            {user:username},
            SECRET,
            {expiresIn:"1h"}
        );

        res.json({token});

    }else{
        res.status(401).send("Invalid credentials");
    }

}

export function verifyToken(req,res,next){

    const authHeader = req.headers["authorization"];

    if(!authHeader){
        return res.status(403).send("Token required");
    }

    const token = authHeader.split(" ")[1];

    jwt.verify(token,SECRET,(err,user)=>{
        if(err){
            return res.status(403).send("Invalid token");
        }

        req.user = user;
        next();
    });

}