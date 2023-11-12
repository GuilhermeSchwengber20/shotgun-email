
const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
const express = require("express");

const app = express();
dotenv.config();

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


