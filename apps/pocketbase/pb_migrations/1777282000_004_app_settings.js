/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  // app_settings: a singleton config bag readable by anyone (so the public
  // home page can know the survey title + open/closed state) and writable
  // only by admin_users.
  const collection = new Collection({
    type: "base",
    name: "app_settings",
    listRule: "",          // public read
    viewRule: "",          // public read
    createRule: "@request.auth.collectionName = 'admin_users'",
    updateRule: "@request.auth.collectionName = 'admin_users'",
    deleteRule: "@request.auth.collectionName = 'admin_users'",
    fields: [
      {
        id: "text_key",
        name: "key",
        type: "text",
        required: true,
        primaryKey: false,
        system: false,
        max: 64,
        min: 1,
        pattern: "",
      },
      {
        id: "json_value",
        name: "value",
        type: "json",
        required: false,
        maxSize: 0,
      },
      {
        id: "autodate_created",
        name: "created",
        type: "autodate",
        onCreate: true,
        onUpdate: false,
      },
      {
        id: "autodate_updated",
        name: "updated",
        type: "autodate",
        onCreate: true,
        onUpdate: true,
      },
    ],
    indexes: [
      "CREATE UNIQUE INDEX `idx_app_settings_key` ON `app_settings` (`key`)",
    ],
  });

  try {
    app.save(collection);
  } catch (e) {
    if (String(e.message).includes("Collection name must be unique")) {
      console.log("app_settings already exists, skipping");
      return;
    }
    throw e;
  }

  // Seed defaults
  const seed = (key, value) => {
    const rec = new Record(app.findCollectionByNameOrId("app_settings"));
    rec.set("key", key);
    rec.set("value", value);
    try { app.save(rec); } catch (e) {
      if (!String(e.message).includes("Value must be unique")) throw e;
    }
  };
  seed("general", {
    title: "بنها بتقول إيه؟",
    subtitle: "شاركنا رأيك وساعدنا نفهم المدينة أكتر",
  });
  seed("survey_state", {
    open: true,
    closedMessage: "الاستبيان مغلق حالياً",
  });
}, (app) => {
  try {
    const c = app.findCollectionByNameOrId("app_settings");
    app.delete(c);
  } catch (e) {
    if (!String(e.message).includes("no rows in result set")) throw e;
  }
});
