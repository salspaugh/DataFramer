Datasets = new Mongo.Collection('datasets');
Columns = new Mongo.Collection('columns');
Questions = new Mongo.Collection('questions');

if (Meteor.isServer){
    Meteor.publish("datasets", function(id){
        if (id) return Datasets.find(id);
        // if no specific one, return all
        return Datasets.find();
    });

    Meteor.publish("columns", function(d_id){
        return Columns.find({dataset_id: d_id});
    });

    Meteor.publish('questions', function(d_id, q_id){
        if (q_id) return Questions.find({_id: q_id})
        return Questions.find({dataset_id: d_id})
    });

    Questions.allow({
        // TODO: add some kind of authentication here
        insert: function(){
            return true;
        },
        update: function(){
            return true;
        },
        remove: function(){
            return true;
        }
    });
    
}
