const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const PORT = 5070;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.post('/ussd', (req, res) => {
    try {
        let { sessionId, serviceCode, phoneNumber, text } = req.body;

        let response = '';
        const textArray = text.split('*');
        const level = textArray.length;

        if (text === '') {
            response = `CON Welcome to favourite food app, please choose language,\n
            Murakaza neza kuri favourite food app, Hitamo ururimi,\n
            1. English\n
            2. Kinyarwanda`;
        }

        else if (text === '1') {
            response = `CON Select the dish you like most\n
            1. Chips and Chicken\n
            2. Beef and green Plantain\n
            3. Rice and beans\n
            4. Cassava Bread and greens\n
            5. Back`;
        }

        else if (text === '2') {
            response = `CON Hitamo ibiryo Ukunda\n
            1. Ifiriti n’Inkoko\n
            2. Agatogo\n
            3. Umuceri n’ibishyimbo\n
            4. Ubugari n’isombe\n
            5. Gusubira inyuma`;
        }

        else if (text === '1*1') {
            response = `END Your favourite food is Chips and Chicken, that is so unhealthy, do not eat it regularly.`;
        } else if (text === '1*2') {
            response = `END Your favourite food is Beef and green Plantain, that is healthy, as long as you eat it less than 5 times a week.`;
        } else if (text === '1*3') {
            response = `END Your favourite food is Rice and beans. That is healthy, as long as you drink a lot of water and eat some green vegetables.`;
        } else if (text === '1*4') {
            response = `END Your favourite food is Cassava Bread and greens, that is healthy. Verify that there is not too much oil in the greens.`;
        }else if (text === '1*5'){
            response = `CON Welcome to favourite food app, please choose language,\n
            Murakaza neza kuri favourite food app, Hitamo ururimi,\n
            1. English\n
            2. Kinyarwanda`;
        }

        else if (text === '2*1') {
            response = `END Ibiryo ukunda ni ifiriti n’inkoko, Si byiza ku buzima ntukabirye buri kenshi.`;
        } else if (text === '2*2') {
            response = `END Ibiryo ukunda ni agatogo ni byiza ku buzima iyo ubiriye utarengeje icuro 5 mu cyumweru.`;
        } else if (text === '2*3') {
            response = `END Ibiryo ukunda ni umuceri n’ibishyimbo. Ni byiza ku buzima mu gihe wanyweye amazi menshi ukarya n’imboga.`;
        } else if (text === '2*4') {
            response = `END Ibiryo ukunda ni ubugari n’isombe ni byiza ku ubuzima, ugenzure neza niba isombe ritarimo amavuta menshi.`;
        }else if (text === '2*5'){
            response = `CON Welcome to favourite food app, please choose language,\n
            Murakaza neza kuri favourite food app, Hitamo ururimi,\n
            1. English\n
            2. Kinyarwanda`;
        }

        else {
            response = `END Invalid input. Please try again.`;
        }

        res.set('Content-Type: text/plain');
        res.send(response);
    } catch (error) {
        console.error('USSD Error:', error);
        res.status(500).send('END An error occurred. Please try again later.');
    }
});

app.listen(PORT, () => {
    console.log(`USSD app running on port ${PORT}`);
});
