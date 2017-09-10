</script>
<link rel="stylesheet" href="http://zott.cloware.com/voiceui/bootstrap/css/bootstrap.min.css">
<link href="https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css" rel="stylesheet" >
<script src='/mobileapp/mobile_getimge.php?a=1101&f=jobs_widget.js'></script>

<script>

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
		widget_html=GetJobsWidget(widgets,SEQ_ID);
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
