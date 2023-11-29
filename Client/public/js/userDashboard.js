let taskDetails;
let userNameFind;
let loginUserName;
let allTasksAdmin;

//displayTable
function displayTable() {

  let table_Data = "";
  allTasksAdmin = JSON.parse(localStorage.getItem("listOfTasks"));
  userNameFind = JSON.parse(localStorage.getItem("UserInfoDetails"));
  for (let i = 0; i < userNameFind.length; i++) {
    if (localStorage.getItem("user") == userNameFind[i].email) {
      loginUserName = userNameFind[i].username;
    }
  }

  let j = 0;
  document.getElementById("para").innerHTML = "Hello " + loginUserName + "! ,Here are tasks assigned to you";
  for (let i = 0; i < allTasksAdmin.length; i++) {
    if (loginUserName == allTasksAdmin[i].Assigned) {
      table_Data += `<tr>
        <td>${j + 1}</td>
        <td>${allTasksAdmin[i].Title}</td>
        <td>${allTasksAdmin[i].Description}</td>
        <td>${allTasksAdmin[i].Duration}</td>
        <td>${allTasksAdmin[i].Comments}</td>

        <td>${allTasksAdmin[i].Status}</td>
        <td><button type="button" data-bs-toggle="modal" data-bs-target="#myModal"class="edit-btn" onclick="edittask('${allTasksAdmin[i]._id
        }')"><i class="fas fa-edit"></i>Update</button></td>
        </tr>
        `;
      j++;
    }
  }
  document.getElementById("data1").innerHTML = table_Data;
  search_sort();
  tableCheck();
  //   Task_Notification();
  setTimeout(alertTask, 1000);
}

function AdminTaskNew() {
  let AdminTask = new XMLHttpRequest();
  AdminTask.open("Get", "http://localhost:8080/api/v1/admin/getTasks");
  AdminTask.send();
  AdminTask.onreadystatechange = function () {
    if (this.readyState == 4) {
      if (this.status == 200) {
        AdminAllTask = JSON.parse(this.responseText);
        localStorage.setItem("listOfTasks", this.responseText);
        displayTable();
      }
    }
  };
}


//search bar
function search_sort() {
  document.getElementById("searchInput").addEventListener("input", function () {
    let input, filter, table, tbody, tr, td, i, txtValue;
    input = document.getElementById("searchInput");
    filter = input.value.toUpperCase();
    table = document.getElementById("editableTable");
    tbody = document.getElementById("data1");
    tr = tbody.getElementsByTagName("tr");

    for (i = 0; i < tr.length; i++) {
      td = tr[i].getElementsByTagName("td");
      for (let j = 0; j < td.length; j++) {
        txtValue = td[j].textContent || td[j].innerText;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
          tr[i].style.display = "";
          break; // Break the inner loop to avoid displaying the row multiple times
        } else {

          tr[i].style.display = "none";
        }
      }
    }
  });
  tableCheck();
}

function tableCheck() {
  let table = document.getElementById('editableTable');
  let searchinput = document.getElementById('searchInput');
  let replacementImage = document.getElementById('replaceimage');
  if (table.getElementsByTagName('tbody')[0].childElementCount === 0) {
    table.style.display = 'none';
    replacementImage.style.display = 'none';
    searchinput.style.display = "none";
    document.getElementById('search').innerHTML = "No tasks assigned for you yet !";
  } else {
    table.style.display = 'table';
    replacementImage.style.display = 'none';
    searchinput.style.display = "block";
  }
}


function alertTask() {

  let Notify_Task = JSON.parse(localStorage.getItem("listOfTasks"));

  for (key in Notify_Task) {
    if (loginUserName == Notify_Task[key].Assigned) {

      if (Notify_Task[key].Notification == true) {

        alert(`Admin assigned you a ${Notify_Task[key].Title}...`);

        const http = new XMLHttpRequest();
        http.open(
          "PUT",
          `http://localhost:8080/api/v1/admin/updateTask/${Notify_Task[key]._id}`,
          true
        );
        http.setRequestHeader("Content-Type", "application/json");
        http.send(JSON.stringify({ Notification: false }));
        http.onreadystatechange = function () {
          if (this.readyState == 4) {
            if (this.status == 200) {
              AdminTaskNew();
            }
          }
        };
      }
    }
  }
}

//Status Filter
function data(dropValue) {

  taskDetails = JSON.parse(localStorage.getItem("listOfTasks"));

  if (dropValue == "Status") {
    displayTable();

  }
  else if (!(dropValue == "Status")) {
    let table_Data2 = "";
    let j = 0;
    for (let i = 0; i < allTasksAdmin.length; i++) {
      if (dropValue == allTasksAdmin[i].Status && loginUserName == allTasksAdmin[i].Assigned) {
        table_Data2 += `<tr>
                    <td>${j + 1}</td>
                    <td>${allTasksAdmin[i].Title}</td>
                    <td>${allTasksAdmin[i].Description}</td>
                    <td>${allTasksAdmin[i].Duration}</td>
                    <td>${allTasksAdmin[i].Comments}</td>
                    <td>${allTasksAdmin[i].Status}</td>
                    <td><button type="button" data-bs-toggle="modal" data-bs-target="#myModal"class="edit-btn" onclick="edittask('${allTasksAdmin[i]._id
          }')"><i class="fas fa-edit"></i> Edit</button></td>
                    </tr>`;
        j++;
      }
    }
    document.getElementById("data1").innerHTML = table_Data2;
  }
  document.getElementById("dropdownsts").selectedIndex = 0;
}


function edittask(statusId) {
  let data = `<button type="button" class="btn btn-primary" data-bs-dismiss="modal" id = "modelChange123" onclick="saveStatus('${statusId}')">Save Status</button>`;
  document.getElementById("modelChange").innerHTML = data;

}
function saveStatus(sid) {
  // Retrieve the selected status
  let selectedStatus = document.getElementById('statusDropdown').value;
  let selectedcomments = document.getElementById('commentsInput1').value;
  // Do something with the selected status (e.g., send it to the server)


  const http1 = new XMLHttpRequest();
  http1.open(
    "PUT",
    `http://localhost:8080/api/v1/admin/updateTask/${sid}`,
    true
  );
  http1.setRequestHeader("Content-Type", "application/json");
  http1.send(JSON.stringify({
    Status: selectedStatus,
    Comments: selectedcomments
  }));
  http1.onreadystatechange = function () {
    if (this.readyState == 4) {
      if (this.status == 200) {

        AdminTaskNew();
      }
    }
  };


}


function sortTable(columnIndex) {
  let table, rows, switching, i, x, y, shouldSwitch;
  table = document.getElementById("myTable");
  switching = true;
  // Initialize sort order for the column if not already set
  if (!sortOrders[columnIndex]) {
    sortOrders[columnIndex] = 1; // 1 for ascending
  } else {
    sortOrders[columnIndex] *= -1; // Toggle between ascending (1) and descending (-1)
  }

  while (switching) {
    switching = false;
    rows = table.rows;

    for (i = 1; i < (rows.length - 1); i++) {
      shouldSwitch = false;
      x = rows[i].getElementsByTagName("td")[columnIndex];
      y = rows[i + 1].getElementsByTagName("td")[columnIndex];

      let xValue = x.innerHTML.toLowerCase();
      let yValue = y.innerHTML.toLowerCase();

      if (sortOrders[columnIndex] === 1 ? xValue > yValue : xValue < yValue) {
        shouldSwitch = true;
        break;
      }
    }

    if (shouldSwitch) {
      rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
      switching = true;
    }
  }
}

window.onload = displayTable;