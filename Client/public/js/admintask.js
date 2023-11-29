let hasRun = false;
let AdminAllTask;
function welcome() {
  if (!hasRun) {
    alert("Welcome Admin !");
    hasRun = true;
  }
}
function AdminTask() {

  let AdminTask = new XMLHttpRequest();
  AdminTask.open("Get", "http://localhost:8080/api/v1/admin/getTasks");
  AdminTask.send();
  AdminTask.onreadystatechange = function () {
    if (this.readyState == 4) {
      if (this.status == 200) {
        AdminAllTask = JSON.parse(this.responseText);
        localStorage.setItem("listOfTasks", this.responseText);
        DisplayAdminTask();
        welcome();
      }
    }
  }
}
function DisplayAdminTask() {
  let Data = "";
  getMinDate();
  for (let i = 0; i < AdminAllTask.length; i++) {
    Data += `<tr>
        <td>${i + 1}</td>
        <td><img src="https://th.bing.com/th/id/R.eb6804870a7f5455766e281417a40ced?rik=cQz8JPO9UUdaqA&riu=http%3a%2f%2f1.bp.blogspot.com%2f-vMAA5GEDrgY%2fVO0AuiJLv8I%2fAAAAAAAAEUI%2fdWhG689iRy8%2fs1600%2fshutterstock_236072971.jpg&ehk=kEiHu%2beu%2fSjXJAGwtjMnQeTk6GUT47JgYgW6uazfNA4%3d&risl=&pid=ImgRaw&r=0" alt="">${AdminAllTask[i].Title}</td>
        <td>${AdminAllTask[i].Description}</td>
        <td> ${AdminAllTask[i].Duration}</td>
        <td> ${AdminAllTask[i].Assigned}</td>
        <td> ${AdminAllTask[i].Comments}</td>
        <td> ${AdminAllTask[i].Created_At}</td>
        <td><p class=${AdminAllTask[i].Status}>${AdminAllTask[i].Status}</p></td>
        <td>  <button type="button" data-bs-toggle="modal"  data-bs-target="#editModal"class="edit-btn" onclick="editTask('${AdminAllTask[i]._id}')"><i class="fas fa-edit"></i> Edit</button>
        <button type="button" class="delete-btn" data-bs-toggle="modal" id="DeleteButton" data-bs-target="#staticBackdrop"  onclick="onestepDelete('${AdminAllTask[i]._id}')"><i class="fas fa-trash-alt"></i> Delete</button></td</tr>`
  }
  document.getElementById("TableData").innerHTML = Data;
  search_sort();

}


function search_sort() {
  document.getElementById('searchInput').addEventListener('input', function () {
    let input, filter, table, tbody, tr, td, i, txtValue;
    input = document.getElementById('searchInput');
    filter = input.value.toUpperCase();
    table = document.getElementById('myTable');
    tbody = document.getElementById('TableData');
    tr = tbody.getElementsByTagName('tr');

    for (i = 0; i < tr.length; i++) {
      td = tr[i].getElementsByTagName('td');
      for (let j = 0; j < td.length; j++) {
        txtValue = td[j].textContent || td[j].innerText;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
          tr[i].style.display = '';
          break; // Break the inner loop to avoid displaying the row multiple times
        } else {
          tr[i].style.display = 'none';
        }
      }
    }
  });
}
let sortOrders = []; // Array to keep track of sort order for each column

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




function editTask(unique_id) {

  let popupData1 = "";
  let Assigned_dropdown1 = localStorage.getItem("UserInfoDetails");
  Assigned_dropdown1 = JSON.parse(Assigned_dropdown1)
  popupData1 += ` <option selected>Select UserName</option>`
  for (let i = 0; i < Assigned_dropdown1.length; i++) {
    popupData1 += `<option value=${Assigned_dropdown1[i].username}>${Assigned_dropdown1[i].username}</option>`
  }
  document.getElementById("username1").innerHTML = popupData1;
  let Edit_modal_task = `<button type="button" class="btn btn-primary"  data-bs-dismiss="modal"onclick="editTaskUpdate('${unique_id}')">Save changes</button>`;
  document.getElementById("editmodalDOM").innerHTML = Edit_modal_task;
  for (let i = 0; i < AdminAllTask.length; i++) {
    if (AdminAllTask[i]._id === unique_id) {
      document.getElementById("titleInput1").value = AdminAllTask[i].Title;
      document.getElementById("descriptionInput1").value = AdminAllTask[i].Description;
      document.getElementById("username1").value = AdminAllTask[i].Assigned;
      document.getElementById("statusDropdown1").value = AdminAllTask[i].Status;
      document.getElementById("durationInput1").value = AdminAllTask[i].Duration;
      document.getElementById("commentsInput1").value = AdminAllTask[i].Comments;

    }
  }

}
function editTaskUpdate(UpdateTask) {
  event.preventDefault();


  let TitleUpdate = document.getElementById("titleInput1").value;
  let DescriptionUpdate = document.getElementById("descriptionInput1").value;
  let DurationUpdate = document.getElementById("durationInput1").value;
  let CommentsUpdate = document.getElementById("commentsInput1").value;
  let UsernameUpdate = document.getElementById("username1").value;
  let StatusUpdate = document.getElementById("statusDropdown1").value;
  let UpdateTask1 = new XMLHttpRequest();
  UpdateTask1.open("PUT", `http://localhost:8080/api/v1/admin/updateTask/${UpdateTask}`);
  UpdateTask1.setRequestHeader("Content-Type", "application/json");
  UpdateTask1.send(JSON.stringify({
    Title: TitleUpdate,
    Description: DescriptionUpdate,
    Duration: DurationUpdate,
    Assigned: UsernameUpdate,
    Status: StatusUpdate,
    Comments: CommentsUpdate

  }));
  UpdateTask1.onreadystatechange = function () {
    if (this.readyState == 4) {
      if (this.status == 200) {

        AdminTask();
        alert('Task has been updated successfully !');
      }

    }
  }

}
function onestepDelete(id) {

  let bool = confirm("Are you sure you want to delete this task?");

  if (bool) {
    DeleteTask(id);
  };
}

function DeleteTask(objectid) {

  let DeleteTask = new XMLHttpRequest();
  DeleteTask.open("Delete", `http://localhost:8080/api/v1/admin/deleteTask/${objectid}`);
  DeleteTask.send();
  DeleteTask.onreadystatechange = function () {
    if (this.readyState == 4) {
      if (this.status == 200) {
        AdminTask();
      }

    }
  }
}

function Add() {

  let popupData = "";
  let Assigned_dropdown = localStorage.getItem("UserInfoDetails");
  Assigned_dropdown = JSON.parse(Assigned_dropdown)

  popupData += ` <option selected>Select UserName</option>`
  for (let i = 0; i < Assigned_dropdown.length; i++) {
    popupData += `<option value=${Assigned_dropdown[i].username}>${Assigned_dropdown[i].username}</option>`
  }
  document.getElementById("usernameInput").innerHTML = popupData;
}

function TaskSave() {
  event.preventDefault();
  let TitleAdd = document.getElementById("titleInput").value;
  let DescriptionAdd = document.getElementById("descriptionInput").value;
  let DurationAdd = document.getElementById("durationInput").value;
  let CommentsAdd = document.getElementById("commentsInput").value;
  let UsernameAdd = document.getElementById("usernameInput").value;
  let StatusAdd = document.getElementById("statusDropdown").value;


  let AddTask = new XMLHttpRequest();
  AddTask.open("POST", "http://localhost:8080/api/v1/admin/saveTask");
  AddTask.setRequestHeader("Content-Type", "application/json");
  AddTask.send(JSON.stringify({
    Title: TitleAdd,
    Description: DescriptionAdd,
    Duration: moment(DurationAdd).format('DD-MM-YYYY'),
    Assigned: UsernameAdd,
    Status: StatusAdd,
    Notification: true,
    Comments: CommentsAdd,
    Created_At: new Date().toLocaleString()

  }));
  AddTask.onreadystatechange = function () {
    if (this.readyState == 4) {
      if (this.status == 200) {
        AdminTask();
        document.getElementById("titleInput").value = "";
        document.getElementById("descriptionInput").value = "";
        document.getElementById("durationInput").value = "";
        ocument.getElementById("commentsInput").value = "";
        document.getElementById("usernameInput").value = "";
        document.getElementById("statusDropdown").value = "";

      }
    }
  }

  Swal.fire({ title: "Task has been assigned Successfully", timer: 2000, showConfirmButton: false, icon: "success" })
}


function filteringStatus(field) {
  let data1 = "";

  if (field == "Status") {
    DisplayAdminTask();
  }
  else {
    for (let i = 0; i < AdminAllTask.length; i++) {
      if (field == AdminAllTask[i].Status) {
        data1 += `<tr>
        <td>${i + 1}</td>
        <td>${AdminAllTask[i].Title
          }</td>
        <td>${AdminAllTask[i].Description}</td>
        <td>${AdminAllTask[i].Duration}</td>
        <td>${AdminAllTask[i].Comments}</td>
        <td>${AdminAllTask[i].Created_At}</td>
        <td> ${AdminAllTask[i].Assigned}</td>
   
        <td><p class=${AdminAllTask[i].Status}>${AdminAllTask[i].Status
          }</p></td>
        <td>  <button type="button" data-bs-toggle="modal"  data-bs-target="#editModal"class="edit-btn" onclick="edittask('${AdminAllTask[i]._id
          }')"><i class="fas fa-edit"></i> Edit</button>
        <button type="button" class="delete-btn" data-bs-toggle="modal" id="DeleteButton" data-bs-target="#staticBackdrop"  onclick="onestepDelete('${AdminAllTask[i]._id
          }')"><i class="fas fa-trash-alt"></i> Delete</button></td</tr>`;
      }
    }
    document.getElementById("TableData").innerHTML = data1;
    document.getElementById("")
  }

}


function getMinDate() {
  let date = moment().format('YYYY-MM-DD');
  document.getElementById("durationInput").min = date;

}


window.onload = AdminTask;
