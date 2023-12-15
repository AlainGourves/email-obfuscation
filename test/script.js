import Obfuscation from 'email-obfuscation';

let obfu;

const email = document.querySelector('#email');
const key = document.querySelector('#key');
const encodedAddress = document.querySelector('#encoded-address');
const btnObfuscate = document.querySelector('#obfuscate');
const btnDesobfuscate = document.querySelector('#desobfuscate');
const btnCopy = document.querySelector('#copy-btn');
const btnErase = document.querySelector('.svg-erase');
const links = document.querySelectorAll('.mailto');
const pres = document.querySelectorAll('pre');

const displayCode = (display, mail, encoded) => {
    links.forEach(link => {
        link.href = encoded;
        link.textContent = encoded;
    })
    pres[0].textContent = links[0].outerHTML;
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
            btnDesobfuscate.disabled = false;
            displayCode('flex', mail, encoded);
        }
    });

    btnDesobfuscate.addEventListener('click', (ev) => {
        if (!btnDesobfuscate.disabled) {
            const encodedMail = links[1].innerText;
            const mail = obfu.decode(encodedMail);
            links[1].href = `mailto:${mail}`;
            links[1].textContent = mail;
            btnDesobfuscate.disabled = true;
            pres[1].textContent = links[1].outerHTML;

        }
    })

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
        btnErase.style.opacity = (n > 0) ? 1 : 0;
        if (n === 0) {
            // reset
            encodedAddress.value = '';
            btnCopy.disabled = true;
            displayCode('none', '', '');
            btnDesobfuscate.disabled = false;
        };
    });

})