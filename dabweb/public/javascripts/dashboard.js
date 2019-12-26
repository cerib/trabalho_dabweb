console.log("dashboard script loaded");

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
