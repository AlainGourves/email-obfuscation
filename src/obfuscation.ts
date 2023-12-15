export default class Obfuscation {
    key: number;

    constructor(key: number) {
        this.key = key;
    }

    encode(str: string) {
        const hex = this.toHex(str);
        return this.xor(hex);
    }

    decode(str: string) {
        const hex = this.xor(str);
        return this.fromHex(hex);
    }

    toHex(str: string) {
        let result = ''
        for (let i = 0; i < str.length; i++) {
            const hex = str.charCodeAt(i).toString(16);
            result += (hex.length === 2) ? hex : `0${hex}`;
        }
        return result;
    }

    fromHex(hex: string) {
        let result = ''
        for (let i = 0; i < hex.length; i += 2) {
            const x = hex.substring(i, i + 2);
            result += String.fromCharCode(parseInt(x, 16))
        }
        return result;
    }

    xor(str: string) {
        let result = '';
        for (let i = 0; i < str.length; i += 2) {
            const hex = parseInt(str.substring(i, i + 2), 16);
            const xored = (hex ^ this.key).toString(16)
            result += (xored.length === 2) ? xored : `0${xored}`;
        }
        return result;
    }
}