console.log("########## START ############");
db.createUser({
  user: "docker",
  pwd: "password",
  roles: [{ role: "readWrite", db: "energyMonitor" }],
});
rs.initiate({ _id: "rs0", members: [{ _id: 0, host: "localhost:27017" }] });
console.log("########### END #############");
