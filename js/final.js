setupUI();
const baseUrl = "https://tarmeezacademy.com/api/v1";
function getPosts() {
  axios
    .get(`${baseUrl}/posts`)
    .then(function (response) {
      const posts = response.data.data;
      document.getElementById("posts").innerHTML = "";
      for (data of posts) {
        let content = `
            <div class="card shadow my-5">
            <div class="card-header">
                <img
                class="rounded-circle border border-3"
                src="${data.author.profile_image}"
                alt=""
                style="width: 5%"
                />
                <b>${data.author.username}</b>
            </div>
            <div class="card-body">
                <img class="w-100" src="${data.image}" alt="" />
                <h6 class="mt-1" style="color: rgb(178, 174, 174)">
                ${data.created_at}
                </h6>
                <h5>${data.title}</h5>
                <p>
            ${data.body}
                </p>
                <hr />
                <div>
                <img src="images/pencil.svg" alt="" />
                <span>(${data.comments_count}) comments</span>
                <span id="tags-${data.id}">
                  
                </span>
                </div>
            </div>
            </div>
            `;
        document.getElementById("posts").innerHTML += content;

        // const tagsID = `tags-${data.id}`;
        // document.getElementById(tagsID).innerHTML += "";
        // for (tag of posts) {
        //   let tagsContent = `
        //   <button class="btn btn-sm rounded-5 tags mx-1">${tag.name}</button>
        //   `;
        // }
        // document.getElementById(tagsID).innerHTML += tagsContent;
      }
    })
    .catch(function (error) {
      console.log(error);
    });
}
getPosts();

function loginBtn() {
  let username = document.getElementById("username").value;
  let password = document.getElementById("password").value;
  let params = {
    username: username,
    password: password,
  };
  axios
    .post(`${baseUrl}/login`, params)
    .then(function (response) {
      console.log(response.data);
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      const modal = document.getElementById("localModal");
      const modalInstance = bootstrap.Modal.getInstance(modal);
      modalInstance.hide();
      setupUI();
      showAlert("Logged In sussessfully", "success");
    })
    .catch(function (error) {
      console.log(error);
    });
}

function showAlert(message, status) {
  const alertPlaceholder = document.getElementById("loginAlert");
  const appendAlert = (message, type) => {
    const wrapper = document.createElement("div");
    wrapper.innerHTML = [
      `<div class="alert alert-${type} alert-dismissible" role="alert">`,
      `   <div>${message}</div>`,
      '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
      "</div>",
    ].join("");
    alertPlaceholder.append(wrapper);
  };
  appendAlert(message, status);

  setTimeout(() => {
    const hidaAlert = bootstrap.Alert.getOrCreateInstance("#loginAlert");
    hidaAlert.close();
  }, 2000);
}

function setupUI() {
  const token = localStorage.getItem("token");
  const loginDiv = document.getElementById("loginDiv");
  const logoutDiv = document.getElementById("logoutDiv");

  const addBtn = document.getElementById("addBtn");

  if (token == null) {
    addBtn.style.setProperty("display", "none", "important");
    loginDiv.style.setProperty("display", "flex", "important");
    logoutDiv.style.setProperty("display", "none", "important");
  } else {
    loginDiv.style.setProperty("display", "none", "important");
    logoutDiv.style.setProperty("display", "flex", "important");
    addBtn.style.setProperty("display", "flex", "important");
  }
}

function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  showAlert("Logged Out sussessfully", "success");
  setupUI();
}

function registerBtn() {
  let name = document.getElementById("register-name").value;
  let username = document.getElementById("register-username").value;
  let password = document.getElementById("register-password").value;

  let params = {
    username: username,
    password: password,
    name: name,
  };
  axios
    .post(`${baseUrl}/register`, params)
    .then(function (response) {
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      setupUI();
      const modal = document.getElementById("registerModal");
      const modalInstance = bootstrap.Modal.getInstance(modal);
      modalInstance.hide();
      showAlert("New User Registered sussessfully", "success");
    })
    .catch(function (error) {
      showAlert(error.response.data.message, "danger");
    });
}

function addPostBtn() {
  console.log("Jeelcsalk");
  const title = document.getElementById("title").value;
  const body = document.getElementById("body").value;
  const image = document.getElementById("postImage").files[0];

  let formData = new FormData();
  formData.append("title", title);
  formData.append("body", body);
  formData.append("image", image);

  const token = localStorage.getItem("token");
  const header = {
    "Content-Type": "multipart/form-data",
    authorization: `Bearer ${token}`,
  };
  axios
    .post(`${baseUrl}/posts`, formData, {
      headers: header,
    })
    .then(function (response) {
      setTimeout(() => {
        const hidaAlert = bootstrap.Alert.getOrCreateInstance("#addPostModal");
        hidaAlert.close();
        document.location.reload();
      }, 50);
      showAlert("New Post Created Successfully", "success");
      getPosts();
    })
    .catch((error) => {
      showAlert(error.response.data.message, "danger");
    });
}
