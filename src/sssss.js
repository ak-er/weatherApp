const express = require('express');
const app =express();
const hbs = require('hbs');
const path = require('path');
const https = require('https');
const serverless = require('serverless-http');

app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
    let loct = req.query.location;
    if(!loct){
        loct = "Uttar Pradesh"
    }
    let err = false;
    https.get(`https://api.openweathermap.org/data/2.5/weather?q=${loct}&appid=5aa85fec617bf9c0e7d205e2dee168b4`, (resp) => {
        let body = "";
        try{
            resp.on("data", (chunk) => { 
                body += chunk;
            })
            resp.on("end", () => {
                let api_data = JSON.parse(body);
                if(api_data.cod == 404){
                    res.render("index", {location: loct, weather: "oops", loct: "Location is not found.", err: true})
                }else{
                    res.render("index", {data: api_data, weather: api_data.weather[0].main, temperature: parseInt(api_data.main.temp - 273.15), location: loct, speed: api_data.wind.speed, humidity: api_data.main.humidity, pressure: api_data.main.pressure, min_temp: parseInt(api_data.main.temp_min - 273.15), max_temp: parseInt(api_data.main.temp_max - 273.15)});
                }
            })
        }catch(err){
            console.log(err);
        }
    })
})
app.listen(3011, () => {
    console.log("Server has been started at 3011...");
})

module.exports.handler = serverless(app);