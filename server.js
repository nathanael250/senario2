const express = require('express');
const bodyParser = require('body-parser');
const connectDb = require('./config/database');
const UssdSession = require('./models/ussd_sessions');
const BmiRecord = require('./models/bmi_records');

// Connect to MongoDB
connectDb();

const app = express();
const PORT = 5080;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.post('/ussd', async (req, res) => {
    let { sessionId, serviceCode, phoneNumber, text } = req.body;

    try {
        // Find or create session
        let session = await UssdSession.findOne({ session_id: sessionId });
        if (!session) {
            session = new UssdSession({
                session_id: sessionId,
                phone_number: phoneNumber,
                service_code: serviceCode,
                current_step: 0,
                status: 'active'
            });
        }

        let response = '';
        const textArray = text.split('*');
        const level = textArray.length;

        // Update session step
        session.current_step = level;

        if (text === '') {
            response = `CON Welcome to BMI Checker / Murakaza neza kuri BMI Checker\n1. English\n2. Kinyarwanda`;
        }
        else if (textArray[0] === '1') {
            switch (level) {
                case 1:
                    response = `CON Please enter your age:\n0. Back`;
                    break;

                case 2:
                    if (textArray[1] === '0') {
                        response = `CON Welcome to BMI Checker / Murakaza neza kuri BMI Checker\n1. English\n2. Kinyarwanda`;
                    } else {
                        // Save age
                        session.age = parseFloat(textArray[1]);
                        response = `CON Please enter your weight in KG:\n0. Back`;
                    }
                    break;

                case 3:
                    if (textArray[2] === '0') {
                        response = `CON Please enter your age:\n0. Back`;
                    } else {
                        response = `CON Please enter your height in CM:\n0. Back`;
                    }
                    break;

                case 4:
                    if (textArray[3] === '0') {
                        response = `CON Please enter your weight in KG:\n0. Back`;
                    } else {
                        const ageEng = parseFloat(textArray[1]);
                        const weightEng = parseFloat(textArray[2]);
                        const heightCmEng = parseFloat(textArray[3]);
                        const heightMEng = heightCmEng / 100;
                        const bmiEng = weightEng / (heightMEng * heightMEng);
                        let categoryEng = '';
                        if (bmiEng < 18.5) categoryEng = 'Underweight';
                        else if (bmiEng < 25) categoryEng = 'Normal';
                        else if (bmiEng < 30) categoryEng = 'Overweight';
                        else categoryEng = 'Obese';

                        response = `CON Your BMI is ${bmiEng.toFixed(1)} (${categoryEng})\nDo you want health tips?\n1. Yes\n2. No\n0. Back`;
                    }
                    break;

                case 5:
                    if (textArray[4] === '0') {
                        const ageEng = parseFloat(textArray[1]);
                        const weightEng = parseFloat(textArray[2]);
                        const heightCmEng = parseFloat(textArray[3]);
                        const heightMEng = heightCmEng / 100;
                        const bmiEng = weightEng / (heightMEng * heightMEng);
                        let categoryEng = '';
                        if (bmiEng < 18.5) categoryEng = 'Underweight';
                        else if (bmiEng < 25) categoryEng = 'Normal';
                        else if (bmiEng < 30) categoryEng = 'Overweight';
                        else categoryEng = 'Obese';
                        response = `CON Your BMI is ${bmiEng.toFixed(1)} (${categoryEng})\nDo you want health tips?\n1. Yes\n2. No\n0. Back`;
                    } else {
                        const tipChoiceEng = textArray[4];
                        const ageEng = parseFloat(textArray[1]);
                        const weightEng = parseFloat(textArray[2]);
                        const heightCmEng = parseFloat(textArray[3]);
                        const heightMEng = heightCmEng / 100;
                        const bmiEng = weightEng / (heightMEng * heightMEng);
                        let categoryEng = '';
                        if (bmiEng < 18.5) categoryEng = 'Underweight';
                        else if (bmiEng < 25) categoryEng = 'Normal';
                        else if (bmiEng < 30) categoryEng = 'Overweight';
                        else categoryEng = 'Obese';

                        let tipEng = '';
                        if (bmiEng < 18.5) {
                            tipEng = "Eat more proteins and healthy carbs.";
                        } else if (bmiEng < 25) {
                            tipEng = "Great job! Maintain your routine.";
                        } else if (bmiEng < 30) {
                            tipEng = "Exercise regularly and limit sugar.";
                        } else {
                            tipEng = "See a doctor and follow a weight-loss plan.";
                        }

                        // Save BMI record
                        const bmiRecord = new BmiRecord({
                            session_id: sessionId,
                            phone_number: phoneNumber,
                            age: ageEng,
                            weight: weightEng,
                            height: heightCmEng,
                            bmi_value: parseFloat(bmiEng.toFixed(1)),
                            bmi_category: categoryEng,
                            requested_tips: tipChoiceEng === '1'
                        });
                        await bmiRecord.save();

                        // Update session status
                        session.status = 'completed';

                        response = tipChoiceEng === '1'
                            ? `END Tip: ${tipEng}`
                            : `END Thanks for using BMI Checker. Stay healthy!`;
                    }
                    break;

                default:
                    response = `END Invalid input. Try again.`;
            }
        }

        else if (textArray[0] === '2') {
            switch (level) {
                case 1:
                    response = `CON Andika imyaka yawe:\n0. Back`;
                    break;

                case 2:
                    if (textArray[1] === '0') {
                        response = `CON Welcome to BMI Checker / Murakaza neza kuri BMI Checker\n1. English\n2. Kinyarwanda`;
                    } else {
                        // Save age
                        session.age = parseFloat(textArray[1]);
                        response = `CON Andika ibiro byawe mu kirogaramu (KG):\n0. Back`;
                    }
                    break;

                case 3:
                    if (textArray[2] === '0') {
                        response = `CON Andika imyaka yawe:\n0. Back`;
                    } else {
                        response = `CON Andika uburebure bwawe mu santimetero (CM):\n0. Back`;
                    }
                    break;

                case 4:
                    if (textArray[3] === '0') {
                        response = `CON Andika ibiro byawe mu kirogaramu (KG):\n0. Back`;
                    } else {
                        const ageKin = parseFloat(textArray[1]);
                        const weightKin = parseFloat(textArray[2]);
                        const heightCmKin = parseFloat(textArray[3]);
                        const heightMKin = heightCmKin / 100;
                        const bmiKin = weightKin / (heightMKin * heightMKin);
                        let categoryKin = '';
                        if (bmiKin < 18.5) categoryKin = 'Ufite ibiro bikeya';
                        else if (bmiKin < 25) categoryKin = 'Uri muzima';
                        else if (bmiKin < 30) categoryKin = 'Ufite ibiro byinshi';
                        else categoryKin = 'Ufite ibiro byinshi cyane';

                        response = `CON BMI yawe ni ${bmiKin.toFixed(1)} (${categoryKin})\nUkeneye inama z'ubuzima?\n1. Yego\n2. Oya\n0. Back`;
                    }
                    break;

                case 5:
                    if (textArray[4] === '0') {
                        const ageKin = parseFloat(textArray[1]);
                        const weightKin = parseFloat(textArray[2]);
                        const heightCmKin = parseFloat(textArray[3]);
                        const heightMKin = heightCmKin / 100;
                        const bmiKin = weightKin / (heightMKin * heightMKin);
                        let categoryKin = '';
                        if (bmiKin < 18.5) categoryKin = 'Ufite ibiro bikeya';
                        else if (bmiKin < 25) categoryKin = 'Uri muzima';
                        else if (bmiKin < 30) categoryKin = 'Ufite ibiro byinshi';
                        else categoryKin = 'Ufite ibiro byinshi cyane';
                        response = `CON BMI yawe ni ${bmiKin.toFixed(1)} (${categoryKin})\nUkeneye inama z'ubuzima?\n1. Yego\n2. Oya\n0. Back`;
                    } else {
                        const tipChoiceKin = textArray[4];
                        const ageKin = parseFloat(textArray[1]);
                        const weightKin = parseFloat(textArray[2]);
                        const heightCmKin = parseFloat(textArray[3]);
                        const heightMKin = heightCmKin / 100;
                        const bmiKin = weightKin / (heightMKin * heightMKin);
                        let categoryKin = '';
                        if (bmiKin < 18.5) categoryKin = 'Ufite ibiro bikeya';
                        else if (bmiKin < 25) categoryKin = 'Uri muzima';
                        else if (bmiKin < 30) categoryKin = 'Ufite ibiro byinshi';
                        else categoryKin = 'Ufite ibiro byinshi cyane';

                        let tipKin = '';
                        if (bmiKin < 18.5) {
                            tipKin = "Rya neza, wongere ibiro ibirimo intungamubiri.";
                        } else if (bmiKin < 25) {
                            tipKin = "Komeza uko ubayeho. Ni byiza!";
                        } else if (bmiKin < 30) {
                            tipKin = "Gabanya isukari kandi ujye ukora imyitozo.";
                        } else {
                            tipKin = "Sura muganga kandi ugabanye ibiro ukoresheje regime.";
                        }

                        // Save BMI record
                        const bmiRecord = new BmiRecord({
                            session_id: sessionId,
                            phone_number: phoneNumber,
                            age: ageKin,
                            weight: weightKin,
                            height: heightCmKin,
                            bmi_value: parseFloat(bmiKin.toFixed(1)),
                            bmi_category: categoryKin,
                            requested_tips: tipChoiceKin === '1'
                        });
                        await bmiRecord.save();

                        // Update session status
                        session.status = 'completed';

                        response = tipChoiceKin === '1'
                            ? `END Inama: ${tipKin}`
                            : `END Urakoze gukoresha BMI Checker. Gira ubuzima bwiza!`;
                    }
                    break;

                default:
                    response = `END Ibyinjijwe si byo. Ongera ugerageze.`;
            }
        }

        else {
            response = `END Invalid input. Please try again.`;
        }

        // Save session
        await session.save();

        res.set('Content-Type: text/plain');
        res.send(response);

    } catch (error) {
        console.error('Database error:', error);
        res.set('Content-Type: text/plain');
        res.send('END System error. Please try again later.');
    }
});

app.listen(PORT, () => {
    console.log(`BMI USSD app running on port ${PORT}`);
});
