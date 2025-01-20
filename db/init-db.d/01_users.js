db.users.drop();
db.users.insertOne({
  _id: ObjectId("612798d10a9d573d23a0688d"),
  username: "xipeadmin",
  password: "$2a$10$J9StBIWgHQ4VRbrwloS6R.gXpQ8vZ83usc10tQm2e20S1l3wuJYTm",
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

//Password: P4ssword
