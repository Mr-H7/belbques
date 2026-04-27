/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
    let collection = new Collection({
        type: "auth",
        name: "admin_users",
        listRule: "@request.auth.collectionName = 'admin_users'",
        viewRule: "@request.auth.collectionName = 'admin_users'",
        createRule: null,
        updateRule: "@request.auth.collectionName = 'admin_users'",
        deleteRule: "@request.auth.collectionName = 'admin_users'",
        manageRule: "@request.auth.collectionName = 'admin_users'",
        authRule: "",
        fields: [
        {
                "hidden": false,
                "id": "select0553501263",
                "name": "role",
                "presentable": false,
                "primaryKey": false,
                "required": true,
                "system": false,
                "type": "select",
                "maxSelect": 1,
                "values": [
                        "admin",
                        "viewer"
                ]
        },
        {
                "hidden": false,
                "id": "date9536539586",
                "name": "lastLogin",
                "presentable": false,
                "primaryKey": false,
                "required": false,
                "system": false,
                "type": "date",
                "max": "",
                "min": ""
        }
],
        authAlert: { enabled: false },
    })

    try {
        app.save(collection)
    } catch (e) {
        if (e.message.includes("Collection name must be unique")) {
            console.log("Collection already exists, skipping")
            return
        }
        throw e
    }
}, (app) => {
    try {
        let collection = app.findCollectionByNameOrId("admin_users")
        app.delete(collection)
    } catch (e) {
        if (e.message.includes("no rows in result set")) {
            console.log("Collection not found, skipping revert");
            return;
        }
        throw e;
    }
})
