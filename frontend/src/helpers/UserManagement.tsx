import {InputAdornment} from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import React from "react";

export const isEmpty = (value: string) => {
    return value.length <= 0;
}

export const passwordsPresent = (password: string, cPassword: string): boolean => {
    return !isEmpty(password) && !isEmpty(cPassword);
}

export const passwordsEqual = (password: string, cPassword: string): boolean => {
    return password == cPassword
}

export const passwordsValid = (password: string, cPassword: string): boolean => {
    return password.length >= 8 && passwordsPresent(password, cPassword) && passwordsEqual(password, cPassword)
}

export const companyValid = (company: string): boolean => {
    return !containsSpecialChars(company) && company.length > 0 && company.length <= 100
}

export const emailValid = (email: string): boolean => {
    const illegalChars = /[`!#$%^&*()_+\-=\[\]{};':"\\|,<>\/?~]/
    return !illegalChars.test(email) && email.length > 0 && (email.match(new RegExp("@", "g")) || []).length == 1
}

export const inputValid = (company: string, email: string, password: string, cPassword: string): boolean => {
    return passwordsValid(password, cPassword) && companyValid(company) && emailValid(email)
}

export const containsSpecialChars = (str: string) => {
    const specialChars = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/
    return specialChars.test(str)
}

export const getPasswordInputProps = (password: string, cPassword: string) => {
    if (passwordsValid(password, cPassword)) {
        return {
            endAdornment: (
                <InputAdornment position="end">
                    <CheckIcon color="success"/>
                </InputAdornment>
            )
        }
    } else if (!passwordsPresent(password, cPassword)) {
        return
    } else {
        return {
            endAdornment: (
                <InputAdornment position="end">
                    <CloseIcon color="error"/>
                </InputAdornment>
            )
        }
    }
}

export const getRequiredHelperText = () => {
    return "Bitte füllen sie dieses Feld aus!"
}

export const getCompanyHelperText = (company: string) => {
    if (isEmpty(company)) {
        return getRequiredHelperText()
    } else if (company.length > 100) {
        return "Bitte geben sie einen kürzeren Betriebsnamen an!"
    } else if (containsSpecialChars(company)) {
        return "Es sind keine Sonderzeichen erlaubt!"
    } else {
        return
    }
}

export const getMailHelperText = (email: string, emailUnique: boolean = true) => {
    if (isEmpty(email)) {
        return getRequiredHelperText()
    } else if (!emailValid(email)) {
        return "Bitte geben Sie eine gültige Email-Adresse an!"
    } else if (!emailUnique) {
        return "Diese Email wird bereits verwendet!"
    }
    else {
        return
    }
}

export const getPasswordHelperText = (password: string, cPassword: string, confirm: boolean) => {
    if ((isEmpty(password) && !confirm) || (isEmpty(cPassword) && confirm)) {
        return getRequiredHelperText()
    } else if(password.length < 8) {
        return "Ihr Passwort muss mindestens 8 Zeichen lang sein!"
    } else if (!passwordsPresent(password, cPassword)) {
        return
    } else if (!passwordsValid(password, cPassword)) {
        return "Passwörter stimmen nicht überein!"
    } else {
        return
    }
}
