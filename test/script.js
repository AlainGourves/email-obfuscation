import Obfuscation from 'email-obfuscation';

let obfu;

const email = document.querySelector('#email');
const key = document.querySelector('#key');
const encodedAddress = document.querySelector('#encoded-address');
const btnObfuscate = document.querySelector('#obfuscate');
const btnCopy = document.querySelector('.svg-copy');
const btnErase = document.querySelector('.svg-erase');
const links = document.querySelectorAll('.mailto');
const pres = document.querySelectorAll('pre');

const displayCode = (display, encoded) => {
    links[0].textContent = encoded;
    links[0].href = encoded;
    pres[0].textContent = links[0].outerHTML;
    let mail = '';
    if (encoded){
        mail = obfu.decode(encoded);
        btnCopy.classList.add('visible');
    }else{
        btnCopy.classList.remove('visible')
    }
    links[1].href = `mailto:${mail}`;
    links[1].textContent = mail;
    pres[1].textContent = links[1].outerHTML;
    document.querySelector('.preview').style.display = display;
}

window.addEventListener('load', (ev) => {
    btnObfuscate.addEventListener('click', (ev) => {
        const encryptionKey = parseInt(key.value);
        if (email.value && encryptionKey) {
            obfu = new Obfuscation(encryptionKey);
            const mail = email.value;
            const encoded = obfu.encode(mail);
            encodedAddress.value = encoded;
            btnCopy.disabled = false;
            displayCode('flex', encoded);
        }
    });

    btnCopy.addEventListener('click', async (ev) => {
        if (navigator.clipboard) {
            if (encodedAddress.value) {
                const btnIcon = btnCopy.querySelector('use');
                await navigator.clipboard.writeText(encodedAddress.value);

                const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
                btnIcon.setAttribute('href', '#check');
                btnCopy.classList.add('copied')
                wait(2000)
                    .then(() => {
                        btnIcon.setAttribute('href', '#copy');
                        btnCopy.classList.remove('copied')
                    })
                    .catch(e => console.error(e));
            }
        } else {
            alert("You'll have to manually copy the code 😢")
        }
    });

    btnErase.addEventListener('click', (ev) => {
        email.value = '';
        email.dispatchEvent(new Event('change'));
    })

    email.addEventListener('change', (ev) => {
        const n = ev.target.value.length;
        btnObfuscate.disabled = !(n > 0);
        if (n>0) {
            btnErase.classList.add('visible');
        }else{
            btnErase.classList.remove('visible');
        }
        if (n === 0) {
            // reset
            encodedAddress.value = '';
            displayCode('none', '');
        };
    });

})