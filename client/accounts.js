Accounts.config({
    // set true for live testing so people can't create new accounts
    // and upload a bunch of shit
    forbidClientAccountCreation: true
});

Accounts.ui.config({
    passwordSignupFields: 'USERNAME_ONLY',
});
