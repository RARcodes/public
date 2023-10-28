const CHAR_MAP = "CM7WD6N4RHF9ZL3XKQGVPBTJY";
const BASE = CHAR_MAP.length;
const EPOCH = new Date("2016-02-01");

function encode(num) {
    let encoded = "";

    while (num >= BASE) {
        encoded = CHAR_MAP[num % BASE] + encoded;
        num = Math.floor(num / BASE);
    }

    return CHAR_MAP[num] + encoded;
}

function decode(encoded) {
    let num = 0;

    for (let i = 0; i < encoded.length; i++) {
        const char = encoded[i];
        const exp = encoded.length - i - 1;
        num += Math.pow(BASE, exp) * CHAR_MAP.indexOf(char);
    }

    return num;
}

function getMinutesSinceEpoch(purchased) {
    const date = new Date(purchased);
    return Math.floor(date - EPOCH) / 1000 / 60 - date.getTimezoneOffset();
}

function getCheckDigit(code) {
    const chars = code.split("").reverse();
    let checkDigit = 0;

    for (let i = 0; i < chars.length; i++) {
        let value = decode(chars[i]);

        if (i % 2 === 0) {
            value *= 2;
            const encoded = encode(value);

            if (encoded.length === 2) {
                value = [...encoded].map(decode).reduce((total, num) => total + num, 0);
            }
        }

        checkDigit += value;
    }

    checkDigit %= BASE;

    if (checkDigit > 0) {
        checkDigit = BASE - checkDigit;
    }

    return checkDigit;
}

function generateCode() {
    const store_ids = [203, 177, 95, 700, 569, 487, 1039, 874, 502, 1208, 420, 793, 1235, 1022, 598, 1136, 1570, 311, 1079, 1409, 860, 1166, 1347, 648, 1353, 923, 1385, 1616, 495, 176];
    const store_id = store_ids[Math.floor(Math.random() * store_ids.length)];
    const encStoreId = encode(store_id).padStart(3, encode(0));
    const encVisitType = encode(3);
    const orderId = Math.floor(Math.random() * 100) + 125;
    const encOrderId = encode(orderId);
    const purchased = new Date("2023-10-10T01:00:00");
    const encMinutes = encode(getMinutesSinceEpoch(purchased)).padStart(5, encode(0));

    let code = encStoreId + encVisitType + encOrderId + encMinutes;

    code += encode(getCheckDigit(code));

    return code.match(/.{4}/g).join("-");
}

var apiData = document.getElementById('api-data');
apiData.innerText = generateCode();

