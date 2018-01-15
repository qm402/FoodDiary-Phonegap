var app = {
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
    onBodyLoad();
  },
};


// global variables
var db;
var shortName = 'Dietary';
var version = '1.0';
var displayName = 'Dietary';
var maxSize = 65535;

// this is called when an error happens in a transaction
function errorHandler(transaction, error) {
  alert('Error: ' + error.message + ' code: ' + error.code);
}

// this is called when a successful transaction happens
function successCallBack() {
  alert("DEBUGGING: success");
}

function nullHandler() {

}

// called when the application loads
function onBodyLoad() {
  // This alert is used to make sure the application is loaded correctly
  // you can comment this out once you have the application working
  alert("DEBUGGING: we are in the onBodyLoad() function");

  if (!window.openDatabase) {
    // not all mobile devices support databases  if it does not, the following alert will display
    // indicating the device will not be albe to run this application
    alert('Databases are not supported in this browser.');
    return;
  }

  // this line tries to open the database base locally on the device
  // if it does not exist, it will create it and return a database object stored in variable db
  db = openDatabase(shortName, version, displayName,maxSize);

  // this line will try to create the table Food in the database just created/openned
  db.transaction(function(tx){

  // Deleting food table
  // tx.executeSql( 'DROP TABLE Food',nullHandler,nullHandler);

// Creating food table
  tx.executeSql( 'CREATE TABLE IF NOT EXISTS Food(FoodId INTEGER NOT NULL PRIMARY KEY, FoodName TEXT NOT NULL, FoodGroup TEXT NOT NULL, MealType TEXT NOT NULL , Date TEXT NOT NULL , Time TEXT NOT NULL , Name TEXT NOT NULL,  Calories TEXT NOT NULL, Notes TEXT NOT NULL, Location TEXT NOT NULL )',
    [], nullHandler, errorHandler);
    }, errorHandler, successCallBack);

   ListDBValues();
   ListSearchValues();
}

function clearAddForm()
{
    $("#txLocation").val('')

}

// Reset fields when this function is called
function resetForm()
{
    $("#txLocation").val('')
    $("#txFoodName").val('')
    $("#txDate").val('')
    $("#txTime").val('')
    $("#txNotes").val('')
    $("#txName").val('')
    $("#txCal").val('')

}

// Listing food values of the search page
function ListSearchValues() {
  if (!window.openDatabase) {
    alert('Databases are not supported in this browser.');
    return;
  }


  $('#lbFoodSearch').html('');
  $('#lbFood').html('');


  // this next section will select all the content from the Food table and then go through it row by row
  // appending the food name and  date  #lbFood element on the page
  db.transaction(function(transaction) {
    transaction.executeSql('SELECT * FROM Food ORDER BY FoodName ASC;', [],
    function(transaction, result) {
      if (result !== null && result.rows !== null) {

        $('#lbFoodSearch').html('');

        // Code adapted from: https://www.w3schools.com/jquerymobile/jquerymobile_filters.asp
         var html = '<ul data-role="listview" data-filter="true" data-input="#myFilter" data-autodividers="true" data-inset="true">';

        for (var i = 0; i < result.rows.length; i++) {
          var row = result.rows.item(i);

          // Printing each data entry. Storing data fields into var/attribute
          html+='<li '+
                    'data-fid="'+row.FoodId+'" '+
                    'data-loc="'+row.Location+'" '+
                    'data-fname="'+row.FoodName+'" '+
                    'data-fgroup="'+row.FoodGroup+'" '+
                    'data-mtype="'+row.MealType+'" '+
                    'data-date="'+row.Date+'" '+
                    'data-time="'+row.Time+'" '+
                    'data-cal="'+row.Calories+'" '+
                    'data-name="'+row.Name+'" '+
                    'data-notes="'+row.Notes+'" '+
                    'onclick=fillForm(this)'+
                    '><a href="#">' + row.FoodName + " " + row.Date +'</a></li>';


        }
           $('#lbSearchFood').html(html+'</ul>');
           $('#lbSearchFood>ul').listview();

      }
    }, errorHandler);
  }, errorHandler, nullHandler);
  return;
}


// list the values in the database to the screen using jquery to update the #lbFood element
function ListDBValues() {
  if (!window.openDatabase) {
    alert('Databases are not supported in this browser.');
    return;
  }


  // this line clears out any content in the #lbFood element on the page so that the next few lines will show updated
  // content and not just keep repeating lines
  $('#lbFood').html('');
  $('#lbFoodSearch').html('');
  //Try now

  // this next section will select all the content from the Food table and then go through it row by row
  // appending the FoodId  FirstName  LastName to the  #lbFood element on the page
  db.transaction(function(transaction) {
    transaction.executeSql('SELECT * FROM Food ORDER BY FoodId DESC;', [],
    function(transaction, result) {
      if (result !== null && result.rows !== null) {

         var html = '<ul data-role="listview">';

        for (var i = 0; i < result.rows.length; i++) {
          var row = result.rows.item(i);

          // Code adapted from: https://www.w3schools.com/jquerymobile/jquerymobile_filters.asp
          // Printing each data entry. Storing data fields into var/attribute
          html+='<li '+
                    'data-fid="'+row.FoodId+'" '+
                    'data-loc="'+row.Location+'" '+
                    'data-fname="'+row.FoodName+'" '+
                    'data-fgroup="'+row.FoodGroup+'" '+
                    'data-mtype="'+row.MealType+'" '+
                    'data-date="'+row.Date+'" '+
                    'data-time="'+row.Time+'" '+
                    'data-cal="'+row.Calories+'" '+
                    'data-name="'+row.Name+'" '+
                    'data-notes="'+row.Notes+'" '+
                    'onclick=fillForm(this)'+
                    '><a href="#">' + row.FoodName + " " + row.Date +'</a></li>';


        }
           $('#lbFood').append(html+'</ul>');
           $('#lbFood>ul').listview();

      }
    }, errorHandler);
  }, errorHandler, nullHandler);
  return;
}



var edit_row_id = 0;

// Once user selects the food entry, it will display the fields entered into the form.
// Carries the objects/attributes, and stores into the fields
function fillForm(obj)
{
    edit_row_id = $(obj).attr('data-fid');
    $("#txLocationu").val($(obj).attr('data-loc'));
    $("#txFoodNameu").val($(obj).attr('data-fname'));
    $("#txFoodGroupu").val($(obj).attr('data-fgroup'));
    $("#txMealTypeu").val($(obj).attr('data-mtype'));
    $("#txDateu").val($(obj).attr('data-date'));
    $("#txTimeu").val($(obj).attr('data-time'));
    $("#txCalu").val($(obj).attr('data-cal'));
    $("#txNameu").val($(obj).attr('data-name'));
    $("#txNotesu").val($(obj).attr('data-notes'));

    // Change to update page when user clicks on one of the data entry.
    $.mobile.changePage("#pageupdate");
}

// Updating the values of the food that has been selected by the user

function UpdateValueToDB() {

  if (!window.openDatabase) {
    alert('Databases are not supported in this browser.');
    return;
  }

  // Updating the food entry
  db.transaction(function(transaction) {
    transaction.executeSql('UPDATE Food SET FoodName=?, FoodGroup=?, MealType=?, Date=?, Time=?, Notes=?, Name=?, Calories=?  WHERE FoodId=?',[$('#txFoodNameu').val(), $('#txFoodGroupu').val(), $('#txMealTypeu').val(), $('#txDateu').val() , $('#txTimeu').val(), $('#txNotesu').val(), $('#txNameu').val() , $('#txCalu').val() , edit_row_id],
      nullHandler, errorHandler);
    edit_row_id = 0;
  });


  var submit = confirm("Are you sure you want to update?");

  if (submit == true) {

   // Refreshing/Listing the values of the food entry
    ListDBValues();
     ListSearchValues();

     // Redirecting user to view page
    $.mobile.changePage("#pageview");

    return false;


  } else
  {
    return false;

  }


}

// Function to delete the value that has been selected. A HTML button is used to call the function.
function DeleteValue() {

   if (!window.openDatabase) {
     alert('Databases are not supported in this browser.');
     return;
   }

   // Deleting the food, depending on the food id
   db.transaction(function(transaction) {
     transaction.executeSql('DELETE FROM Food WHERE FoodId=?',[ edit_row_id],
       nullHandler, errorHandler);
     edit_row_id = 0;
   });

     var submit = confirm("Are you sure you want to delete?");

     if (submit == true) {
  ListDBValues();
   ListSearchValues();

   $.mobile.changePage("#pageview");

   return false;

     }

     else {

   return false;

     }



 }


// Function to delete all food data entry
 function DeleteAllValue() {

   if (!window.openDatabase) {
     alert('Databases are not supported in this browser.');
     return;
   }

var submit = confirm("Are you sure you want to delete all food entry?");

if (submit == true) {


 // Deleting all data inside the food table
   db.transaction(function(transaction) {
     transaction.executeSql('DELETE FROM Food', [],
       nullHandler, errorHandler);
   });

   ListDBValues();
   ListSearchValues();

   $.mobile.changePage("#pageview");

   return false;

    }

        else {
              return false;

              }



 }

// Adding food values to the database
function AddValueToDB() {
  if (!window.openDatabase) {
    alert('Databases are not supported in this browser.');
    return;
  }


  // Inserting the data into the food table
  db.transaction(function(transaction) {
     transaction.executeSql('INSERT INTO Food(FoodName, FoodGroup, MealType, Date, Time, Name, Notes, Calories , Location) VALUES (?,?,?,?,?,?,?,?,?)',[$('#txFoodName').val(), $('#txFoodGroup').val(), $('#txMealType').val(), $('#txDate').val() , $('#txTime').val(), $('#txName').val(), $('#txNotes').val(),  $('#txCal').val(), $("#txLocation").val()],
      nullHandler, errorHandler);

// Assigning a variable, used to edit the entry
    edit_row_id = 0;
  });


  ListDBValues();
  ListSearchValues();
  $.mobile.changePage("#pageview");

  return false;
}