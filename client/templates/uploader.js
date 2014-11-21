Template.upload.events({
    'change .csv-upload': function(event, template) {
        FS.Utility.eachFile(event, function(file) {
            CSVs.insert(file, function (err, result) {
                if (err == undefined) {
                    // do interface stuff

                } else {
                    console.log('upload error');
                }
            });
        });
    }
});
