import { login, logout } from './login'
import '@babel/polyfill'
import { displayMap } from './leaflet';
import { updateSettings } from './updateSettings';
import { bookTour } from './stripe';
import { signup } from './signup';

// DOM elements
const map = document.getElementById('map')
const form = document.querySelector('.form--login');
const signupform = document.querySelector('.form--signup');


const logOutBtn = document.querySelector('.nav__el--logout')
const userDataForm = document.querySelector('.form-user-data')
const userPasswordForm = document.querySelector('.form-user-password')
const bookBtn = document.getElementById('book-tour')

if (map) {
    const locations = JSON.parse(map.dataset.locations);
    displayMap(locations)

}

if (form) {
    
    form.addEventListener('submit', e => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const pwd = document.getElementById('password').value;
        login(email, pwd)
    
    })
}
if (signupform) {
    signupform.addEventListener('submit', e => {
        e.preventDefault();
        document.querySelector('.btn-signup').textContent = 'Welcome ...'

        const name = document.getElementById('name').value;
        const email = document.getElementById('emailSignup').value;
        const pwd = document.getElementById('password').value;
        const pwdCnfrm = document.getElementById('confirmPassword').value;
        signup(name,email,pwd,pwdCnfrm);
    })
}

if(logOutBtn) logOutBtn.addEventListener('click',logout)
if(userDataForm) {
    userDataForm.addEventListener('submit',e=>{
        e.preventDefault();
        // console.log("hello");
        const form = new FormData();
        form.append('name', document.getElementById('name').value)
        form.append('email', document.getElementById('emailInput').value)
        form.append('photo',document.getElementById('photo').files[0])

        // console.log(form);
        updateSettings(form,'data')
    })
}
// console.log(userPasswordForm);
if (userPasswordForm) {
    userPasswordForm.addEventListener('submit', async e => {
        e.preventDefault();
        document.querySelector('.btn--save--password').textContent = 'Updating...'
        const pwdCurrent = document.getElementById('password-current').value;
        const pwd = document.getElementById('password').value;
        const pwdCnfrm = document.getElementById('password-confirm').value;
        await updateSettings({ pwdCurrent,pwd,pwdCnfrm }, 'pwd')

        document.querySelector('.btn--save--password').textContent = 'Save password'
        document.getElementById('password-current').value = '';
        document.getElementById('password-confirm').value = '';
        document.getElementById('password').value = '';
    })
}

if(bookBtn){
    bookBtn.addEventListener('click',e=>{
        e.target.textContent = 'Processing'
        const {tourId} = e.target.dataset;
        // console.log(tourId);
        bookTour(tourId)
    })
}
