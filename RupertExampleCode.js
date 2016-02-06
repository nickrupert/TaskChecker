//These solutions make use of jQuery's $.getJSON() function to read in the JSON data. 
//Functions output the requisite data to the console.
(function ( $ ){
    $.Parser = {

      openedInRange: 0,
      closedInRange: 0,
      mostRecent: "",
      currentDate: "",
      assigneeClosed: 0,
      assigneeOpened: 0,
      count: 0,
      closedCount: 0,
      openCount: 0,  

      currentOpenAndClosed : function(json, currDate) {
        var a = $.getJSON( json ).done ( function(data) {
          var inputDate = new Date(currDate);

          //This loops through each task, checking its "createDate" and 
          //"closeDate" values against the input date. 
          for(k = 0; k < a.responseJSON.length; k++) {
            var createdOn = new Date(a.responseJSON[k].createDate);
            if(inputDate >= createdOn) {
              var closedOn = new Date(a.responseJSON[k].closeDate)
              //This assumes that tasks will have status of either "Received,"
              //or "Closed," and that tasks not closed are still open.
              if(a.responseJSON[k].status != "Closed") {
                $.Parser.openCount = $.Parser.openCount + 1;
                //Inclusivity comes in here. My interpretation of the prompt is
                //that a task should count as still opened at a given moment in 
                //time if it is being closed at that same instant. I take it
                //that a task cannot be both opened and closed, so the final
                //else-statement captures any items that whose close dates
                //actually precede the input date. 
              } else if(inputDate <= closedOn) {
                $.Parser.openCount = $.Parser.openCount + 1;
              } else {
                $.Parser.closedCount = $.Parser.closedCount + 1;
              }
            }
          }
          //A function here, inside of the Ajax:success call, can access the 
          //count data.
          $("#numOpen").append($.Parser.openCount);
          $("#numClosed").append($.Parser.closedCount);
          document.getElementById("frm1").frm1Button.disabled = true;
        });
      },


      /* This function takes two dates as input, and it returns the number of 
         tasks opened and closed within that range. The start date is 
         inclusive, the end date exclusive. This function requires the date to
         be in the JavaScript Date Reference format of "2014-11-24T05:00:52Z"*/ 
      openedClosedWithinRange : function(json, startDate, endDate) {
        var a = $.getJSON( json ).done(function(data) {
          var startDateIn = new Date(startDate);
          var endDateIn = new Date(endDate);

          for(l = 0; l < a.responseJSON.length; l++) {
            var createdOn = new Date(a.responseJSON[l].createDate);
            var closedOn = new Date(a.responseJSON[l].closeDate);
            if(createdOn >= startDateIn && createdOn < endDateIn) {
              $.Parser.openedInRange = $.Parser.openedInRange + 1;
            }
            if(closedOn >= startDateIn && closedOn < endDateIn) {
              $.Parser.closedInRange = $.Parser.closedInRange + 1;
            }
          }
          $("#numOpenInRange").append($.Parser.openedInRange);
          document.getElementById("frm2").frm2Button.disabled = true;          

        });
      },


      /* Given a particular instanceId, This function provides the name of 
         the most recently created task.                                  */
      mostRecentTask : function(json, instId) {
        var a = $.getJSON(json).done(function(data) {
          var currentDate = "";

          for(m = 0; m < a.responseJSON.length; m++) {
            if(instId == a.responseJSON[m].instanceId) {
              var date = new Date(a.responseJSON[m].createDate);
              if(currentDate == "" || date > currentDate) {
                currentDate = date;
                mostRecent = a.responseJSON[m].name;
              }
            }
          }
          $("#mostRecent").append(mostRecent);
          document.getElementById("frm3").frm3Button.disabled = true;

        });
      },


      /* This function takes in a JSON object and a instanceId, and provides 
         the count of the tasks associated with that ID.                   */
      tasksCount : function(json, id) {
        var a = $.getJSON(json).done(function(data) {
          //calculates the number of tasks associated with a specific instanceId
          for(i = 0; i < a.responseJSON.length; i++) {
            if(id == a.responseJSON[i].instanceId) {
              $.Parser.count = $.Parser.count + 1;
            }
          }
          $("#CountOfTasks").append($.Parser.count);
          document.getElementById("frm4").frm4Button.disabled = true;                    
        });
      },


      /* Given a particular assignee, this function provides the number of 
      open and closed tasks for that assignee                             */
      assigneeOpenAndClosed : function(json, assignee) {
        var a = $.getJSON(json).done(function(data) {

          for(n = 0; n < a.responseJSON.length; n++) {
            if(a.responseJSON[n].assignee == assignee) {
              if(a.responseJSON[n].status == "Closed") {
                $.Parser.assigneeClosed = $.Parser.assigneeClosed + 1;
              } else {
                $.Parser.assigneeOpened = $.Parser.assigneeOpened + 1;
              }
            }
          }
          $("#OpenforAssignee").append($.Parser.assigneeOpened);
          $("#ClosedforAssignee").append($.Parser.assigneeClosed);
          document.getElementById("frm5").frm5Button.disabled = true;

        });
      }
    }
})( jQuery );




