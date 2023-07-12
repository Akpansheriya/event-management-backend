const express = require("express")
const app = express();
const port = process.env.PORT || 2500
const cors = require("cors")
const dotenv = require("dotenv")
const connect = require("./config/conn")
const path = require("path");
const userApi = require("./routes/userRoute")


app.use('/excel', express.static('./excel'));
app.use('/profile', express.static('./public'));
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cors())
app.use("/api", userApi);

app.get("/" , (req,res) => {
    res.send("hello world")
});

dotenv.config({path: "./config/config.env"})
connect();

app.listen(port, () => {
    console.log(`server is running on ${port}`);
})