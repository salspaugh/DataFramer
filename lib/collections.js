Datasets = new Mongo.Collection('datasets');
Columns = new Mongo.Collection('columns');

if (Meteor.isServer){
    Meteor.publish("datasets", function(id){
        if (id) return Datasets.find(id);
        return Datasets.find();
    });

    Meteor.publish("columns", function(d_id){
        return Columns.find({dataset_id: d_id});
    });
}
