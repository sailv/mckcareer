// client-side js
var joblisttemplate = "<a href='###' class='list-group-item'> \
      <div class='row'> \
	    <div class='col-xs-8 text-uppercase'>$VAL1</div> \
		<div class='col-xs-4 small text-right'>$VAL2</div> \
	  </div> \
      <div class='row'> \
	    <div class='col-xs-4 small text-left'>$VAL3</div> \
		<div class='col-xs-8 small text-right'>$VAL4</div> \
	  </div> \
    </a>";

$(function() {
	/*
	//https://github.com/devbridge/jQuery-Autocomplete 
	//lightweight plugin for only autocomplete -- not working - to troubleshoot
	$('#keyword').autocomplete({
		serviceUrl: '/keywords',
		paramName: 'filter',
		type: 'GET',
		success: function(data, status, jqXHR){
			console.log(data);
		}
	}); */


	$('#keyword').autocomplete({
		source: function (request, response) {
			$.getJSON("http://localhost:90/keywords?filter=" + request.term, function (data) {
				response(data);
			});
		},
		minLength: 2
	});
});
	
function GetMatchingJobs(){
    document.getElementById('joblist').innerHTML = "Searching, Please wait...";
	var url= "http://localhost:90/jobs?filter=" + document.getElementById("keyword").value;
	$.getJSON(url, function (data, status) {
		var joblink="https://mckesson.taleo.net/careersection/ex/jobdetail.ftl?job="
        document.getElementById('joblist').innerHTML = "";
		_.each(data, function(job) {
			var tempstr = joblisttemplate;
			tempstr = tempstr.replace('$VAL1', job.role);
			tempstr = tempstr.replace('$VAL2', job.date);
			tempstr = tempstr.replace('$VAL3', job.jobid);
			tempstr = tempstr.replace('$VAL4', job.location);
			tempstr = tempstr.replace('###', joblink+job.jobid);
			document.getElementById('joblist').innerHTML += tempstr;
		})	;
	});
}
	
