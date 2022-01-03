const nameBtn     = document.getElementById('name-btn');
const hexaBtn     = document.getElementById('hexa-btn');
const rgbBtn      = document.getElementById('rgb-btn');
const backBtn     = document.querySelector('.collapse a');

const bgColorName = document.getElementById('bg-color-name');
const bgColorHex  = document.getElementById('bg-color-hex');
const bgColorRGB  = document.getElementById('bg-color-rgb');
const randomBtn   = document.getElementById('random-btn');
const inputColor  = document.getElementById('input-color');
const year        = document.getElementById('year');
const description = document.getElementById('description');
const footer      = document.getElementById('footer');
const hexChar     = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "A", "B", "C", "D", "E", "F"];
const digit256    = [];

for(let cptr = 0; cptr < 256; cptr++) {
    digit256.push(cptr);
}

/*--------------- SET DEFAULT VALUES ZONE -------------------*/
var colorType           = 'Name';
bgColorName.textContent = 'White';
bgColorHex.textContent  = 'FFFFFF';
bgColorRGB.textContent  = '(255, 255, 255)';
bgColorName.style.color = 'SteelBlue';
bgColorHex.style.color  = 'SteelBlue';
bgColorRGB.style.color  = 'SteelBlue';
inputColor.placeholder  = `Enter your Color ${colorType} here`;
description.textContent = 'There are 148 names of colors that can be interpreted by browsers, but if we remove the duplicate shades of gray, only 141 remain.';
/*-----------------------------------------------------------*/
window.addEventListener('load', () => {
    resizeBtn();
});

window.addEventListener('resize', () => {
    resizeBtn();
});

nameBtn.addEventListener('click', () => {
    colorType = 'Name';
    inputColor.placeholder  = `Enter your Color ${colorType} here`;
    description.textContent = 'There are 148 names of colors that can be interpreted by browsers, but if we remove the duplicate shades of gray, only 141 remain.';
});

hexaBtn.addEventListener('click', () => {
    colorType = 'Hex';
    inputColor.placeholder  = `Enter your Color ${colorType} code here`;
    description.textContent = 'The 141 nameable colors represent only 0.000840425% of the 16.777.216 colors codable in hexadecimal on 6 characters...';
});

rgbBtn.addEventListener('click', function () { /* oldschool style */
    colorType = 'RGB';
    inputColor.placeholder = 'Enter your Color (R, G, B) code here';
    description.textContent = colorType + '? Please, watch the online doc on this subject.';
});

/*--------------- JSON ZONE -------------------*/
// 1. Charger le fichier json
const requestURL = './colornames.json';

// 2. Instancier un new objet pour créer la requête
const request = new XMLHttpRequest();

// 3. Ouvrir la requête
request.open('GET', requestURL);

// 4. Définir le type de réponse
request.responseType = 'text';

// 5 Envoyer la requête au serveur
request.send();

// 6. Traiter la réponse obtenue du serveur
request.onload = function() {
    const colorsResponseText = request.response;// get the string from the response
    const colorsResponse = JSON.parse(colorsResponseText); // convert it to an object

    const arrayColors = populateArrays(colorsResponse);
    // console.log(arrayColors);

    const arrayColorsLength = arrayColors[0].length;

    randomButton(arrayColors[0], arrayColors[1], arrayColorsLength);
    searchColor(arrayColors);

    /* test
     *
     * var doublons = [];
     * for(let i = 0; i < arrayColorsLength; i++) {
     *     if(arrayColors[1][i] === arrayColors[1][i+1]) {
     *         doublons.push(arrayColors[0][i]);
     *     }
     * }
     * console.log(doublons);
     * ------*/

    year.textContent = getCurrentYear();
}
/*---------------------------------------------*/

function randomButton(arg1, arg2, arg3) {
    let colorRandom, colorRandomPos, rgb, r, g, b, i;

    randomBtn.addEventListener('click', function() {
        switch(colorType) {
            case 'Name' :
                colorRandom             = arg1[(Math.random() * arg3) | 0];
                document.body.style     = `background-color: ${colorRandom}`;
                bgColorName.textContent = colorRandom;
                
                colorRandomPos          = arg1.indexOf(colorRandom);
                bgColorHex.textContent  = arg2[colorRandomPos];

                rgb                     = hexToRGB(hexChar, arg2[colorRandomPos]);
                bgColorRGB.textContent  = `(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;
                // console.log(document.body.style.backgroundColor);
                break;
    
            case 'Hex' :
                colorRandom = '';
                for(i = 0; i < 6; i++) {
                    colorRandom        += hexChar[(Math.random() * 16) | 0];
                }
                document.body.style     = `background-color: #${colorRandom}`;
                bgColorHex.textContent  = colorRandom;

                if(arg2.includes(colorRandom)) {
                    colorRandomPos          = arg2.indexOf(colorRandom);
                    bgColorName.textContent = arg1[colorRandomPos];
                } else {
                    bgColorName.textContent = ' - ';
                }

                rgb                     = hexToRGB(hexChar, colorRandom);
                bgColorRGB.textContent  = `(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;
                break;

            case 'RGB' :
                colorRandom = '';
                for(i = 0; i < 3; i++) {
                    colorRandom        = digit256[(Math.random() * 256) | 0];
                    if(i == 0) {
                        r = colorRandom;
                    } else if(i == 1) {
                        g = colorRandom;
                    } else {
                        b = colorRandom;
                    }
                }
                bgColorRGB.textContent  = `(${r}, ${g}, ${b})`;
                document.body.style     = `background-color: rgb(${r}, ${g}, ${b})`;
                
                bgColorHex.textContent  = RGBToHex(hexChar, r, g, b);

                if(arg2.includes(bgColorHex.textContent)) {
                    colorRandomPos          = arg2.indexOf(bgColorHex.textContent);
                    bgColorName.textContent = arg1[colorRandomPos];
                } else {
                    bgColorName.textContent = ' - ';
                }
                break;

            default :
                break;
        }
    });
}

function searchColor(arg) {
    inputColor.addEventListener('input', function () {
        let position;
        
        switch(colorType) {
            case 'Name' :
                argLowerCase = []; 
                for(let cptr = 0; cptr < arg[0].length; cptr++) {
                    argLowerCase.push(arg[0][cptr].toLowerCase());
                }
                if(argLowerCase.includes(inputColor.value.toLowerCase())) {
                    position                = argLowerCase.indexOf(inputColor.value.toLowerCase());
                    bgColorName.textContent = arg[0][position];
                    document.body.style     = `background-color: ${inputColor.value}`;
                
                    bgColorHex.textContent  = arg[1][position];
                    
                    rgb                     = hexToRGB(hexChar, bgColorHex.textContent);
                    bgColorRGB.textContent  = `(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;
                } else {
                    bgColorName.textContent = 'White';
                    bgColorHex.textContent  = 'FFFFFF';
                    bgColorRGB.textContent  = '(255, 255, 255)';
                    document.body.style     = `background-color: White`;
                }
                break;

            case 'Hex' :
                let res = [];
                if(inputColor.value.length === 6) {
                    inputColor.value = inputColor.value.toUpperCase();
                    for(let i = 0; i < 6; i++) {
                        res.push(hexChar.includes(inputColor.value.substring(i, i+1)));
                        console.log(res[i]);
                    }
                    bgColorHex.textContent = res.includes(false) ? '' : inputColor.value;
                    document.body.style    = `background-color: #${inputColor.value}`;
                    
                    if(arg[1].includes(inputColor.value)) {
                        position = arg[1].indexOf(inputColor.value);
                        bgColorName.textContent = arg[0][position];
                    } else {
                        bgColorName.textContent = ' - ';
                    }

                    rgb                     = hexToRGB(hexChar, inputColor.value);
                    bgColorRGB.textContent  = `(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;
                } else {
                    bgColorName.textContent = 'White';
                    bgColorHex.textContent  = 'FFFFFF';
                    bgColorRGB.textContent  = '(255, 255, 255)';
                    document.body.style     = `background-color: White`;
                }
                break;
            
            case 'RGB' :
                let r, g, b, regex = /^(\d{1}[,]|\d{2}[,]|[1]{1}\d{2}[,]|[2]{1}[0-4]{1}\d{1}[,]|[2]{1}[5]{1}[0-5]{1}[,]){2}(\d{1}$|\d{2}$|[1]{1}\d{2}$|[2]{1}[0-4]{1}\d{1}$|[2]{1}[5]{1}[0-5]{1}$)$/gm; // Yeah Man !
                
                if(inputColor.value.length >= 5 && inputColor.value.length <= 11) {
                    // console.log(regex.test(inputColor.value));
                    if(regex.test(inputColor.value)) {
                        r = inputColor.value.substring(0, inputColor.value.indexOf(','));
                        // console.log(`pos 1ère virgule = ${inputColor.value.indexOf(',')}`);
                        inputColor.value.indexOf(',', inputColor.value.indexOf(',') + 1);
                        // console.log(`pos 2ème virgule = ${inputColor.value.indexOf(',', inputColor.value.indexOf(',') + 1)}`);
                        g = inputColor.value.substring(inputColor.value.indexOf(',') + 1, inputColor.value.indexOf(',', inputColor.value.indexOf(',') + 1));
                        b = inputColor.value.substring(inputColor.value.indexOf(',', inputColor.value.indexOf(',') + 1) + 1);

                        bgColorRGB.textContent = `(${r}, ${g}, ${b})`;
                        document.body.style    = `background-color: rgb${bgColorRGB.textContent}`;

                        bgColorHex.textContent  = RGBToHex(hexChar, r, g, b);
                        if(arg[1].includes(bgColorHex.textContent)) {
                            position = arg[1].indexOf(bgColorHex.textContent);
                            bgColorName.textContent = arg[0][position];
                        } else {
                            bgColorName.textContent = ' - ';
                        }
                    }
                } else {
                    bgColorName.textContent = 'White';
                    bgColorHex.textContent  = 'FFFFFF';
                    bgColorRGB.textContent  = '(255, 255, 255)';
                    document.body.style     = `background-color: White`;
                }
                break;
            
            default : 
                break;
        }
        // console.log(arrayColors[0].includes(inputColor.value));
    });
}

function populateArrays(jsonObj) {
    let colorsNames = [];
    let colorsHex = [];

    let colors = jsonObj['colors'];

    for(let i = 0; i < colors.length; i++) {
        colorsNames.push(colors[i]['name']);
        colorsHex.push(colors[i]['hex']);
    }

    return [colorsNames, colorsHex];
}

function hexToRGB(arg1, arg2) {
    let digit, R, G, B;

    digit = arg2.substring(0, 1);
    R     = 16 * arg1.indexOf(digit);
    digit = arg2.substring(1, 2);
    R    += arg1.indexOf(digit);

    digit = arg2.substring(2, 3);
    G     = 16 * arg1.indexOf(digit);
    digit = arg2.substring(3, 4);
    G    += arg1.indexOf(digit);

    digit = arg2.substring(4, 5);
    B     = 16 * arg1.indexOf(digit);
    digit = arg2.substring(5);
    B    += arg1.indexOf(digit);

    return [R, G, B];
}

function RGBToHex() { /* version du genou : arg1 = red, arg2 = green, arg3 = blue, arg4 = hexChar array */
    let hex = '';
    for(let i = 1; i < arguments.length; i++) {
        hex += (arguments[0][parseInt(arguments[i] / 16)]) + (arguments[0][arguments[i] - (parseInt(arguments[i] / 16) * 16)]);
    }

    /* Version du genou */
    /* Conversion Red to Hex */
    //hex += arg4[parseInt(arg1 / 16)];
    //hex += arg4[arg1 - (parseInt(arg1 / 16) * 16)];
    // console.log(hex);
    
    /* Conversion Green to Hex */
    //hex += arg4[parseInt(arg2 / 16)];
    //hex += arg4[arg2 - (parseInt(arg2 / 16) * 16)];
    // console.log(hex);

    /* Conversion Blue to Hex */
    //hex += arg4[parseInt(arg3 / 16)];
    //hex += arg4[arg3 - (parseInt(arg3 / 16) * 16)];
    // console.log(hex);
    return hex;
}

function getCurrentYear() {
    let currentYear = new Date();
    
    return currentYear.getFullYear();
}

function resizeBtn() {
    const clientWidth = window.innerWidth;

    if(clientWidth <= 450) {
        nameBtn.classList = 'btn btn-secondary btn-sm mb-2 mx-auto col-3';
        hexaBtn.classList = 'btn btn-secondary btn-sm mb-2 mx-auto col-3';
        rgbBtn.classList  = 'btn btn-secondary btn-sm mb-2 mx-auto col-3';
        backBtn.classList = 'btn btn-success btn-sm mb-2 mx-auto col-9 col-sm-9 col-md-6 col-lg-3';
        inputColor.style.fontSize = '12px';
        inputColor.style.maxWidth = '250px';
        footer.style.maxHeight    = '5Opx';
        footer.style.padding      = '2px';
    } else {
        nameBtn.classList = 'btn btn-secondary btn-lg mb-3 mx-auto col-3';
        hexaBtn.classList = 'btn btn-secondary btn-lg mb-3 mx-auto col-3';
        rgbBtn.classList  = 'btn btn-secondary btn-lg mb-3 mx-auto col-3';
        backBtn.classList = 'btn btn-success btn-lg mb-3 mx-auto col-9 col-sm-9 col-md-6 col-lg-3';
        inputColor.style.fontSize = '16px';
        inputColor.style.maxWidth = '360px';
        footer.style.maxHeight    = 'auto';
        footer.style.padding      = 'auto';
    }
}