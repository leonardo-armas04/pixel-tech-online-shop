function isEmpty(value) {
    return !value || value.trim() === ""
}

function userCredentialsAreValid(email,password) {
    return (
        email &&
        email.includes("@") &&
        password &&
        password.trim().length >= 8
    )
}

function userDetailsAreValid(email,password,name,lastName,street,postalCode,city) {
    return (
        userCredentialsAreValid(email, password) &&
        !isEmpty(name) &&
        !isEmpty(lastName) &&
        !isEmpty(street) &&
        !isEmpty(postalCode) &&
        !isEmpty(city)
    )
}

module.exports = userDetailsAreValid