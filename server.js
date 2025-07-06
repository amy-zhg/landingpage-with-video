var express = require("express");
var app = express();
var server = require("http").createServer(app, {
  cors: {
    origin: `https://${process.env.PROJECT_DOMAIN}.glitch.me`,
    methods: ["GET", "POST"]
  }
});
var io = require("socket.io")(server);
var port = process.env.PORT || 3000;
app.use(express.static('static'));
app.set('view engine', 'pug');

var activeRooms = [];

// INDEX
app.get("/", (req, res) => {
  res.render('index');
});

// PRESENTER
app.get("/presenter", (req, res) => {
  res.render('presenter');
});

// VIEWER
app.get("/viewer", (req, res) => {
  res.render('viewer');
});

// SOCKET.IO CONNECTION
io.on("connection", socket => {
  
  // Create a new room for a new presentation
  socket.on("createRoom", data => {
    let code = makeRoomCode();
    while (thereIsARoomWithThisCode(code)) {
      code = makeRoomCode();
    }
    activeRooms.push({
      code: code,
      people: 1
    });
    socket.join(code);
    socket.emit("goToRoom", {
      code: code
    });
    console.log("Active Rooms:", activeRooms.length);
  });
  
  // Join existing room
  socket.on("joinRoom", data=> {
    let code = data.code.trim().toUpperCase();
    if (thereIsARoomWithThisCode(code) ) {
      socket.join(code);
      let newRoom = activeRooms.find(room => room.code == code);
      newRoom.people++;
      socket.emit("goToRoom", {
        code: code
      });
    } else {
      socket.emit("noRoomWithCode");
    }
  });
  
  // Update presentation when a "next" button is clicked in the same room
  socket.on("goToSlide", data => {
    socket.to(data.code).emit("updateSlides", {
      slide: data.slide
    });
  });

  // Track disconnects to clean up empty rooms
  socket.on('disconnect', () => {
    socket.rooms.forEach(conn => {
      let leaving = activeRooms.find(room => room.code == conn);
      leaving.people--;
    });
    cleanUpRooms();
  });
});

const makeRoomCode = () => {
  const alphabet = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"];
    let code = "";
    for (let i=0; i < 4; i++) {
      code += alphabet[Math.floor(Math.random()*alphabet.length)];
    }
  return code;
}

const thereIsARoomWithThisCode = (code) => {
  let matchingRooms = activeRooms.filter(room => room.code == code);
  return matchingRooms.length > 0;
}

const cleanUpRooms = () => {
  activeRooms = activeRooms.filter(room => room.people > 0);
  console.log("Active Rooms:", activeRooms.length);
}

// START LISTENING FOR REQUESTS
server.listen(port, () => {
  console.log("Your app is listening on port %d", port);
});
