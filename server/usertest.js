Meteor.startup(function(){
    console.log(Assets.getText('admin_password'));
    if (!Meteor.users.findOne({username: 'admin'})) {
        var userObject = {
            username: "admin",
            password: Assets.getText('admin_password').trim(),
            // NOTE: this is excluded from the git repo,
            // you need to get it from Ian
            profile: {is_admin: true}
        };

        Accounts.createUser(userObject);
    }
});

Meteor.methods({
    setupUsers:function(){
        // admins only
        if (this.userId && Meteor.users.findOne(this.userId).profile.is_admin){
            // clear existing users
            Secrets.remove({});
            Meteor.users.remove({username: {$ne: "admin"}});

            // create new ones and expose their Secrets
            for (var i=1; i<=40; i++){
                var username = "student"+i,
                    password = randomString(8, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ');
                var userObject = {
                    username: username,
                    password: password
                };
                Accounts.createUser(userObject);
                Secrets.insert(userObject);
            }
        }


    }
});


function randomString(length, chars) {
    var result = '';
    for (var i = length; i > 0; --i) result += chars[Math.round(Math.random() * (chars.length - 1))];
    return result;
}
