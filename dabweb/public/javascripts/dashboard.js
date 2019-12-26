console.log("dashboard script loaded");

window.onload = function() {
  //removes warning background color from this field when user presses a key
  var posts = document.getElementsByClassName("card-text");
  for (let post of posts) {
    /*
    let words = post.innerHTML.split(/\s+/).map(word => {
      //verifica se a palavra comeca com # e nao tem mais do que um #. Se sim, entao e uma hashtag
      // "#hashtag".split("#") => ["", "hashtag"] => size = 2
      // "#not#hashtag".split("#") => ["", "not", "hashtag"] => size = 3
      if (word.startsWith("#")) {
        word = `<a href="http://localhost:7777/hashtag/${word}">${word}</a>`;
      }
      return word;
    });
    */
    post.innerHTML = post.innerHTML.replace(
      /(#[A-z0-9]+)/g,
      '<a href="http://localhost:7777/hashtag/$1">$1</a>'
    );
    //post.innerHTML = words.join(" ");
  }
};
