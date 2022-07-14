const fs = require("fs");

const data = {
  title: "sample customer json file",
  customers: [],
};

for (i = 1; i <= 10000; i++) {
  const obj = {
    pk: { S: `sample${i}@gmail.com` },
    name: { S: `name_${i}` },
    id: { S: i.toString() },
    designation: { S: `desig_${i}` },
    dob: { S: new Date().toString() },
    hobbies: { S: JSON.stringify([`hobby${i}`, `hobby${i + 1}`]) },
    address: {
      S: JSON.stringify({
        street: `${i} street`,
        pincode: `${i}`,
      }),
    },
    notes: { S: JSON.stringify([`note${i}`, `note${i + 1}`]) },
  };
  data.customers.push(obj);
}
fs.writeFile("customer.json", JSON.stringify(data), function (err) {
  if (err) throw err;
  console.log("complete");
});
