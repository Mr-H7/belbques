/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const adminEmail = $os.getenv("PB_ADMIN_EMAIL");
  const adminPassword = $os.getenv("PB_ADMIN_PASSWORD");

  if (!adminEmail || !adminPassword) {
    console.log("PB_ADMIN_EMAIL / PB_ADMIN_PASSWORD not set, skipping admin_users seed");
    return;
  }

  if (String(adminPassword).length < 12) {
    throw new Error("PB_ADMIN_PASSWORD must be at least 12 characters");
  }

  const collection = app.findCollectionByNameOrId("admin_users");
  const record = new Record(collection);
  record.set("email", adminEmail);
  record.setPassword(adminPassword);
  record.set("role", "admin");
  try {
    return app.save(record);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
      return;
    }
    throw e;
  }
}, (app) => {
  const adminEmail = $os.getenv("PB_ADMIN_EMAIL");
  if (!adminEmail) {
    console.log("PB_ADMIN_EMAIL not set, skipping rollback");
    return;
  }

  try {
    const record = app.findFirstRecordByData("admin_users", "email", adminEmail);
    app.delete(record);
  } catch (e) {
    if (e.message.includes("no rows in result set")) {
      console.log("Auth record not found, skipping rollback");
      return;
    }
    throw e;
  }
})
