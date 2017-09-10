// server.js : where your node app starts
// https://newton.ai/
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

// GET API for Mobile App
// Examples: /keywords?filter=engineer | /keyword?filter=analyst
// It calls https://mckesson.taleo.net/careersection/rest/suggestions/text?suggestId=1&careerPortalNo=101430233&language=en&term=
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

// GET/POST API for Zott Bot (http://zo.tt)
// Examples: /keywords?filter=engineer | /keyword?filter=analyst
// It calls https://mckesson.taleo.net/careersection/rest/suggestions/text?suggestId=1&careerPortalNo=101430233&language=en&term=
app.get("/keywordsbot", function (request, response) {GetKeywordsBot(request,response)});

app.post("/keywordsbot", function (request, response) {GetKeywordsBot(request,response)});
  
function GetKeywordsBot(request,response){
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
			var zottjson = _.object(['k1','k2','k3','k4','k5'],JSON.parse(str));
			response.send(zottjson);
			console.log(zottjson);
		});
		mckRes.on('error', function (err) {
			response.send(err);
			console.log('mck Error:::',err);
		});
	});
	mckReq.end();
}

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

app.get("/jobsbot", function (request, response) { GetJobs(request,response); });

app.post("/jobsbot", function (request, response) { GetJobs(request,response); });

function GetJobs(request,response){
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

			//Extract first 5 jobs asa new JSON object - j1 to j5
			var obj = {}
      obj = _.object(['j1','j2','j3','j4','j5'],shortlist);  

			//XLapp JSON_NVP understands only Flat JSON, so flatten the result by appending _
			obj = flatten(obj,{});
					
			//McKesson WS returns location values as "location": "[\"United States\"]"
			//The " and [ cause security loopholes in Zott Bot server - so these are to be removed
			//Remove the pattern [\" and \"] using regex
			var str = JSON.stringify(obj);
			str = str.replace(/\[\\\"/gm,'');
			str = str.replace(/\\\"\]/gm,'');
 			str = str.replace(/\//gm,' ');
 			str = str.replace(/\\/gm,' ');

      obj = JSON.parse(str);

      console.log(obj);
			response.send(obj);
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
}

//Function to flatten a JSON nested object
//ref: https://stackoverflow.com/questions/19628912/flattening-nested-arrays-objects-in-underscore-js
function flatten(x, result, prefix) {
    if(_.isObject(x)) {
        _.each(x, function(v, k) {
            flatten(v, result, prefix ? prefix + '_' + k : k)
        })
    } else {
        result[prefix] = x
    }
    return result
}

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

var port = process.env.PORT | 3000;

// listen for requests :)
var listener = app.listen(port, function () {
  console.log('Your app is listening on port ', listener.address().port);
});

