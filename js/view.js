
var hoverflag = false, clickflag = false
var mouseX = 0, mouseY = 0;
var campos = new Float32Array([0.0, 0.0, 0.0]);
var camangle = new Float32Array([0.0, 0.0, 0.0]);



document.addEventListener('keydown', function(event) {
    if (event.keyCode == 87) { // w
        console.log("debugforward")
        campos[0] -= Math.cos(degToRad(camangle[0])) * Math.sin(degToRad(camangle[1]))
        campos[2] -= Math.cos(degToRad(camangle[0])) * Math.cos(degToRad(camangle[1]))
    }
    if (event.keyCode == 83) { // s
        console.log("debugbackward")
        campos[0] += Math.cos(degToRad(camangle[0])) * Math.sin(degToRad(camangle[1]))
        campos[2] += Math.cos(degToRad(camangle[0])) * Math.cos(degToRad(camangle[1]))
    }
    if (event.keyCode == 65) { // a
        console.log("debugleft")
        campos[2] += Math.cos(degToRad(camangle[0])) * Math.sin(degToRad(camangle[1]))
        campos[0] -= Math.cos(degToRad(camangle[0])) * Math.cos(degToRad(camangle[1]))
    }
    if (event.keyCode == 68) { // d
        console.log("debugright")
        campos[2] -= Math.cos(degToRad(camangle[0])) * Math.sin(degToRad(camangle[1]))
        campos[0] += Math.cos(degToRad(camangle[0])) * Math.cos(degToRad(camangle[1]))
    }
    if (event.keyCode == 32) { // space
        console.log("debugup")
        campos[1] += 1
    }
    if (event.keyCode == 16) { // left shift
        console.log("debugdown")
        campos[1] += -1
    }
    if (event.keyCode == 84) { // t
        console.log("debugupturn")
        camangle[0] += +1
    }
    if (event.keyCode == 71) { // g
        console.log("debugdownturn")
        camangle[0] += -1
    }
    if (event.keyCode == 70) { // f
        console.log("debuglefturn")
        camangle[1] += 1
    }
    if (event.keyCode == 72) { // h
        console.log("debugrightturn")
        camangle[1] += -1
    }

}, true);

document.getElementById("ICG-canvas").addEventListener('mouseenter', () => {
  hoverflag = true
});
document.getElementById("ICG-canvas").addEventListener('mouseleave', () => {
  hoverflag = false
});

document.addEventListener('mousedown', () => {
    clickflag = true
});

document.addEventListener('mouseup', () => {
    clickflag = false
});

// from https://stackoverflow.com/questions/22559830/html-prevent-space-bar-from-scrolling-page
window.addEventListener('keydown', function(e) {
    if(e.keyCode == 32 && e.target == document.body) {
      e.preventDefault();
    }
});

mousemovemethod = function (e) {
    if(hoverflag && clickflag) {
        camangle[1] -= (e.pageX - mouseX) / 10
        if(camangle[0] - (e.pageY - mouseY) / 10 < 45 && camangle[0] - (e.pageY - mouseY) / 10 > -45)
            camangle[0] -= (e.pageY - mouseY) / 10
        console.log(camangle)
    }
    mouseX = e.pageX;
    mouseY = e.pageY;
}

document.addEventListener('mousemove', mousemovemethod);