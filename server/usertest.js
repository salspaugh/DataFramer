Meteor.startup(function(){
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
            Meteor.users.remove({username: {$ne: "admin"}});

            // make new ones
            var users = EJSON.parse(Assets.getText('super_secret_passwords.json'));
            _.each(users, function(user){
                Accounts.createUser(user);
                // add datasets to user's account
                var dataLoaded = Meteor.call('setupTestData', user.username);
                if (dataLoaded == "complete") {
                    console.log(user.username + ": test data load initiated");
                } else {
                    console.log(user.username + ": error with test data setup");
                }
            })
        }
    }
});


function randomString(length, chars) {
    var result = '';
    for (var i = length; i > 0; --i) result += chars[Math.round(Math.random() * (chars.length - 1))];
    return result;
}
