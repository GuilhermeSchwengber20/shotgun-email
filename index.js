
const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
const express = require("express");
const cors = require("cors");
const allowedOrigins = ["http://127.0.0.1:5500", "https://carlosbasseto.github.io/teste"];



const app = express();
dotenv.config();

app.use(cors({
    origin: function (origin, callback) {
        console.log(origin);
        if(!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error("Acesso nao permitido por CORS!"))
        }
    },
    methods: "GET, HEAD, PUT, PATCH, POST, DELETE"
}));

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "https://carlosbasseto.github.io/teste/");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
    res.header("Access-Control-Allow-Credentials", true);
    next();
})

app.use(express.json());


const transport = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: process.env.USER_NAME,
        pass: process.env.USER_PASS
    }
});

app.post("/send-email", async (req, res) => {
    try {
        const { to, subject, html, text } = req.body;

        const info = await transport.sendMail({
            from: "Vendas do Segundo Ano ce <vendas2ce@gmail.com>",
            to,
            subject,
            html,
            text
        });

        console.log("Email enviado com sucesso!");
        res.status(200).json({ message: "Email enviado com sucesso!", info});
    } catch (err) {
        console.error(`Erro: ${err}`)
        res.status(500).json({ error: `Erro ${err.message}`})        
    }
});

const PORT = process.env.PORT || 8081;

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
})


