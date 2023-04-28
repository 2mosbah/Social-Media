setupUI();

const baseUrl = "https://tarmeezacademy.com/api/v1";

let currentPage = 0;
let lastPage = 1;

// infinite scroll
window.addEventListener("scroll", function () {
  const endOfPage =
    window.innerHeight + window.pageYOffset >= document.body.offsetHeight;
  if (endOfPage && currentPage < lastPage) {
    currentPage++;
    getPosts(false, currentPage);
  }
});
// end infinite scroll

function getPosts(reload = true, page = 1) {
  axios
    .get(`${baseUrl}/posts?limit=5&page=${page}`)
    .then((response) => {
      lastPage = response.data.meta.last_page;
      let posts = response.data.data;
      console.log(response);
      if (reload) {
        document.getElementById("posts").innerHTML = "";
      }
      for (data of posts) {
        const user = getCurrentUser();
        const isMyPost = user != null && data.author.id == user.id;
        let editBtnContent = ``;
        let deleteBtnContent = ``;
        if (isMyPost) {
          editBtnContent = `<button id="edit-btn" class="btn btn-secondary" style="float: right;" onclick="editPostBtnClicked('${encodeURIComponent(
            JSON.stringify(data)
          )}')" data-bs-toggle="modal"  data-bs-whatever="@mdo">Edit</button>`;
          deleteBtnContent = `<button id="delete-btn" class="btn btn-danger" style="float: right; margin-right:2%;" onclick="deletePostBtnClicked('${encodeURIComponent(
            JSON.stringify(data)
          )}')" data-bs-toggle="modal"  data-bs-whatever="@mdo">Delete</button>`;
        }
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
                ${editBtnContent}
                ${deleteBtnContent}
            </div>
            <div class="card-body" onclick="postClicked(${data.id})" style="cursor: pointer">
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

        // const tagsID = `tags-${data.id}`;
        // document.getElementById(tagsID).innerHTML += "";
        // for (tag of posts) {
        //   let tagsContent = `
        //   <button class="btn btn-sm rounded-5 tags mx-1">${tag.name}</button>
        //   `;
        // }
        // document.getElementById(tagsID).innerHTML += tagsContent;
        document.getElementById("posts").innerHTML += content;
      }
    })
    .catch(function (error) {
      console.log(error);
    });
}
getPosts();

function addPostBtn() {
  let postId = document.getElementById("postId").value;
  let isCreate = postId == null || postId == "";
  alert(isCreate);
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
        showAlert("New Post Created Successfully", "success");
      }, 500);
      document.location.reload();
      getPosts();
    })
    .catch((error) => {
      showAlert(error.response.data.message, "danger");
    });
}

function postClicked(postId) {
  window.location = `postDetails.html?id=${postId}`;
}
