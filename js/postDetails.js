setupUI();
const reload = true;
const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get("id");
function getPost() {
  axios
    .get(`${baseUrl}/posts/${id}`)
    .then((response) => {
      console.log(response);
      const post = response.data.data;
      const comments = response.data.data.comments;
      const author = post.author;
      document.getElementById("usernameSpan").innerHTML = author.username;
      let commentsContent = ``;
      for (comment of comments) {
        commentsContent += `
        <!-- COMMENT -->
            <div class="p-3" style="background-color: rgb(235, 235, 235)">
            <!-- PROFILE PIC + USERNAME -->
            <img
                src="${author.profile_image}"
                class="rounded-circle"
                alt=""
                style="width: 40px; height: 40px"
            />
            <b id="commentsUsername">@${comment.author.username}</b>
            <!-- PROFILE PIC + USERNAME //-->
            <!-- COMMENTS BODY -->
            <div>
               ${comment.body}
            </div>
            <!-- COMMENTS BODY //-->
            </div>
        <!-- COMMENT //-->
        `;
      }
      let content = `
        <div class="card shadow my-5">
            <div class="card-header">
                <img
                class="rounded-circle border border-3"
                src="${author.profile_image}"
                alt=""
                style="width: 5%"
                />
                <b>@${author.username}</b>
            </div>
            <div class="card-body">
                <img class="w-100" src="${post.image}" alt="" />
                <h6 class="mt-1" style="color: rgb(178, 174, 174)">
                ${post.created_at}
                </h6>
                <h5>${post.title}</h5>
                <p>
                 ${post.body}
                </p>
                <hr />
                <div>
                <img src="images/pencil.svg" alt="" />
                <span>(${post.comments_count}) comments</span>
                </div>
                <div id="comments">
                      ${commentsContent}
                </div>
                <div class="input-group mb-3" id="addComment">
                    <input type="text" placeholder="add your comment here.." id="commentInput" class="form-control" />
                    <button class="btn btn-outline-primary" onclick="addCommentBtn()" type="button">send</button>
                </div>


            </div>
        </div>
        `;

      document.getElementById("post").innerHTML = content;
    })
    .catch(function (error) {
      console.log(error);
    });
}
getPost();

function addCommentBtn() {
  let commentBody = document.getElementById("commentInput").value;
  let params = {
    body: commentBody,
  };
  let token = localStorage.getItem("token");
  let url = `https://tarmeezacademy.com/api/v1/posts/${id}/comments`;

  axios
    .post(url, params, {
      headers: {
        authorization: `Bearer ${token}`,
      },
    })
    .then((response) => {
      console.log(response);
      showAlert("Comment Added Successfully", "success");
      getPost();
    })
    .catch((error) => {
      const errorMessage = error.response.data.message;
      showAlert(errorMessage, "danger");
    });
}
