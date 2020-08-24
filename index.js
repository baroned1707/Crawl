const express = require('express');
const {Builder, By, Key, until} = require('selenium-webdriver');
const { getDefaultService } = require('selenium-webdriver/chrome');
var result = [];

var query = 'https://www.youtube.com/results?search_query=';

var driver ;
const app = express();
app.use(express.json());
var server = require('http').createServer(app);
server.listen(3000);

async function example(key) {
  var url = query + key;
  driver = new Builder().forBrowser('firefox').build();
  await driver.manage().window().maximize();
  await driver.get(url);
  await driver.findElements(By.className('yt-simple-endpoint inline-block style-scope ytd-thumbnail'))
    .then(async res=>{
      await res.forEach(async current=>{
        await current.getAttribute('href').then(async text=>{
          if(text!=null){
            await result.push(text.slice(text.indexOf('=')+1,text.indexOf('&')===-1?text.length:text.indexOf('&')+1));
          } 
        })
      })
    });
}

app.post('/crawlvideoIDs',(req,res)=>{
  console.log('Run Crawl !');
  example(req.body.keywork);
  var timing = setInterval(()=>{
    if(result.length>=3){
      console.log(result);
      res.status(400).json({
        success:true,
        data:result
      })
      result = [];
      driver.quit();
      clearInterval(timing);
    }
  },1000)
})





