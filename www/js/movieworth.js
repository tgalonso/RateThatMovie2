/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
 
 
var mainMovieWorth = {

    // Application Constructor
    	initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicity call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        mainMovieWorth.receivedEvent('deviceready');
        console.log("HERE onDeviceReady BEING EXECUTED!!!");
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        console.log('doing jQuery loading');
        $("document").ready(function(){console.log("the page just loaded! and loaded again");});
        console.log('Received Event Michelle: ' + id);
		this.movieworthReadData();
    },
	
	movieworthReadData: function()
	{
		// Create a connection to the file.
  		var Connect;
		Connect = new XMLHttpRequest();
  		console.log("XMLHttpRequest object created");
		
		// Define which file to open and
  		// send the request.
  		Connect.open("GET", "http://visitcon.s3-website-us-east-1.amazonaws.com/Customers.xml", false);
  		console.log("tried to open file Connect contains=" + Connect);
  		Connect.setRequestHeader("Content-Type", "text/xml");
  		Connect.send(null);
		// Place the response in an XML document.
		
		TheDocument=Connect.responseXML;
		
		stat = Connect.statusText;
		console.log("Status = " + stat);
		console.log("start");
		console.log("MovieWorth: name = " + TheDocument.getElementsByTagName("name")[0].childNodes[0].nodeValue)
		console.log("MovieWorth: age = " + TheDocument.getElementsByTagName("age")[0].childNodes[0].nodeValue)
		console.log("MovieWorth: color = " + TheDocument.getElementsByTagName("color")[0].childNodes[0].nodeValue);
            //$(function() {
        
        $(document).ready(function(){
                          console.log("ready");
                   });
       
               
    }
    
};


 
  
  
   