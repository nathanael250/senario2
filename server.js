const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const PORT = 5080;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.post('/ussd', (req, res) => {
    let { sessionId, serviceCode, phoneNumber, text } = req.body;

    let response = '';
    const textArray = text.split('*');
    const level = textArray.length;
    if (text === '') {
        response = `CON Welcome to BMI Checker / Murakaza neza kuri BMI Checker\n1. English\n2. Kinyarwanda`;
    }
    else if (textArray[0] === '1') {
        switch (level) {
            case 1:
                response = `CON Please enter your weight in KG:`;
                break;

            case 2:
                response = `CON Please enter your height in CM:`;
                break;

            case 3:
                const weightEng = parseFloat(textArray[1]);
                const heightCmEng = parseFloat(textArray[2]);
                const heightMEng = heightCmEng / 100;
                const bmiEng = weightEng / (heightMEng * heightMEng);
                let categoryEng = '';
                if (bmiEng < 18.5) categoryEng = 'Underweight';
                else if (bmiEng < 25) categoryEng = 'Normal';
                else if (bmiEng < 30) categoryEng = 'Overweight';
                else categoryEng = 'Obese';

                response = `CON Your BMI is ${bmiEng.toFixed(1)} (${categoryEng})\nDo you want health tips?\n1. Yes\n2. No`;
                break;

            case 4:
                const tipChoiceEng = textArray[3];
                const prevBmiEng = parseFloat(textArray[1]) / ((parseFloat(textArray[2]) / 100) ** 2);
                let tipEng = '';

                if (prevBmiEng < 18.5) {
                    tipEng = "Eat more proteins and healthy carbs.";
                } else if (prevBmiEng < 25) {
                    tipEng = "Great job! Maintain your routine.";
                } else if (prevBmiEng < 30) {
                    tipEng = "Exercise regularly and limit sugar.";
                } else {
                    tipEng = "See a doctor and follow a weight-loss plan.";
                }

                response = tipChoiceEng === '1'
                    ? `END Tip: ${tipEng}`
                    : `END Thanks for using BMI Checker. Stay healthy!`;
                break;

            default:
                response = `END Invalid input. Try again.`;
        }
    }

    else if (textArray[0] === '2') {
        switch (level) {
            case 1:
                response = `CON Andika ibiro byawe mu kirogaramu (KG):`;
                break;

            case 2:
                response = `CON Andika uburebure bwawe mu santimetero (CM):`;
                break;

            case 3:
                const weightKin = parseFloat(textArray[1]);
                const heightCmKin = parseFloat(textArray[2]);
                const heightMKin = heightCmKin / 100;
                const bmiKin = weightKin / (heightMKin * heightMKin);
                let categoryKin = '';
                if (bmiKin < 18.5) categoryKin = 'Ufite ibiro bikeya';
                else if (bmiKin < 25) categoryKin = 'Uri muzima';
                else if (bmiKin < 30) categoryKin = 'Ufite ibiro byinshi';
                else categoryKin = 'Ufite ibiro byinshi cyane';

                response = `CON BMI yawe ni ${bmiKin.toFixed(1)} (${categoryKin})\nUkeneye inama z’ubuzima?\n1. Yego\n2. Oya`;
                break;

            case 4:
                const tipChoiceKin = textArray[3];
                const prevBmiKin = parseFloat(textArray[1]) / ((parseFloat(textArray[2]) / 100) ** 2);
                let tipKin = '';

                if (prevBmiKin < 18.5) {
                    tipKin = "Fungura neza, wongere ibirimo intungamubiri.";
                } else if (prevBmiKin < 25) {
                    tipKin = "Komeza uko ubayeho. Ni byiza!";
                } else if (prevBmiKin < 30) {
                    tipKin = "Gabanya isukari kandi ujye ukora imyitozo.";
                } else {
                    tipKin = "Sura muganga kandi ugabanye ibiro ukoresheje regime.";
                }

                response = tipChoiceKin === '1'
                    ? `END Inama: ${tipKin}`
                    : `END Urakoze gukoresha BMI Checker. Gira ubuzima bwiza!`;
                break;

            default:
                response = `END Ibyinjijwe si byo. Ongera ugerageze.`;
        }
    }

    // Invalid Start
    else {
        response = `END Invalid input. Please try again.`;
    }

    res.set('Content-Type: text/plain');
    res.send(response);
});

app.listen(PORT, () => {
    console.log(`BMI USSD app running on port ${PORT}`);
});
