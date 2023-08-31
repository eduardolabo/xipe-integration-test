db.users.drop();
db.users.insertOne({
  _id: ObjectId("612798d10a9d573d23a0688d"),
  username: "xipeadmin",
  password: "$2a$10$hva8N4SPOfEjKIz35rneK.pVnVVZ7yxLZSXRr6fQCku26wHbY8Hi6",
  permissions: [
    "user:read",
    "user:create",
    "user:write",
    "user:delete",
    "pokemon:read",
    "pokemon:create",
    "pokemon:write",
    "pokemon:delete",
  ],
});

//Password: CarreraAdmin
