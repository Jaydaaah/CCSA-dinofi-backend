
const Reset = "\x1b[0m";
const Bright = "\x1b[1m";
const _Bright = "\x1b[22m";
const Underscore = "\x1b[4m";
const _Underscore = "\x1b[24m";

const BrighWhite = "\x1b[37m";
const FgGray = "\x1b[90m";

type Color = "Black" | "Red" | "Green" | "Yellow" | "Blue" | "Magenta" | "Cyan" | "White" | "Gray";
let Fg: Record<Color | string, string> = {};
Fg["Black"] = "\x1b[30m";
Fg["Red"] = "\x1b[31m";
Fg["Green"] = "\x1b[32m";
Fg["Yellow"] = "\x1b[33m";
Fg["Blue"] = "\x1b[34m";
Fg["Magenta"] = "\x1b[35m";
Fg["Cyan"] = "\x1b[36m";
Fg["White"] = "\x1b[37m";
Fg["Gray"] = "\x1b[90m";

function Bold(text: string) {
    return `${Bright}${text}${_Bright}`
}

function UnderScore(text: string) {
    return `${Underscore}${text}${_Underscore}`
}

export function Logger(func_name: string) {
    return function(text: string, color: Color = "White", option?: {bright?: string[], underscore?: string[]}) {
        let dateTime = new Date();
        if (option?.bright) {
            for (const b of option.bright) {
                text = text.replace(b, Bold(b))
            }
        }
        if (option?.underscore) {
            for (const u of option.underscore) {
                text = text.replace(u, UnderScore(u))
            }
        }
        console.log(`${FgGray}(${func_name}) ${Reset}[${Fg["Blue"]}${dateTime.toLocaleTimeString()}${Reset}] - ${Fg[color]}${text}${Reset}`);
    }
}

export function PrintFetch(method: "GET" | "POST" | "PUT" | "DELETE") {
    let dateTime = new Date();
    switch (method) {
        case "GET":
            method = Fg["Yellow"] + method;
            break;
        case "POST":
            method = Fg["Green"] + method;
            break;
        case "PUT":
            method = Fg["Blue"] + method;
            break;
        case "DELETE":
            method = Fg["Red"] + method;
            break;
    }
    console.log(`\n[${Fg["Yellow"]}${dateTime.toLocaleTimeString()}${Reset}] - Fetched received: ${method}${Reset}`);
}
