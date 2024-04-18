const gouraud_vertex = `
attribute vec3 aVertexPosition;
attribute vec3 aFrontColor;
attribute vec3 aVertexNormal;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;

// Ambient, diffuse and specular coef.
uniform float ka, kd, ks;
// light location (x,y,z)
uniform vec3 light1Loc, light2Loc, light3Loc;
uniform vec3 light1Color, light2Color, light3Color;

varying vec4 fragcolor;

void main(void) {

    // Transform VertexPosition and VertexNormal to world coordinate system
    vec3 mvVertex = (uMVMatrix * vec4(aVertexPosition, 1.0)).xyz;
    mat3 normalMVMatrix = mat3(uMVMatrix);
    vec3 mvNormal = normalMVMatrix * aVertexNormal;
    
    // V, N, L, H
    vec3 V = -normalize(mvVertex);
    vec3 N = normalize(mvNormal);
    vec3 L1 = normalize(light1Loc - mvVertex), L2 = normalize(light2Loc - mvVertex), L3 = normalize(light3Loc - mvVertex);
    vec3 H1 = normalize(L1 + V), H2 = normalize(L2 + V), H3 = normalize(L3 + V);
    
    // *TODO* 
    //  Finish the formula of ambient, diffuse and specular
    vec3 ambient = ka * aFrontColor;
    vec3 diffuse = light1Color * kd * aFrontColor * max(dot(N, L1), 0.0)
                 + light2Color * kd * aFrontColor * max(dot(N, L2), 0.0)
                 + light3Color * kd * aFrontColor * max(dot(N, L3), 0.0);
    vec3 specular = light1Color * ks * max(dot(N, H1), 0.0)
                  + light2Color * ks * max(dot(N, H2), 0.0)
                  + light3Color * ks * max(dot(N, H3), 0.0);
          
    vec3 gouraud = ambient + diffuse + specular;
    
    fragcolor = vec4(gouraud, 1.0);
    gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);
}
`

const gouraud_fragment = `
#extension GL_OES_standard_derivatives : enable
    
precision mediump float;

varying vec4 fragcolor;

void main(void) {
    gl_FragColor = fragcolor;
}
`