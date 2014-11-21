CSVs = new FS.Collection("csv", {
  stores: [new FS.Store.GridFS("csv")]
});

Datasets = new Mongo.Collection('datasets');
