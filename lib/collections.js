CSVs = new FS.Collection("csv", {
  stores: [new FS.Store.FileSystem("csv")]
});

Datasets = new Mongo.Collection('datasets');
