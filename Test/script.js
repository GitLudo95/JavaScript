
(function r() {
  setTimeout(r, Math.random() * 1000);
  let el = document.createElement("div");
  el.innerHTML = "<img src='shoutout.jpg' class='thumb' />";
  el.style.position = `absolute`;
  el.style.zIndex = 999999;
  
  el.style.color='#'+(Math.random()*0xFFFFFF<<0).toString(16);
  el.style.fontSize = (((Math.random() * 48) | 0) + 16) + `px`;
  el.style.left = ((Math.random() * innerWidth) | 0) + `px`;
  el.style.top = ((Math.random() * (innerHeight + pageYOffset)) | 0) + `px`;
  document.body.appendChild(el);
})();