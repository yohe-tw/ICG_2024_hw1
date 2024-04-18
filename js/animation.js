var danceflag = false
const audio = new Audio('bgm.mp3');
let danceiter = 0;
let dancet = [[Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5], [Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5], [Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5]]
let dancer = [[Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5], [Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5], [Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5]]


function dancing() {
    if(danceflag) requestAnimFrame(dancing);    
    if(danceiter > 60) {
        dancet = [[Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5], [Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5], [Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5]]
        dancer = [[Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5], [Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5], [Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5]]
        danceiter = 0
    }
    let step = 1, rstep = 2, cstep = 10
    document.getElementById("transX1").value = String(step * dancet[0][0] + Number(document.getElementById("transX1").value))
    document.getElementById("transY1").value = String(step * dancet[0][1] + Number(document.getElementById("transY1").value))
    document.getElementById("transZ1").value = String(step * dancet[0][2] + Number(document.getElementById("transZ1").value))
    document.getElementById("transX2").value = String(step * dancet[1][0] + Number(document.getElementById("transX2").value))
    document.getElementById("transY2").value = String(step * dancet[1][1] + Number(document.getElementById("transY2").value))
    document.getElementById("transZ2").value = String(step * dancet[1][2] + Number(document.getElementById("transZ2").value))
    document.getElementById("transX3").value = String(step * dancet[2][0] + Number(document.getElementById("transX3").value))
    document.getElementById("transY3").value = String(step * dancet[2][1] + Number(document.getElementById("transY3").value))
    document.getElementById("transZ3").value = String(step * dancet[2][2] + Number(document.getElementById("transZ3").value))
    document.getElementById("rotateX1").value = String(rstep * dancer[0][0] + Number(document.getElementById("rotateX1").value))
    document.getElementById("rotateY1").value = String(rstep * dancer[0][1] + Number(document.getElementById("rotateY1").value))
    document.getElementById("rotateZ1").value = String(rstep * dancer[0][2] + Number(document.getElementById("rotateZ1").value))
    document.getElementById("rotateX2").value = String(rstep * dancer[1][0] + Number(document.getElementById("rotateX2").value))
    document.getElementById("rotateY2").value = String(rstep * dancer[1][1] + Number(document.getElementById("rotateY2").value))
    document.getElementById("rotateZ2").value = String(rstep * dancer[1][2] + Number(document.getElementById("rotateZ2").value))
    document.getElementById("rotateX3").value = String(rstep * dancer[2][0] + Number(document.getElementById("rotateX3").value))
    document.getElementById("rotateY3").value = String(rstep * dancer[2][1] + Number(document.getElementById("rotateY3").value))
    document.getElementById("rotateZ3").value = String(rstep * dancer[2][2] + Number(document.getElementById("rotateZ3").value))
    document.getElementById("l1colorX").value = String(cstep * dancer[0][0] + Number(document.getElementById("l1colorX").value))
    document.getElementById("l1colorY").value = String(cstep * dancer[0][1] + Number(document.getElementById("l1colorY").value))
    document.getElementById("l1colorZ").value = String(cstep * dancer[0][2] + Number(document.getElementById("l1colorZ").value))
    document.getElementById("l2colorX").value = String(cstep * dancer[1][0] + Number(document.getElementById("l2colorX").value))
    document.getElementById("l2colorY").value = String(cstep * dancer[1][1] + Number(document.getElementById("l2colorY").value))
    document.getElementById("l2colorZ").value = String(cstep * dancer[1][2] + Number(document.getElementById("l2colorZ").value))
    document.getElementById("l3colorX").value = String(cstep * dancer[2][0] + Number(document.getElementById("l3colorX").value))
    document.getElementById("l3colorY").value = String(cstep * dancer[2][1] + Number(document.getElementById("l3colorY").value))
    document.getElementById("l3colorZ").value = String(cstep * dancer[2][2] + Number(document.getElementById("l3colorZ").value))
    danceiter += 1
}


function reverse_danceflag() {
    danceflag = !danceflag
    if(danceflag) {
        audio.play();

        dancing();
    } else {
        audio.pause();
        audio.currentTime = 0;
    }
}