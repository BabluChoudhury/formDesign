import express from "express";
import "./db/conn.js";
import path from "path";
import { fileURLToPath } from 'url';
import hbs from "hbs";
import { Register } from "./models/register.js"
import bcrypt from "bcryptjs";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const port = process.env.PORT || 3000;
const app = express();
const staticPath = path.join(__dirname, "../public");
const viewsPath = path.join(__dirname, "../templates/views");
const partialPath = path.join(__dirname, "../templates/partial");
app.use(express.static(staticPath));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.set("views", viewsPath);
app.set("view engine", "hbs");
hbs.registerPartials(partialPath);
app.get("/login", (req, res) => {
    res.render("login");
});
app.get("/signup", (req, res) => {
    res.render("signup");
});
app.post("/register", async (req, res) => {
    try {
        const psw = await bcrypt.hash(req.body.password,10);
        const result = Register({
            Name: req.body.fullName,
            Email: req.body.email,
            Password:psw
        });
        const insertData = await result.save();
        console.log(insertData);
        res.status(201).render("login");
    } catch (e) {
        console.log(e);
        res.status(404).render("login");
    }
});
app.post("/login", async (req, res) => {
    try {
        const Email= req.body.email;
        const Password= req.body.password;
        const result = Register.findOne({Email});
        // const getData = await result.save();
        console.log(Password)
        console.log(result)
        const pswd = await bcrypt.compare(Password,result.Password);
        console.log(pswd);
        if(pswd){
            res.status(201).render("index",{
                myData:getData.Name,
                myData2:getData.Name
            });
        }
        else{
            res.status(404).render("login");
        }
    } catch (e) {
        console.log(e);
        res.status(404).render("login");
    }
});
app.listen(port, () => {
    console.log(`Server run at http://localhost:${port}`);
});