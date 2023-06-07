const express = require("express");
const request = require("request");
const https = require("node:https");
const bodyParser = require("body-parser");

const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", (req, res) => {
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const email = req.body.email;

  const data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName,
        },
      },
    ],
  };

  const jsonData = JSON.stringify(data);

  const url = "https://us17.api.mailchimp.com/3.0/lists/ff371091a3";

  const option = {
    method: "POST",
    auth: "argumpamungkas:962dc665c7ff4356f9a9bf44c18d8735-us17",
  };

  const request = https.request(url, option, (response) => {
    if (response.statusCode === 200) {
      res.sendFile(__dirname + "/success.html");
    } else {
      res.sendFile(__dirname + "/failure.html");
    }

    response.on("data", (data) => {
      console.log(JSON.parse(data));
    });
  });

  request.write(jsonData);
  request.end();
});

app.post("/failure", (req, res) => {
  res.redirect("/");
});

app.listen(process.env.PORT || 3000, () => {
  console.log("server is running on port 3000");
});

// API KEY
// 962dc665c7ff4356f9a9bf44c18d8735-us17

// List ID
// ff371091a3
