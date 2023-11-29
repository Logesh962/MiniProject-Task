function registerNewUser() {
    let req = new XMLHttpRequest();
    req.open("POST", "http://localhost:8080/api/v1/user/register", true);
    req.setRequestHeader("Content-type", "application/json");
    const username = document.getElementById("user").value;
    const email = document.getElementById("emailID").value;
    const password = document.getElementById("registerPass").value;
    req.send(JSON.stringify(
        {
            username: username,
            email: email,
            password: password
        }));
    req.onreadystatechange = function () {
        if (req.readyState == 4) {
            if (req.status == 201) {

                allUserData();

            }
            window.location.replace("../userLogin.html");
            alert("Registered Successfully")
        }
    }
    event.preventDefault();
}

function checkUserCredential() {
    let username = document.getElementById("email").value;
    let password = document.getElementById("pass").value;
    const http = new XMLHttpRequest();
    http.open("POST", `http://localhost:8080/api/v1/user/login`);
    http.setRequestHeader("Content-Type", "application/json");
    http.send(JSON.stringify({
        username: username,
        password: password
    }));
    http.onreadystatechange = function () {
        if (this.readyState == 4) {
            if (this.status == 200) {
                const newobj = this.responseText;

                localStorage.setItem("token", JSON.parse(newobj).token)
                if (JSON.parse(newobj).token) {
                    authentication();
                    localStorage.setItem("user", username);
                } else {
                    alert('Invalid Credentials');
                }
            }
            else {
                alert('Invalid Credentials');
            }
        }
    }
    event.preventDefault();
}




function authentication() {

    const http = new XMLHttpRequest();
    http.open("GET", `http://localhost:8080/api/v1/user/auth-user`, true);
    http.setRequestHeader("Content-type", "application/json");
    http.setRequestHeader("x-user-auth-token", localStorage.getItem("token"));
    http.send();
    http.onreadystatechange = function () {
        if (this.readyState == 4) {
            if (this.status == 200) {
            }
            else {
                alert(this.responseText)
            }
        }
    }
    window.location.replace("../userDashboard.html")
    event.preventDefault();
}

function allUserData() {

    let allUsers = new XMLHttpRequest();
    allUsers.open("Get", "http://localhost:8080/api/v1/user/getUsers");
    allUsers.send();
    allUsers.onreadystatechange = function () {
        if (this.readyState == 4) {
            if (this.status == 200) {
                let allUserData = this.responseText;

                localStorage.setItem("UserInfoDetails", allUserData);
            }
        }
    }

}
