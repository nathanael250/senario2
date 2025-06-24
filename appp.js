const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
const port = 5000;

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'bmi'
});

connection.connect(err => {
    if (err) return console.error('DB Error:', err);
    console.log('✅ Connected to MySQL');
});

app.post('/ussd', (req, res) => {
    const { sessionId, serviceCode, phoneNumber, text } = req.body;
    const inputs = text.split('*');
    const level = inputs.length;
    const lang = inputs[0];
    let response = "";

    if (text === "") {
        response = `CON Welcome! Please choose your language:\n1. English\n2. Kinyarwanda`;
        // Start new session in DB
        connection.execute(
            `INSERT IGNORE INTO session (sessionid, phonenumber, servicecode, status, created_at) 
       VALUES (?, ?, ?, ?, NOW())`,
            [sessionId, phoneNumber, serviceCode, 'in_progress']
        );
    }
    else if (level === 1) {
        response = (lang === '1')
            ? `CON Enter your age:\n0. Back`
            : `CON Andika imyaka yawe:\n0. Back`;
    }
    else if (level === 2) {
        if (inputs[1] === '0') {
            response = `CON Welcome! Please choose your language:\n1. English\n2. Kinyarwanda`;
        } else {
            response = (lang === '1')
                ? `CON Enter your weight (in KG):\n0. Back`
                : `CON Andika ibiro byawe (mu biro):\n0. Back`;
        }
    }
    else if (level === 3) {
        if (inputs[2] === '0') {
            response = (lang === '1')
                ? `CON Enter your age:\n0. Back`
                : `CON Andika imyaka yawe:\n0. Back`;
        } else {
            response = (lang === '1')
                ? `CON Enter your height (in CM):\n0. Back`
                : `CON Andika uburebure bwawe (mu cm):\n0. Back`;
        }
    }
    else if (level === 4) {
        if (inputs[3] === '0') {
            response = (lang === '1')
                ? `CON Enter your weight (in KG):\n0. Back`
                : `CON Andika ibiro byawe (mu biro):\n0. Back`;
        } else {
            const age = parseFloat(inputs[1]);
            const weight = parseFloat(inputs[2]);
            const height = parseFloat(inputs[3]);

            if (isNaN(age) || isNaN(weight) || isNaN(height)) {
                response = "END Invalid age, weight or height. Please try again.";
                res.set('Content-Type', 'text/plain');
                return res.send(response);
            }

            const heightInM = height / 100;
            const bmi = weight / (heightInM * heightInM);
            const roundedBMI = parseFloat(bmi.toFixed(1));

            let category = '';
            if (bmi < 18.5) category = (lang === '1') ? 'Underweight' : 'Ufite ibiro bike';
            else if (bmi < 25) category = (lang === '1') ? 'Normal' : 'Bisanzwe';
            else if (bmi < 30) category = (lang === '1') ? 'Overweight' : 'Ufite ibiro byinshi';
            else category = (lang === '1') ? 'Obese' : 'Ufite umubyibuho ukabije';

            // Insert BMI record with age
            connection.execute(
                `INSERT INTO bmi_records (sessionid, age, weight, height, bmi_value, bmi_category, created_at) 
         VALUES (?, ?, ?, ?, ?, ?, NOW())`,
                [sessionId, age, weight, height, roundedBMI, category],
                (err) => {
                    if (err) {
                        console.error('Insert BMI error:', err);
                        response = "END Server error. Please try again later.";
                    } else {
                        response = (lang === '1')
                            ? `CON Your BMI is ${roundedBMI} (${category})\nDo you want health tips?\n1. Yes\n2. No\n0. Back`
                            : `CON BMI yawe ni ${roundedBMI} (${category})\nUkeneye inama z'ubuzima?\n1. Yego\n2. Oya\n0. Back`;
                    }
                    res.set('Content-Type', 'text/plain');
                    return res.send(response);
                }
            );
            return; // Stop here and respond from inside callback
        }
    }
    else if (level === 5) {
        if (inputs[4] === '0') {
            const age = parseFloat(inputs[1]);
            const weight = parseFloat(inputs[2]);
            const height = parseFloat(inputs[3]);
            const heightInM = height / 100;
            const bmi = weight / (heightInM * heightInM);
            const roundedBMI = parseFloat(bmi.toFixed(1));

            let category = '';
            if (bmi < 18.5) category = (lang === '1') ? 'Underweight' : 'Ufite ibiro bike';
            else if (bmi < 25) category = (lang === '1') ? 'Normal' : 'Bisanzwe';
            else if (bmi < 30) category = (lang === '1') ? 'Overweight' : 'Ufite ibiro byinshi';
            else category = (lang === '1') ? 'Obese' : 'Ufite umubyibuho ukabije';

            response = (lang === '1')
                ? `CON Your BMI is ${roundedBMI} (${category})\nDo you want health tips?\n1. Yes\n2. No\n0. Back`
                : `CON BMI yawe ni ${roundedBMI} (${category})\nUkeneye inama z'ubuzima?\n1. Yego\n2. Oya\n0. Back`;
        } else {
            const wantTip = inputs[4];

            // Update session status to completed
            connection.execute(
                `UPDATE session SET status = 'completed' WHERE sessionid = ?`,
                [sessionId]
            );

            if (lang === '1') {
                response = (wantTip === '1')
                    ? `END Great! Tip: Eat balanced meals and exercise 30 mins daily.`
                    : `END Thank you! Stay healthy.`;
            } else {
                response = (wantTip === '1')
                    ? `END Inama: Fata indyo yuzuye kandi ukore siporo nibura iminota 30 buri munsi.`
                    : `END Urakoze! Gira ubuzima bwiza.`;
            }
        }
    }
    else {
        response = "END Invalid flow.";
    }

    res.set('Content-Type', 'text/plain');
    res.send(response);
});

app.listen(port, () => {
    console.log(`✅ USSD BMI app running on http://localhost:${port}`);
});
