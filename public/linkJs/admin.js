//link categories
const CATEGORIES = [
  { name: "Teaching & Learning", color: "#3b82f6" },
  { name: "Course Coordination", color: "#16a34a" },
  { name: "Research", color: "#ef4444" },
  { name: "Course Files", color: "#eab308" },
  { name: "Course Assesment Report", color: "#db2777" },
  /*{ name: "", color: "#14b8a6" },
  { name: "", color: "#f97316" },
  { name: "", color: "#8b5cf6" },*/
];

var messages;

var user = sessionStorage.getItem("email");

listLink(user);

//create list table
function listLink(link_owner) {
  $.ajax({
    type: "GET",
    url: "http://127.0.0.1:3000/readAdminPage",
    data: { link_owner: link_owner },
    success: function (response, status, xhr) {
      let linkData = JSON.parse(response);
      console.log(link_owner);
      console.log(linkData);
      createLinksList(linkData);
    },
    error: function (xhr, status, error) {
      alert("Ajax connection error!");
    },
    async: true,
  });
}

function createLinksList(dataArray) {
  const htmlArr = dataArray.map(
    (link) => ` 
    <tr class="dataa">
    <td>${link.link_name}</td>
    <td>${link.link_description}</td>
    <td>${link.session_sem}</td> 
    <td>
    <a
        class="source"
        href="${link.link_url}"
        target="_blank"
    >(Source)</a>
    </td>
    <td>
    <span class="tag" style="background-color: ${
      CATEGORIES.find((cat) => cat.name === link.link_category).color
    }">${link.link_category}</span>
  </td>
  <td>
      <button id="assignBtn" onclick="assignLink(${
        link.link_id
      })">assign</button>&nbsp;
      <button id="updateBtn" onclick="updateRow(${
        link.link_id
      })">update</button>&nbsp;
      <button id="deleteBtn" onclick="deleteRow(${
        link.link_id
      })">delete</button>
  </td> 
  <td>  
  <button class="popAssignedLect" onclick="viewLect(${
    link.link_id
  })">Click here!</button> 
  </td>
  
  </tr>`
  );
  const html = htmlArr.join("");
  $(".linktable").append(html);
}

//when insert button is click, create link form show
$(".btn-open").click(function () {
  $(this).text(function (i, text) {
    return text === "Close" ? "INSERT A LINK" : "Close";
  });
  $(".link-form-hidden").toggleClass("link-form");
});

//prevent default submit of form // to ensure ajax can run
$("form").submit(function (event) {
  event.preventDefault();
});

//on create link submit
$("#createLink .btn-large").on("click", function () {
  console.log(user);
  $.ajax({
    type: "GET",
    url: "http://127.0.0.1:3000/create",
    data: $("#createLink .link-form").serialize() + "&link_owner=" + user,
    success: function (response, status, xhr) {
      console.log($("#createLink .link-form").serialize());
      console.log(response);
      console.log(user);

      $("#successMessage").html("You have successfully insert a link ...");
      $(".overlay").fadeIn();
      $("#successPopup").fadeIn();

      setTimeout(function () {
        location.reload(true);
      }, 1500);
    },

    error: function (xhr, status, error) {
      alert("Ajax connection error!");
    },

    async: true,
  });
});

//on delete link submit
function deleteRow(linkId) {
  console.log("Delete link with ID:", linkId);
  var link_id = linkId;

  $(".overlay").on("click", function () {
    link_id = "";
  });

  $("#deletePopup .confirm").on("click", function () {
    if (link_id != "") {
      $.ajax({
        type: "GET",
        url: "http://127.0.0.1:3000/delete",
        data: { link_id: link_id },
        success: function (response, status, xhr) {
          $("#successMessage").html(messages);
          $(".overlay").fadeIn();
          $("#successPopup").fadeIn();

          setTimeout(function () {
            location.reload(true);
          }, 1500);
        },
        error: function (xhr, status, error) {
          alert("Ajax connection error!");
        },
        async: true,
      });
    }
  });
}

//update link functionality
function updateRow(linkId) {
  //get link info from database
  console.log("Update link with ID:", linkId);
  var link_id;
  link_id = linkId;
  $.ajax({
    type: "GET",
    url: "http://127.0.0.1:3000/readUpdate",
    data: { link_id: link_id },
    success: function (response, status, xhr) {
      console.log(response);
      let link = JSON.parse(response);
      $("#inputName").val(link.link_name);
      $("#inputDesc").val(link.link_description);
      $("#inputSession").val(link.session_sem);
      $("#inputUrl").val(link.link_url);
      $("#inputCategory").val(link.link_category);
    },
    error: function (xhr, status, error) {
      alert("Ajax connection error!");
    },
    async: true,
  });

  $(".overlay").on("click", function () {
    link_id = "";
  });

  //when update form is submitted
  $("#updatePopup .btn-update").on("click", function () {
    if (link_id != "") {
      $.ajax({
        type: "GET",
        url: "http://127.0.0.1:3000/update",
        data: $("#updatePopup .link-form").serialize() + "&link_id=" + link_id,
        success: function (response, status, xhr) {
          console.log(response);

          $("#successMessage").html(messages);
          $("#updatePopup").hide();
          $("#successPopup").show();

          setTimeout(function () {
            location.reload(true);
          }, 1000);
        },
        error: function (xhr, status, error) {
          alert("Ajax connection error!");
        },
        async: true,
      });
    }
  });
}

//view assigned lecturer
function viewLect(linkId) {
  console.log("view assigned lecturer from link ID:", linkId);
  $.ajax({
    type: "GET",
    url: "http://127.0.0.1:3000/readLect",
    data: { link_id: linkId },
    success: function (response, status, xhr) {
      let userData = JSON.parse(response);
      console.log(userData);
      const htmlArray = userData.map(
        (lecturer) => `<li>${lecturer.email}</li> `
      );
      const htmlss = htmlArray.join("");
      $("#lectList #lecturerList").empty();
      $("#lectList #lecturerList").append(htmlss);
    },
    error: function (xhr, status, error) {
      alert("Ajax connection error!");
    },
    async: true,
  });
}

//on click of assign button, display assignPopup
$(document).on("click", "table .dataa #assignBtn", function () {
  var message =
    "Assign lecturer for link &nbsp;'" +
    $(this).closest("tr").find("td:first").text() +
    "'";
  $(".overlay").fadeIn();
  $("#assignPopup").fadeIn();
  $("#assignPopup").css("display", "flex");
  $("#assignSpan").html(message);
  messages =
    "You have successfully assign link '" +
    $(this).closest("tr").find("td:first").text() +
    "' ...";
  //initiation of select2 dropdown
  $("#select2Assign .form-control").select2({
    width: "300px",
    placeholder: "search/select a lecturer..",
    closeOnSelect: false,
    allowClear: true,
  });
});

//assign link to lecturer
function assignLink(linkId) {
  //view unassigned lecturer for that particular link
  console.log("view unAssigned lecturer from link ID:", linkId);
  var link_id = linkId;

  $.ajax({
    type: "GET",
    url: "http://127.0.0.1:3000/readUnassignLect",
    data: { link_id: link_id, link_owner: user },
    success: function (response, status, xhr) {
      let userData = JSON.parse(response);
      console.log(userData);
      const htmlArray = userData.map(
        (lecturer) => `<option>${lecturer.email}</option> `
      );
      const htmlss = htmlArray.join("");
      $("#select2Assign .form-control").empty();
      $("#select2Assign .form-control").append(htmlss);
    },
    error: function (xhr, status, error) {
      alert("Ajax connection error!");
    },
    async: true,
  });

  $(".overlay").on("click", function () {
    $("#select2Assign .form-control").val(null).trigger("change");
    $("#allSelector").prop("checked", false);
    link_id = "";
  });

  //when assign form is submitted
  $("#assignPopup #submitButton").on("click", function () {
    var items = null;
    items = $("#select2Assign .form-control").select2("val");
    if (items.length > 0) {
      console.log(linkId);
      console.log(items);
      if (link_id != "") {
        $.ajax({
          type: "GET",
          url: "http://127.0.0.1:3000/assignLink",
          data: { LecturerList: JSON.stringify(items), link_id: link_id },
          success: function (response, status, xhr) {
            console.log(response);
            $("#successMessage").html(messages);
            $("#assignPopup").hide();
            $("#successPopup").show();
            $("#select2Assign .form-control").val(null).trigger("change");
            $("#allSelector").prop("checked", false);

            setTimeout(function () {
              location.reload(true);
            }, 1000);
          },
          error: function (xhr, status, error) {
            alert("Ajax connection error!");
          },
          async: true,
        });
      }
    } else {
      $("#result").html("<br>Please pick a lecturer first...!");
    }
  });
}

//enable table search
$("#searchBar").on("keyup", function () {
  $("#sessionDropDown").prop("selectedIndex", 0);
  var value = $(this).val().toLowerCase();
  $("table .dataa").filter(function () {
    //$(this).closest("tr").find("td:first").text();
    $(this).toggle(
      $(this).find("td:first,td:eq(1)").text().toLowerCase().indexOf(value) > -1
    );
  });
});

//enable assigned lecturer search
$("#searchBar2").on("keyup", function () {
  var query = $(this).val().toLowerCase();
  $("#lecturerList li").each(function () {
    var text = $(this).text().toLowerCase();
    var matches = text.includes(query);
    $(this).toggle(matches);
  });
});

//sorting algorithm
//sort data order as not ascending in the beginning
$(".sort").data("isAsc", "false");

//sorting algorithm
$(".sort").on("click", function () {
  $("th>span").hide();
  var table = $(this).parents("table").eq(0);
  var rows = table
    .find("tr:gt(0)")
    .toArray()
    .sort(comparator($(this).index()));

  this.asc = !this.asc;

  if (!this.asc) {
    rows = rows.reverse();
  }
  for (var i = 0; i < rows.length; i++) {
    table.append(rows[i]);
  }
  if ($(this).data("isAsc") == "false") {
    $(this).data("isAsc", "true");
    $(this).children("#asc").show();
  } else {
    $(this).data("isAsc", "false");
    $(this).children("#desc").show();
  }

  function comparator(index) {
    return function (a, b) {
      var valA = getCellValue(a, index),
        valB = getCellValue(b, index);
      return $.isNumeric(valA) && $.isNumeric(valB)
        ? valA - valB
        : valA.toString().localeCompare(valB);
    };
  }

  function getCellValue(row, index) {
    return $(row).children("td").eq(index).text();
  }
});

//filter category code when user click on specific category button
$(".btn-all-categories,.btn-category").on("click", function () {
  $("#sessionDropDown").prop("selectedIndex", 0);
  var category = $(this).data("category");
  console.log(category);
  if (category == "All") {
    $("tr").show();
  } else {
    $("table .dataa").filter(function () {
      $(this).toggle($(this).text().indexOf(category) > -1); //The toggle() method hides the row (display:none) that does not match the search
    });
  }
});

//code to insert all data of session into session drop down
function insertData(DropDownID, columnIndex) {
  var arrData = [];
  $(DropDownID).on("click", function () {
    //
    $("table .dataa").each(function () {
      let str = `td:eq(${columnIndex})`;
      var DropDownData = $(this).find(str).text(); // Adjust column index as needed
      //ensure no redundant data is push into the dropdown
      if (jQuery.inArray(DropDownData, arrData) == -1 || arrData.length == 0) {
        arrData.push(DropDownData);
        $(DropDownID).append(
          $("<option>", {
            value: DropDownData,
            text: DropDownData,
          })
        );
      }
    });
  });
}
insertData("#sessionDropDown", 2);

//code to change table based on selected menu from drop down
function DropDownTableChange(DropDownID) {
  $(DropDownID).on("change", function () {
    var Dataa = $(this).find("option:selected").text();

    if (Dataa == "All" || Dataa == $(this).find("option:first").text()) {
      $("tr").show();
    } else {
      $("table .dataa").filter(function () {
        $(this).toggle($(this).text().indexOf(Dataa) > -1);
      });
    }
  });
}
DropDownTableChange("#sessionDropDown");

//show assigned lecturer popup when click on button
$(document).on("click", "table .dataa .popAssignedLect", function () {
  $(".overlay").fadeIn();
  $("#lectAssignPopup").fadeIn();
  $("#lectAssignPopup").css("display", "flex");
});

//code for show delete popup
$(document).on("click", "table .dataa #deleteBtn", function () {
  $(".overlay").fadeIn();
  $("#deletePopup").fadeIn();
  $("#deletePopup").css("display", "flex");
  var message =
    "Are you sure to delete the file '" +
    $(this).closest("tr").find("td:first").text() +
    "'?";
  $("#deleteMessage").html(message);
  messages =
    "You have successfully delete link '" +
    $(this).closest("tr").find("td:first").text() +
    "' ...";
});

//on overlay click hide all popup
$(".overlay,#deletePopup .confirm,#deletePopup .cancel").click(function () {
  $(".overlay").fadeOut();
  $("#deletePopup").hide();
  $("#deletePopup").children("p").text("Are you sure to delete the file");
  $("#assignPopup").hide();
  $("#result").html("");
  $("#checkAll").hide();
  $("#checkAllUpdate").hide();
  $("#updatePopup").hide();
  $("#updateFile").html("");
  $("#lectAssignPopup").hide();
});

//code for assign popup //using select2 multiple

//when user click on search bar
$("#select2Assign .form-control").on("select2:open", function () {
  $("#result").html("");
  $("#checkAll").show();
});

//when user click on select all checkbox
$("#allSelector").click(function () {
  if ($("#allSelector").is(":checked")) {
    $("#select2Assign .form-control > option").prop("selected", "selected"); // Select All Options
    $("#select2Assign .form-control").trigger("change");
    $("#select2Assign .form-control").select2("open");
  } else {
    $("#select2Assign .form-control > option").prop("selected", ""); //unselect all options
    $("#select2Assign .form-control").trigger("change");
    $("#select2Assign .form-control").select2("open");
  }
});

//when an option is unselect inside the dropdown, change the select all checkbox(if it is checked) into uncheck
$(document.body).on(
  "select2:unselect",
  "#select2Assign .form-control",
  function () {
    $("#allSelector").prop("checked", false);
  }
);
//if all option selected, select all checkbox will auto checked
$("#select2Assign .form-control").on("change", function () {
  var allOptionsSelected = true;
  $("#select2Assign .form-control")
    .find("option")
    .each(function () {
      if (!$(this).is(":selected")) {
        allOptionsSelected = false;
        return false;
      }
    });
  if (allOptionsSelected) {
    $("#allSelector").prop("checked", true);
  }
});
//
//
//
//code for update popup
$(document).on("click", "table .dataa #updateBtn", function () {
  $(".overlay").fadeIn();
  var message =
    "Update Link  &nbsp;&nbsp;'" +
    $(this).closest("tr").find("td:first").text() +
    "'";
  $("#updatePopup").fadeIn();
  $("#updatePopup").css("display", "flex");
  $("#updateFile").html(message);
  messages =
    "You have successfully update link '" +
    $(this).closest("tr").find("td:first").text() +
    "' ...";
});

//code to redirect to lecturer page when toggle is check
$("#toggleCheck").on("change", function () {
  if ($(this).is(":checked")) {
    // Redirect to another page
    setTimeout(function () {
      // Redirect to another page
      window.location.href = "lecturer.html";
    }, 200);
  }
});

//code when logout is click
$("#logout").on("click", function () {
  sessionStorage.clear();
  $("#successMessage").html("You are logging out ...");
  $(".overlay").fadeIn();
  $("#successPopup").fadeIn();

  setTimeout(function () {
    window.location.href = "login.html";
  }, 1400);
});
