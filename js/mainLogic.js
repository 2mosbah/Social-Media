function setupUI() {
  const token = localStorage.getItem("token");
  const loginDiv = document.getElementById("loginDiv");
  const logoutDiv = document.getElementById("logoutDiv");
  const addBtn = document.getElementById("addBtn");

  if (token == null) {
    if (addBtn != null) {
      addBtn.style.setProperty("display", "none", "important");
    }
    loginDiv.style.setProperty("display", "flex", "important");
    logoutDiv.style.setProperty("display", "none", "important");
  } else {
    if (addBtn != null) {
      addBtn.style.setProperty("display", "flex", "important");
    }
    loginDiv.style.setProperty("display", "none", "important");
    logoutDiv.style.setProperty("display", "flex", "important");
    const user = getCurrentUser();
    document.getElementById("navUser").innerHTML = user.username;
    document.getElementById("navUserImage").src = user.profile_image;
  }
}

function loginBtn() {
  let username = document.getElementById("username").value;
  let password = document.getElementById("password").value;
  let params = {
    username: username,
    password: password,
  };
  axios
    .post(`https://tarmeezacademy.com/api/v1/login`, params)
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

function registerBtn() {
  let name = document.getElementById("register-name").value;
  let username = document.getElementById("register-username").value;
  let password = document.getElementById("register-password").value;
  let image = document.getElementById("register-image-input").files[0];

  let formData = new FormData();
  formData.append("name", name);
  formData.append("username", username);
  formData.append("password", password);
  formData.append("image", image);

  const header = {
    "Content-Type": "multipart/form-data",
  };

  axios
    .post(`https://tarmeezacademy.com/api/v1/register`, formData, {
      headers: header,
    })
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

function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  showAlert("Logged Out sussessfully", "success");
  setupUI();
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

function getCurrentUser() {
  let user = null;
  let storageUser = localStorage.getItem("user");

  if (storageUser != null) {
    user = JSON.parse(storageUser);
  }

  return user;
}

function editPostBtnClicked(postObject) {
  let post = JSON.parse(decodeURIComponent(postObject));
  document.getElementById("postId").value = post.id;
  document.getElementById("exampleModalLabel").innerHTML = "Edit Post";
  document.getElementById("title").value = post.title;
  document.getElementById("body").value = post.body;
  document.getElementById("editPost").innerHTML = "Update";
  let postModal = new bootstrap.Modal(
    document.getElementById("addPostModal"),
    {}
  );
  postModal.toggle();
}

function deletePostBtnClicked(postObject) {
  let post = JSON.parse(decodeURIComponent(postObject));
  document.getElementById("delete-post-id-input").value = post.id;
  let postModal = new bootstrap.Modal(
    document.getElementById("deletePost-modal"),
    {}
  );
  postModal.toggle();
}

function deletePost() {
  const token = localStorage.getItem("token");
  const headers = {
    authorization: `Bearer ${token}`,
  };
  const postId = document.getElementById("delete-post-id-input").value;

  url = `https://tarmeezacademy.com/api/v1/posts/${postId}`;
  axios
    .delete(url, {
      headers: headers,
    })
    .then((response) => {
      let modal = document.getElementById("deletePost-modal");
      let modalInstance = bootstrap.Modal.getInstance(modal);
      modalInstance.hide();
      showAlert("Post Deleted successfully", "success");
      getPosts();
      if (id != null) {
        window.open("home.html");
      }
    });
}
