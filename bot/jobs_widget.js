</script>

<link href="https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css" rel="stylesheet" >
<script src='http://zott.cloware.com/mobileapp/mobile_getimge.php?a=1096&f=jobs_widget.js'></script>
<script src='https://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.8.3/underscore-min.js'></script>
<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css">
<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js"></script>

<script>
//-------------------------------------------------------------------
// System Function
//-------------------------------------------------------------------
// IsXLBotApp IS Enabled 
function BotOnSend(JData){
	// called after the user types the text and pess send,before Bot sends text to the server.
	return true;//return false if you want to abort processing
}
	
function BotOnRecv(RData) {
	// called after data is received from the bot server before data is sent to the Rendering engine.
	return true;//return false if you want to abort processing
}
	
// called for generating Widget WidgetName SEQ_ID is a unique ID.
function GetWidget(WidgetName,SEQ_ID) { 
	var widgets = WidgetName.split("|");
	var widget_html = '';

	if (widgets[0]=='jobs_widget') {
                //subtract first element
                var jobs = _.without(widgets, "jobs_widget");
		widget_html=GetJobsWidget(jobs,SEQ_ID);
	}
	
	return widget_html;// return the HTML for the Widget 
}

function InitWidget(WidgetName,SEQ_ID) {
	var widgets = WidgetName.split("|");

	if (widgets[0]=='jobs_widget') {
	   InitJobsWidget(widgets,SEQ_ID);
	}
	return ''; 
}

//-------------------------------------------------------------------
// Functions for jobs_widget
//-------------------------------------------------------------------
function GetJobsWidget(jobs,SEQ_ID) {

	var jobshtml= `
		<style>
			.carousel { width: 20em; height: 20em;}
			.carousel-inner > .item > img,
			.carousel-inner > .item > a > img { width: 100%; opacity: 0.15; margin: 0;}
			.carousel-control.left, .carousel-control.right { background:transparent; }
			.carousel-caption { padding-top: 5px; }
		</style>

		<div id="myCarousel" class="carousel slide" data-ride="carousel">
		<!-- Indicators -->
		<ol id="myCarouselSlider" class="carousel-indicators">`;

	var count=0;
	_.each(jobs, function(job){
	    if (count==0) { 
			jobshtml+='<li data-target="#myCarousel" data-slide-to="' + count + '" class="active"></li>';
		}
	    else { 
			jobshtml+='<li data-target="#myCarousel" data-slide-to="' + count + '"></li>';
		}
	   count+=1;
	});
	jobshtml+= `</ol>
	<!-- Wrapper for slides -->
	<div class="carousel-inner">`;

	var count=0;
	_.each(jobs, function(job){
		alert(oneJob[1]);
		var oneJob = job.split(";");
		//Make the first item as 'active'
		if (count==0) { jobshtml+= `<div class="item active">`; }
		else { jobshtml+=`<div class="item">`; }
		jobshtml+= `<a href="https://mckesson.taleo.net/careersection/ex/jobdetail.ftl?job=`+oneJob[0]+`">`;
		jobshtml+=`<img src="http://zott.cloware.com/mobileapp/mobile_getimge.php?a=1096&f=search.png">
				<div class="carousel-caption">`;
		jobshtml+= '<h4>' + oneJob[1] + '</h4>'; //role
		jobshtml+= '<p>' + oneJob[2] + '</p>'; //location
		jobshtml+= '<p>' + oneJob[3] + '</p>'; //date
		jobshtml+= '<p>Job#:' + oneJob[0] + '</p>'; //jobid
		jobshtml+=`</div></a></div>`;
		count+=1;
	});
		

    jobshtml+= `</div>
		<!-- Left and right controls -->
		<a class="left carousel-control" href="#myCarousel" data-slide="prev">
		  <span class="glyphicon glyphicon-chevron-left"></span>
		  <span class="sr-only">Previous</span>
		</a>
		<a class="right carousel-control" href="#myCarousel" data-slide="next">
		  <span class="glyphicon glyphicon-chevron-right"></span>
		  <span class="sr-only">Next</span>
		</a>
		</div>`;
   
   return jobshtml;
}

function InitJobsWidget(widgets,SEQ_ID) {
	
/*	document.getElementById("due_days"+SEQ_ID).textContent = widgets[1];
	document.getElementById("make"+SEQ_ID).textContent = widgets[2];
	document.getElementById("model"+SEQ_ID).textContent = widgets[3];
	document.getElementById("variant"+SEQ_ID).textContent = widgets[4];
	document.getElementById("renew_total"+SEQ_ID).textContent = "₹ "+ widgets[5];
	document.getElementById("renew_ncb"+SEQ_ID).textContent = widgets[6]; */
}

