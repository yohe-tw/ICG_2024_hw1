// common variables
var gl;
var shaderProgram = {};

var Buffer = {"Teapot" : {},
              "Csie"   : {},
              "Mig27"  : {},
              "Church_s": {}};
var teapotAngle = 180;
var lastTime    = 0;


// global param
var light1_locations = new Float32Array([30., 20., -25.]);
var light2_locations = new Float32Array([-30., 20., -25.]);
var light3_locations = new Float32Array([0., 20., -75.]);
var light1_color = new Float32Array([1.0, 0.0, 1.0]);
var light2_color = new Float32Array([0.0, 1.0, 1.0]);
var light3_color = new Float32Array([1.0, 1.0, 0.0]);
var backgroundcolor = new Float32Array([0.0, 0.0, 0.0]);
var clipping = 150

// local param
var mvMatrix = [mat4.create(), mat4.create(), mat4.create()];
var pMatrix  = mat4.create();
var ka = [0.1, 0.1, 0.1], kd = [0.6, 0.6, 0.6], ks = [0.4, 0.4, 0.4];
var tx = [-30, 0, 30], ty = [0, 0, 0], tz = [0, 0, 0]
var rx = [0, 0, 0], ry = [0, 0, 0], rz = [0, 0, 0]
var sx = [1, 1, 1], sy = [1, 1, 1], sz = [1, 1, 1]
var sh = [0, 0, 0] // shear
var shader = ["gouraud", "gouraud", "gouraud"]
var object = ["Teapot", "Teapot", "Teapot"]



//*************************************************
// Initialization functions
//*************************************************
function initGL(canvas) {
    try {
        gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
        gl.getExtension('OES_standard_derivatives');
        gl.viewportWidth  = canvas.width;
        gl.viewportHeight = canvas.height;
    } 
    catch (e) {
    }

    if (!gl) {
        alert("Could not initialise WebGL");
    }
}

function getProgram(gl, vertex_source, fragment_source) {
    
    var fragment_shader = gl.createShader(gl.FRAGMENT_SHADER);
    var vertex_shader = gl.createShader(gl.VERTEX_SHADER);

    gl.shaderSource(fragment_shader, fragment_source);
    gl.compileShader(fragment_shader);
    gl.shaderSource(vertex_shader, vertex_source);
    gl.compileShader(vertex_shader);

    if (!gl.getShaderParameter(fragment_shader, gl.COMPILE_STATUS) || !gl.getShaderParameter(vertex_shader, gl.COMPILE_STATUS)) {
        alert(gl.getShaderInfoLog(vertex_shader));
        alert(gl.getShaderInfoLog(fragment_shader));
        return null;
    }

    var program = gl.createProgram();
    gl.attachShader(program, vertex_shader);
    gl.attachShader(program, fragment_shader);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        alert("Could not initialise shaders");
    }
    return program;
}

function initShaders() {
    
    shaderProgram = {"flat"    : getProgram(gl, flat_vertex, flat_fragment), 
                     "gouraud" : getProgram(gl, gouraud_vertex, gouraud_fragment), 
                     "phong"   : getProgram(gl, phong_vertex, phong_fragment), 
                     "toon"    : getProgram(gl, toon_vertex, toon_fragment)}
    
    for (var key in shaderProgram) {
        shaderProgram[key].vertexPositionAttribute = gl.getAttribLocation(shaderProgram[key], "aVertexPosition");
        gl.enableVertexAttribArray(shaderProgram[key].vertexPositionAttribute);
        shaderProgram[key].vertexFrontColorAttribute = gl.getAttribLocation(shaderProgram[key], "aFrontColor");
        gl.enableVertexAttribArray(shaderProgram[key].vertexFrontColorAttribute);
        if(key != 'flat') { 
            shaderProgram[key].vertexNormalAttribute = gl.getAttribLocation(shaderProgram[key], "aVertexNormal");
            gl.enableVertexAttribArray(shaderProgram[key].vertexNormalAttribute);
        }
        
        console.log(shaderProgram[key])
        shaderProgram[key].pMatrixUniform  = gl.getUniformLocation(shaderProgram[key], "uPMatrix");
        shaderProgram[key].mvMatrixUniform = gl.getUniformLocation(shaderProgram[key], "uMVMatrix");
    }
}

function setMatrixUniforms(i) {
    gl.uniformMatrix4fv(shaderProgram[shader[i]].pMatrixUniform, false, pMatrix);
    gl.uniformMatrix4fv(shaderProgram[shader[i]].mvMatrixUniform, false, mvMatrix[i]);
}

function degToRad(degrees) {
    return degrees * Math.PI / 180;
}

function handleLoadedTeapot(BufferData, object) {

    Buffer[object].teapotVertexPositionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, Buffer[object].teapotVertexPositionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(BufferData.vertexPositions), gl.STATIC_DRAW);
    Buffer[object].teapotVertexPositionBuffer.itemSize = 3;
    Buffer[object].teapotVertexPositionBuffer.numItems = BufferData.vertexPositions.length / 3;

    Buffer[object].teapotVertexNormalBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, Buffer[object].teapotVertexNormalBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(BufferData.vertexNormals), gl.STATIC_DRAW);
    Buffer[object].teapotVertexNormalBuffer.itemSize = 3;
    Buffer[object].teapotVertexNormalBuffer.numItems = BufferData.vertexNormals.length / 3;

    Buffer[object].teapotVertexFrontColorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, Buffer[object].teapotVertexFrontColorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(BufferData.vertexFrontcolors), gl.STATIC_DRAW);
    Buffer[object].teapotVertexFrontColorBuffer.itemSize = 3;
    Buffer[object].teapotVertexFrontColorBuffer.numItems = BufferData.vertexFrontcolors.length / 3;
}

function loadObject(object) {
    var request = new XMLHttpRequest();
    request.open("GET", `./model/${object}.json`);
    request.onreadystatechange = function () {
        if (request.readyState == 4) {console.log(object)
            handleLoadedTeapot(JSON.parse(request.responseText), object);
            console.log(Buffer)
        }
    }
    request.send();
}


//*************************************************
// Rendering functions
//*************************************************
/*
    TODO HERE:
    add two or more objects showing on the canvas
    (it needs at least three objects showing at the same time)
*/
function drawScene() {
    update_background_color();
    update_light_color();
    gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
    gl.clearColor(backgroundcolor[0], backgroundcolor[1], backgroundcolor[2], 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);/*
    for(var item in Buffer) {
        if (item.teapotVertexPositionBuffer   == null || 
            item.teapotVertexNormalBuffer     == null || 
            item.teapotVertexFrontColorBuffer == null) {
            
            return;
        }
    }
    console.log("debug")*/
    

    // Setup Projection Matrix
    mat4.perspective(45, gl.viewportWidth / gl.viewportHeight, 0.1, Number(clipping), pMatrix);


    // Setup Viewing Matrix
    var vMatrix  = mat4.create();
    mat4.identity(vMatrix);
    mat4.translate(vMatrix, vec3.create(campos))
    var rotateVec_init = [0,0,0];
    mat4.rotate(vMatrix, degToRad(rotateVec_init[0]), [1, 0, 0]);
    mat4.rotate(vMatrix, degToRad(rotateVec_init[1]), [0, 1, 0]);
    mat4.rotate(vMatrix, degToRad(rotateVec_init[2]), [0, 0, 1]);
    
    var rotateVec = vec3.create(camangle);
    mat4.rotate(vMatrix, degToRad(rotateVec[1]), [0, 1, 0]);
    mat4.rotate(vMatrix, degToRad(rotateVec[0]), [1, 0, 0]);
    mat4.rotate(vMatrix, degToRad(rotateVec[2]), [0, 0, 1]);

    mat4.inverse(vMatrix, vMatrix);
    mat4.multiply(pMatrix, vMatrix, pMatrix)



    update_trans();
    update_scale();
    update_rotate();
    update_shader();
    update_object();
    for(var i = 0; i < 3; i++) {
        if (!Buffer[object[i]].teapotVertexPositionBuffer) {
            return ;
        }

        // Setup Model-View Matrix
        mat4.identity(mvMatrix[i]);
        mat4.translate(mvMatrix[i], [0,0,0]);
        mat4.translate(mvMatrix[i], vec3.create([tx[i], ty[i], tz[i]]));
        mat4.scale(mvMatrix[i], vec3.create([sx[i], sy[i], sz[i]]));
        mvMatrix[i][1] = 1 / Math.tan(degToRad(update_shear()[i])); // shear
        
        var rotateVec_init = [0,0,0];
        mat4.rotate(mvMatrix[i], degToRad(rotateVec_init[0]), [1, 0, 0]);
        mat4.rotate(mvMatrix[i], degToRad(rotateVec_init[1]), [0, 1, 0]);
        mat4.rotate(mvMatrix[i], degToRad(rotateVec_init[2]), [0, 0, 1]);
        
        var rotateVec = vec3.create([rx[i], ry[i], rz[i]]);
        mat4.rotate(mvMatrix[i], degToRad(rotateVec[0]), [1, 0, 0]);
        mat4.rotate(mvMatrix[i], degToRad(rotateVec[1] + teapotAngle), [0, 1, 0]);
        mat4.rotate(mvMatrix[i], degToRad(rotateVec[2]), [0, 0, 1]);
        
        gl.useProgram(shaderProgram[shader[i]]);
        setMatrixUniforms(i);
        
        // Setup teapot position data
        gl.bindBuffer(gl.ARRAY_BUFFER, Buffer[object[i]].teapotVertexPositionBuffer);
        gl.vertexAttribPointer(shaderProgram[shader[i]].vertexPositionAttribute, 
                                Buffer[object[i]].teapotVertexPositionBuffer.itemSize, 
                                gl.FLOAT, 
                                false, 
                                0, 
                                0);
    
        // Setup teapot front color data
        gl.bindBuffer(gl.ARRAY_BUFFER, Buffer[object[i]].teapotVertexFrontColorBuffer);
        gl.vertexAttribPointer(shaderProgram[shader[i]].vertexFrontColorAttribute, 
                                Buffer[object[i]].teapotVertexFrontColorBuffer.itemSize, 
                                gl.FLOAT, 
                                false, 
                                0, 
                                0);
        
        // Setup teapot normal data
        if(shader[i] != 'flat') {
            console.log("not flat")
            gl.bindBuffer(gl.ARRAY_BUFFER, Buffer[object[i]].teapotVertexNormalBuffer);
            gl.vertexAttribPointer(shaderProgram[shader[i]].vertexNormalAttribute, 
                                    Buffer[object[i]].teapotVertexNormalBuffer.itemSize, 
                                    gl.FLOAT, 
                                    false, 
                                    0, 
                                    0);    
        }
        
    
        // Setup ambient light and light position
        gl.uniform1f(gl.getUniformLocation(shaderProgram[shader[i]], "ka"), ka[i]);
        gl.uniform1f(gl.getUniformLocation(shaderProgram[shader[i]], "kd"), kd[i]);
        gl.uniform1f(gl.getUniformLocation(shaderProgram[shader[i]], "ks"), ks[i]);
        gl.uniform3fv(gl.getUniformLocation(shaderProgram[shader[i]], "light1Loc"), light1_locations);
        gl.uniform3fv(gl.getUniformLocation(shaderProgram[shader[i]], "light2Loc"), light2_locations);
        gl.uniform3fv(gl.getUniformLocation(shaderProgram[shader[i]], "light3Loc"), light3_locations);
        gl.uniform3fv(gl.getUniformLocation(shaderProgram[shader[i]], "light1Color"), light1_color);
        gl.uniform3fv(gl.getUniformLocation(shaderProgram[shader[i]], "light2Color"), light2_color);
        gl.uniform3fv(gl.getUniformLocation(shaderProgram[shader[i]], "light3Color"), light3_color);
    
        gl.drawArrays(gl.TRIANGLES, 0, Buffer[object[i]].teapotVertexPositionBuffer.numItems);
    }
    console.log(tx, ty, tz)
}

function animate() {
    var timeNow = new Date().getTime();
    if (lastTime != 0) {
        var elapsed = timeNow - lastTime;
        teapotAngle += 0.03 * elapsed;
    }
    
    lastTime = timeNow;
}

function tick() {
    requestAnimFrame(tick);
    drawScene();
    animate();
}

function webGLStart() {
    var canvas = document.getElementById("ICG-canvas");
    initGL(canvas);
    initShaders();
    for(key in Buffer) loadObject(key);

    gl.clearColor(ka, ka, ka, 1.0);
    gl.enable(gl.DEPTH_TEST);

    tick();
}


//*************************************************
// Parsing parameters
//*************************************************

function update_light_location(){
    light1_locations[0] = document.getElementById("l1locX").value;
    light1_locations[1] = document.getElementById("l1locY").value;
    light1_locations[2] = document.getElementById("l1locZ").value;
    light2_locations[0] = document.getElementById("l2locX").value;
    light2_locations[1] = document.getElementById("l2locY").value;
    light2_locations[2] = document.getElementById("l2locZ").value;
    light3_locations[0] = document.getElementById("l3locX").value;
    light3_locations[1] = document.getElementById("l3locY").value;
    light3_locations[2] = document.getElementById("l3locZ").value;
}

function update_trans(){
    var tx1 = document.getElementById("transX1").value;
    var ty1 = document.getElementById("transY1").value;
    var tz1 = document.getElementById("transZ1").value;
    var tx2 = document.getElementById("transX2").value;
    var ty2 = document.getElementById("transY2").value;
    var tz2 = document.getElementById("transZ2").value;
    var tx3 = document.getElementById("transX3").value;
    var ty3 = document.getElementById("transY3").value;
    var tz3 = document.getElementById("transZ3").value;
    tx = [tx1, tx2, tx3];
    ty = [ty1, ty2, ty3];
    tz = [tz1, tz2, tz3];
}

function update_scale() {
    var sx1 = document.getElementById("scaleX1").value;
    var sy1 = document.getElementById("scaleY1").value;
    var sz1 = document.getElementById("scaleZ1").value;
    var sx2 = document.getElementById("scaleX2").value;
    var sy2 = document.getElementById("scaleY2").value;
    var sz2 = document.getElementById("scaleZ2").value;
    var sx3 = document.getElementById("scaleX3").value;
    var sy3 = document.getElementById("scaleY3").value;
    var sz3 = document.getElementById("scaleZ3").value;
    sx = [sx1, sx2, sx3];
    sy = [sy1, sy2, sy3];
    sz = [sz1, sz2, sz3];
}

function update_rotate(){
    var rx1 = document.getElementById("rotateX1").value;
    var ry1 = document.getElementById("rotateY1").value;
    var rz1 = document.getElementById("rotateZ1").value;
    var rx2 = document.getElementById("rotateX2").value;
    var ry2 = document.getElementById("rotateY2").value;
    var rz2 = document.getElementById("rotateZ2").value;
    var rx3 = document.getElementById("rotateX3").value;
    var ry3 = document.getElementById("rotateY3").value;
    var rz3 = document.getElementById("rotateZ3").value;
    rx = [rx1, rx2, rx3];
    ry = [ry1, ry2, ry3];
    rz = [rz1, rz2, rz3];
}

function update_shear(){
    var value1 = document.getElementById("shear1").value;
    var value2 = document.getElementById("shear2").value;
    var value3 = document.getElementById("shear3").value;
    return [value1, value2, value3]
}

function update_shader() {
    var shader1 = document.getElementById("shader1").value;
    var shader2 = document.getElementById("shader2").value;
    var shader3 = document.getElementById("shader3").value;
    shader = [shader1, shader2, shader3]
}

function update_object() {
    var object1 = document.getElementById("object1").value;
    var object2 = document.getElementById("object2").value;
    var object3 = document.getElementById("object3").value;
    object = [object1, object2, object3]
}

function update_k() {
    ka[0] = document.getElementById("ka1").value;
    kd[0] = document.getElementById("kd1").value;
    ks[0] = document.getElementById("ks1").value;
    ka[1] = document.getElementById("ka2").value;
    kd[1] = document.getElementById("kd2").value;
    ks[1] = document.getElementById("ks2").value;
    ka[2] = document.getElementById("ka3").value;
    kd[2] = document.getElementById("kd3").value;
    ks[2] = document.getElementById("ks3").value;
}

function update_background_color() {
    var r = document.getElementById("backR").value;
    var g = document.getElementById("backG").value;
    var b = document.getElementById("backB").value;
    backgroundcolor = [r / 255, g / 255, b / 255]
}

function update_light_color() {
    var r1 = document.getElementById("l1colorX").value;
    var g1 = document.getElementById("l1colorY").value;
    var b1 = document.getElementById("l1colorZ").value;
    var r2 = document.getElementById("l2colorX").value;
    var g2 = document.getElementById("l2colorY").value;
    var b2 = document.getElementById("l2colorZ").value;
    var r3 = document.getElementById("l3colorX").value;
    var g3 = document.getElementById("l3colorY").value;
    var b3 = document.getElementById("l3colorZ").value;
    light1_color = [r1 / 255, g1 / 255, b1 / 255]
    light2_color = [r2 / 255, g2 / 255, b2 / 255]
    light3_color = [r3 / 255, g3 / 255, b3 / 255]
    document.getElementById("light1colorbackground").style.background = `rgb(${light1_color[0] * 255}, ${light1_color[1] * 255}, ${light1_color[2] * 255})`;
    document.getElementById("light2colorbackground").style.background = `rgb(${light2_color[0] * 255}, ${light2_color[1] * 255}, ${light2_color[2] * 255})`;
    document.getElementById("light3colorbackground").style.background = `rgb(${light3_color[0] * 255}, ${light3_color[1] * 255}, ${light3_color[2] * 255})`;
}

function update_clip() {
    clipping = document.getElementById("3dclip").value
}




