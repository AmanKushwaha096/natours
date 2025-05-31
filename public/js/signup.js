import axios from "axios";
import { showAlert } from "./alerts";

export const signup = async (name, email, pwd, pwdCnfrm) => {
    try {
        const res = await axios({
            method: 'POST',
            url: 'http://127.0.0.1:3000/api/v1/users/signup',
            data: { name, email, pwd, pwdCnfrm }
        })
        if (res.data.status === 'success') {
            showAlert('success', 'Account created succesfully')
            window.setTimeout(() => {
                location.assign('/')
            }, 1500)
        }
        // console.log(res);
    }
    catch (err) {
        showAlert('error', err.response.data.message)
    }
}