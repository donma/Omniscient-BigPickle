document.addEventListener("DOMContentLoaded",function(){
  var hb=document.querySelector(".hamburger-btn");
  if(hb){hb.addEventListener("click",function(){
    this.classList.toggle("active");
    var lines=this.querySelectorAll(".hamburger-line");
    lines.forEach(function(l,i){
      if(this.classList.contains("active")){
        if(i===0){l.style.transform="rotate(45deg) translate(5px,6px)"}
        if(i===1){l.style.opacity="0"}
        if(i===2){l.style.transform="rotate(-45deg) translate(5px,-6px)"}
      }else{
        l.style.transform="";l.style.opacity=""
      }
    },this);
  })}
  var faqs=document.querySelectorAll(".faq-item");
  faqs.forEach(function(item){
    var q=item.querySelector(".faq-question");
    var a=item.querySelector(".faq-answer");
    if(q&&a){q.addEventListener("click",function(){
      a.classList.toggle("open");
      var arrow=q.querySelector(".arrow");
      if(arrow){arrow.classList.toggle("rotated")}
    })}
  })
  document.querySelectorAll("a[href^='#']").forEach(function(a){
    a.addEventListener("click",function(e){
      var t=document.querySelector(this.getAttribute("href"));
      if(t){e.preventDefault();t.scrollIntoView({behavior:"smooth",block:"start"})}
    })
  })
  var btt=document.createElement("button");
  btt.className="back-to-top";btt.innerHTML="\u2191";
  btt.setAttribute("aria-label","\u56de\u5230\u9802\u90e8");
  document.body.appendChild(btt);
  window.addEventListener("scroll",function(){
    if(window.scrollY>300){btt.classList.add("show")}else{btt.classList.remove("show")}
  })
  btt.addEventListener("click",function(){window.scrollTo({top:0,behavior:"smooth"})})
})
