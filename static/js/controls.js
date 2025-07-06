/* DEFAULT VALUES */
let slide = 1;
let code = "";
let presentation = "1fPdAfk9o9X_dQJnHMZgR_V992aJwRfs1rCZ4mCvfNmY";

/* SOCKET.IO CONNECTION */
const socket = io("https://next-slide-please.glitch.me"); // not an error

/* CHANGE SLIDES WHEN THE "NEXT" BUTTON IS PRESSED */
socket.on("updateSlides", data => {
  slide = data.slide;
  updateSlide();
});

/* PRESENTER CONTROLS */
$("#presentationInit").change(() => {
  let input = $("#presentationInit").val();
  $(".presentationURL").val(input); // there are a couple places this value can change, so we want them to match
  if (input.match(/\/d\/([A-Za-z0-9\-\_]+)/)) {
    $("body").css("background","#000000"); // theatre mode
    presentation = input.match(/\/d\/([A-Za-z0-9\-_]+)/)[1] || presentation; // if the input is not a valid Google Slides URL, ignore it
    if (code ==  "") { // If we are not already in a room, create a new one
      socket.emit("createRoom");
    }
  }
  updateSlide();
});

$("#presentationURL").change(() => {
  let input = $("#presentationURL").text();
  presentation = input.match(/\/d\/([A-Za-z0-9\-_]+)/)[1] || presentation; 
  slide = 1;
  socket.emit("goToSlide", { slide: slide, code: code });
  updateSlide();
});

/* VIEWER CONTROLS */
$(".next").click(() => {
  slide++;
  socket.emit("goToSlide", { slide: slide, code: code });
  updateSlide();
});

$(".prev").click(() => {
  slide = slide > 1 ? slide-1 : 1;
  socket.emit("goToSlide", { slide: slide, code: code });
  updateSlide();
});

$(".reset").click(() => {
  slide = 1;
  socket.emit("goToSlide", { slide: slide, code: code });
  updateSlide();
});

/* JOIN A UNIQUE ROOM WITH A 4-DIGIT CODE */
$("#inputRoomCode").change(() => {
  let input = $("#inputRoomCode").val();
  socket.emit("joinRoom", {
    code: input
  });
});

socket.on("goToRoom", data => {
  code = data.code;
  $(".roomCode").text(code);
  $(".intro").hide();
  $(".viewerControls").show();
  $(".presenterScreen").show();
  $(".presenterControls").show();
});

/* UTILITY FUNCTIONS */
const updateSlide = () => { 
  if (slide == 1) {
    $("#slideOdd").attr("src", `https://docs.google.com/presentation/d/${presentation}/preview?rm=minimal&slide=1`);
    $("#slideEven").attr("src", `https://docs.google.com/presentation/d/${presentation}/preview?rm=minimal&slide=2`);
  }
  if(slide%2 == 0) {
    $("#slideEven").removeClass("invisible");
    $("#slideOdd").addClass("invisible");
    $("#slideOdd").attr("src", `https://docs.google.com/presentation/d/${presentation}/preview?rm=minimal&slide=${slide+1}`);
  } else {
    $("#slideOdd").removeClass("invisible");
    $("#slideEven").addClass("invisible");
    $("#slideEven").attr("src", `https://docs.google.com/presentation/d/${presentation}/preview?rm=minimal&slide=${slide+1}`)
  } 
}