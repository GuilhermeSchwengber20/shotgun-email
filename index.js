
const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
const express = require("express");
const cors = require("cors");
const allowedOrigins = ["http://127.0.0.1:5500", "https://carlosbasseto.github.io", "http://localhost:3000"];



const app = express();
dotenv.config();

app.use(cors());

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
        const { from, to, subject, html, text } = req.body;

        if(!from) {
            return res.status(400).json({error: "from is a required field"})
        }
        if(!to) {
            return res.status(400).json({error: "to is a required field"})
        }
        if(!subject) {
            return res.status(400).json({error: "subject is a required field"})
        }
        if(!html) {
            return res.status(400).json({error: "html is a required field"})
        }
        if(!text) {
            return res.status(400).json({error: "text is a required field"})
        }
        const info = await transport.sendMail({
            from,
            to,
            subject,
            html,
            text
        });

        console.log("Email enviado com sucesso!");
        res.status(200).json({ message: "Email enviado com sucesso!", info});
    } catch (err) {
        console.error(`Erro: ${err}`)
        return res.status(500).json({ error: `Erro ${err.message}`})        
    }
});


const PORT = process.env.PORT || 8081;

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
})


