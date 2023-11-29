function checkAdminCredential() {
    let username = document.getElementById("email").value;
    let password = document.getElementById("password").value;
    const http = new XMLHttpRequest();
    http.open("POST", `http://localhost:8080/api/v1/admin/login`);
    http.setRequestHeader("Content-Type", "application/json");
    http.send(JSON.stringify({
        username: username,
        password: password
    }));
    http.onreadystatechange = function () {
        if (this.readyState == 4) {
            if (this.status == 200) {
                const newobj = this.responseText;
                localStorage.setItem("admintoken", JSON.parse(newobj).token)
                if (JSON.parse(newobj).token) {
                    authentication();

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
    http.open("GET", `http://localhost:8080/api/v1/admin/auth-admin`, true);
    http.setRequestHeader("Content-type", "application/json");
    http.setRequestHeader("x-admin-auth-token", localStorage.getItem("admintoken"));
    http.send();
    http.onreadystatechange = function () {
        if (this.readyState == 4) {
            if (this.status == 200) {
                window.location.replace("../adminDashboard.html")
            }
            else {
                alert(this.responseText)
            }
        }
    }

    event.preventDefault();
}