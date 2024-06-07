// link categories
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

var user = sessionStorage.getItem("email");
var userType = sessionStorage.getItem("userType");
listLink(user);

if (userType != "admin") {
  //if normal user, the toggle will hide
  $(".toggleContainer").hide();
}

function listLink(user_email) {
  $.ajax({
    type: "GET",
    url: "http://127.0.0.1:3000/readLecturerPage",
    data: { user_email: user_email },
    success: function (response, status, xhr) {
      let linkData = JSON.parse(response);
      console.log(linkData);
      createLinksList(linkData);
    },
    error: function (xhr, status, error) {
      alert("Ajax connection error!");
    },
    async: true,
  });
}

//create linkList value in html and append it to the linkList variable
function createLinksList(dataArray) {
  const htmlArr = dataArray.map(
    (link) => ` 
    <tr class="dataa">
    <td>${link.link_name} </td>
    <td>${link.link_description} </td>
    <td>${link.link_owner} </td> 
    <td>${link.session_sem} </td> 
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
  </td></tr>`
  );
  const html = htmlArr.join("");
  $(".linktable").append(html);
}

//searchBar algorithm

$("#searchBar").on("keyup", function () {
  $("#ownerDropDown").prop("selectedIndex", 0);
  $("#sessionDropDown").prop("selectedIndex", 0);
  var value = $(this).val().toLowerCase();
  $("table .dataa").filter(function () {
    $(this).toggle(
      $(this).find("td:first,td:eq(1)").text().toLowerCase().indexOf(value) > -1
      // tr will auto go into .show() if the text search match with value inside link name/description on the table
    );
  });
});

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
//end of sorting algo

//filter category code
$(".btn-all-categories,.btn-category").on("click", function () {
  $("#ownerDropDown").prop("selectedIndex", 0);
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
insertData("#sessionDropDown", 3);
insertData("#ownerDropDown", 2);

//code to change table based on selected menu from drop down
function DropDownTableChange(DropDownID1, DropDownID2) {
  $(DropDownID1).on("change", function () {
    var Dataa = $(this).find("option:selected").text();

    //change back(if already on other index) the other drop down to first index
    $(DropDownID2).prop("selectedIndex", 0);

    if (Dataa == "All" || Dataa == $(this).find("option:first").text()) {
      $("tr").show();
    } else {
      $("table .dataa").filter(function () {
        $(this).toggle($(this).text().indexOf(Dataa) > -1);
      });
    }
  });
}
DropDownTableChange("#sessionDropDown", "#ownerDropDown");
DropDownTableChange("#ownerDropDown", "#sessionDropDown");

//redirect to admin page
$("#toggleCheck").prop("checked", true);
$("#toggleCheck").on("change", function () {
  if (!$(this).is(":checked")) {
    // Redirect to another page
    setTimeout(function () {
      // Redirect to another page
      window.location.href = "admin.html";
    }, 200);
  }
});

//when logout button is click
$("#logout2").on("click", function () {
  sessionStorage.clear();
  $("#successMessage").html("You are logging out...");
  $(".overlay2").fadeIn();
  $("#successPopup2").fadeIn();
  setTimeout(function () {
    window.location.href = "login.html";
  }, 1400);
});
