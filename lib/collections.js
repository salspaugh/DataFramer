Datasets = new Mongo.Collection('datasets');
Columns = new Mongo.Collection('columns');
Questions = new Mongo.Collection('questions');

if (Meteor.isServer){
    Meteor.publish("datasets", function(id){
        if (id) return Datasets.find({_id: id, user_id: this.userId});
        // if no specific one, return all
        return Datasets.find({user_id: this.userId});
    });

    Meteor.publish("columns", function(d_id){
        return Columns.find({dataset_id: d_id, user_id: this.userId});
    });

    Meteor.publish('questions', function(d_id, q_id){
        if (q_id) return Questions.find({_id: q_id, user_id: this.userId})
        return Questions.find({dataset_id: d_id, user_id: this.userId})
    });

    Questions.allow({
        // TODO: add some kind of authentication here
        insert: function(userId, doc){
            return (userId && doc.user_id === userId);
        },
        update: function(userId, doc){
            return (userId && doc.user_id === userId);
        },
        remove: function(userId, doc){
            return (userId && doc.user_id === userId);
        }
    });

    Columns.allow({
        update: function(userId, doc){
            return (userId && doc.user_id === userId);
        }
    });

    Meteor.methods({
        removeDataset: function(d_id){
            // delete all Collection documents associated with this dataset
            Datasets.remove(d_id);
            Columns.remove({dataset_id: d_id});
            Questions.remove({dataset_id: d_id});
            return "done";
        },
        addQuestion: function(obj){
            // angular-meteor needs this for cleaner UI behavior on inserts
            Questions.insert(obj);
        }
    });

}
