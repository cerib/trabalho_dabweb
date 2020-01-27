console.log("feed script loaded");

window.onload = function() {
  //removes warning background color from this field when user presses a key
  var posts = document.getElementsByClassName("card-text");
  for (let post of posts) {
    post.innerHTML = post.innerHTML.replace(
      /(#[A-z0-9]+)/g,
      '<a href="http://localhost:7777/hashtag/$1">$1</a>'
    );
  }
};

//CODIGO QUE COLOCA ELEMENTOS NA MODAL
var postId = null;
$(document).on("click", ".edit-link", function(e) {
  // 2 - post id
  // 3 - author name
  // 4 - author at
  // 5 - group at
  postId = e.originalEvent.toElement.previousSibling.attributes[2].textContent; //variavel global
  var authorName =
    e.originalEvent.toElement.previousSibling.attributes[3].textContent;
  var authorAt =
    e.originalEvent.toElement.previousSibling.attributes[4].textContent;
  var groupAt =
    e.originalEvent.toElement.previousSibling.attributes[5].textContent;
  var postText = $(this)
    .closest("div")
    .find("p")[0].textContent;
  var authorAtHtml = `<a href="/users/${authorAt}">@${authorAt}</a>`;

  $("#author-name-modal")[0].innerHTML = authorName + " " + authorAtHtml; // = authorName + " ";

  if (groupAt !== authorAt) {
    var groupAtHtml = `<p style="font-size: 70%; display: inline"> &#9654; </p> <a class="text-info" style="text-decoration: none;" href="/groups/${groupAt}">${groupAt}</a>`;
    $("#author-name-modal")[0].innerHTML += groupAtHtml;
  }

  $("#post-text-modal").val(postText);
  $("#delete-post-form")[0].action = `/posts/${postId}/delete`;
  $("#upload-file-form")[0].action = `/posts/${postId}/uploadfile`;
});

reloadPage = function() {
  document.location.reload(true);
};

submitDelete = function() {
  if (confirm("Apagar o post? Esta acção não pode ser cancelada.")) {
    var json = JSON.stringify({});
    var xhr = new XMLHttpRequest();
    xhr.open("POST", `/posts/${postId}/delete`, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onreadystatechange = reloadPage;
    xhr.send(json);
  } else {
    reloadPage();
  }
};

submitEdit = function() {
  var data = {
    text: $("#post-text-modal").val()
  };

  var json = JSON.stringify(data);
  var xhr = new XMLHttpRequest();
  xhr.open("POST", `/posts/${postId}/edit`, true);
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.onreadystatechange = reloadPage;
  xhr.send(json);
};
