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

$(document).on("click", ".edit-link", function(e) {
  var authorName = $("#edit-link").data("author-name");
  var authorAt = $("#edit-link").data("author-at");
  var groupAt = $("#edit-link").data("group-at");
  var postText = $(this)
    .closest("div")
    .find("p")[0].textContent;
  authorAtHtml = `<a href="/users/${authorAt}">@${authorAt}</a>`;
  $("#author-name-modal")[0].innerHTML = authorName + " " + authorAtHtml; // = authorName + " ";

  if (groupAt !== authorAt) {
    var groupAtHtml = `<p style="font-size: 70%; display: inline"> &#9654; </p> <a class="text-info" style="text-decoration: none;" href="/groups/${groupAt}">${groupAt}</a>`;
    $("#author-name-modal")[0].innerHTML += groupAtHtml;
  }

  $("#post-text-modal").val(postText);
});

submitEdit = function() {
  var data = {
    text: $("#post-text-modal").val()
  };

  var json = JSON.stringify(data);
  var xhr = new XMLHttpRequest();
  xhr.open("POST", `/posts/${$("#edit-link").data("post-id")}/edit`);
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.send(json);
};
