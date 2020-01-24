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
  //var authorAt = $(e.relatedTarget).data("author-at");
  //console.log($("#edit-link").data("author-at"));
  //console.log($("#edit-link").data("group-at"));
  //console.log($("#edit-link").data("post-text"));
  console.log(
    $(this)
      .closest("div")
      .find("p")[0].textContent
  );
});
