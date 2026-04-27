/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("admin_users");
  const adminRule = "@request.auth.collectionName = 'admin_users' && @request.auth.role = 'admin'";

  collection.listRule = adminRule;
  collection.viewRule = adminRule;
  collection.createRule = adminRule;
  collection.updateRule = adminRule;
  collection.deleteRule = `${adminRule} && id != @request.auth.id`;
  collection.manageRule = adminRule;
  app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("admin_users");
  const previousRule = "@request.auth.collectionName = 'admin_users'";

  collection.listRule = previousRule;
  collection.viewRule = previousRule;
  collection.createRule = previousRule;
  collection.updateRule = previousRule;
  collection.deleteRule = previousRule;
  collection.manageRule = previousRule;
  app.save(collection);
});
