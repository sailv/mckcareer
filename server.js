// server.js : where your node app starts

// init project
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var https = require('https');
var _ = require('underscore');

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies for POST requests
app.use(bodyParser.json()); // support json encoded bodies for POST requests

app.get("/", function (request, response) {
  //response.sendFile(__dirname + '/views/index.html');
  response.sendStatus(200);
});

//McKesson Web Services (test)
// Examples: /keywords?filter=engineer | /keyword?filter=analyst
app.get("/keywords", function (request, response) {
	/*//Test data
	var test=['engineering','engineer','engineers','engine','engines','engineered'];
	response.send(test);
	return;*/
	// // // //
	var options = {
	  host: 'mckesson.taleo.net', 
	  path: '/careersection/rest/suggestions/text?suggestId=1&careerPortalNo=101430233&language=en&term='+ request.query.filter,
	  method: 'GET',
	  //headers: {'custom': 'Custom Header Demo works'}
	};
	//Request sent to McKesson Server to et Keywords for auto-complete	
	var mckReq = https.request(options, function(mckRes){
		var str = '';
		mckRes.on('data', function (chunk) {
			str += chunk;
		});
		mckRes.on('end', function () {
			response.send(str);
			console.log(str);
		});
		mckRes.on('error', function (err) {
			response.send(err);
			console.log('mck Error:::',err);
		});
	});
	mckReq.end();
});

// Examples: /jobs?filter=engineer | /jobs?filter=analyst
app.get("/jobs", function (request, response) {
	// create the JSON object for the Post Body	
	var template =  require('./config/template1.json'); //read template request body from JSON config file
	template.fieldData.fields.KEYWORD = request.query.filter; //Update the template with the keyword from the incoming request
	var mckPostData = JSON.stringify(template); //The actual Request Body to be sent to MCK
	
	//Assemble the MCK request 'Options' object to pass to the HTTPS POST Request
	var mckReqOptions = {
	  host: 'mckesson.taleo.net', 
	  path: '/careersection/rest/jobboard/searchjobs?lang=en&portal=101430233',
	  method: 'POST',
	  json : true,
      headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(mckPostData)		  
      },
	  body : {}
	};
	
	//Create the POST request (this is an Asynchronous call)
	//i.e. this function would be called back by Nodejs server whenever it receives a response packet/error for this request
	var mckReq = https.request(mckReqOptions, function(mckRes){
		var allchunks ='';
		mckRes.on('data', function (chunk) {
			allchunks += chunk;
		});
		mckRes.on('end', function () {
			var shortlist = extractJobs(JSON.parse(allchunks));
			response.send(shortlist);
		});
		mckRes.on('error', function (err) {
			response.send(err);
			console.log('mck Error:::',err);
		});
		
	});
	mckReq.on('error', function(e) { console.error(e); });
	
	// Finally POST the data and end the request!
	mckReq.write(mckPostData);
	mckReq.end();
});

function extractJobs(allchunks){
	var shortlist=[];
	var row ={};
	_.each(allchunks.requisitionList, function(job) {
		row['jobid'] = job.jobId;
		row['role'] = job.column[0];
		row['location'] = job.column[1];
		row['date'] = job.column[2];
		row={};
		shortlist.push(row);
	});
	return shortlist;
}

// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ', listener.address().port);
});

