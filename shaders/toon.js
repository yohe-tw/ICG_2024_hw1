const toon_vertex = `
attribute vec3 aVertexPosition;
attribute vec3 aFrontColor;
attribute vec3 aVertexNormal;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;

varying vec3 fragcolor;
varying vec3 vertex_pos;
varying vec3 vertex_normal;

void main(void) {
    
    // Transform VertexPosition and VertexNormal to world coordinate system
    vec3 mvVertex = (uMVMatrix * vec4(aVertexPosition, 1.0)).xyz;
    mat3 normalMVMatrix = mat3(uMVMatrix);
    vec3 mvNormal = normalMVMatrix * aVertexNormal;
    vertex_normal = mvNormal;

    fragcolor = aFrontColor;
    vertex_pos = mvVertex;
    
    gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);
}
`

const toon_fragment = `
#extension GL_OES_standard_derivatives : enable
    
precision mediump float;

// Ambient, diffuse and specular coef.
uniform float ka, kd, ks;
// light location (x,y,z)
uniform vec3 light1Loc, light2Loc, light3Loc;
uniform vec3 light1Color, light2Color, light3Color;

varying vec3 fragcolor;
varying vec3 vertex_pos;
varying vec3 vertex_normal;

float cosine_convert(float cos) {
    if(cos > 0.9) cos = 1.0;
    else if(cos > 0.7) cos = 0.8;
    else if(cos > 0.4) cos = 0.5;
    else cos = 0.2;
    return cos;
}

void main(void) {

    // V, N, L, H
    vec3 V = -normalize(vertex_pos);
    vec3 N = normalize(vertex_normal);
    vec3 L1 = normalize(light1Loc - vertex_pos), L2 = normalize(light2Loc - vertex_pos), L3 = normalize(light3Loc - vertex_pos);
    vec3 H1 = normalize(L1 + V), H2 = normalize(L2 + V), H3 = normalize(L3 + V);
    
    // *TODO* 
    //  Finish the formula of ambient, diffuse and specular
    vec3 ambient = ka * fragcolor;

    vec3 diffuse = light1Color * kd * fragcolor * cosine_convert(dot(N, L1))
                 + light2Color * kd * fragcolor * cosine_convert(dot(N, L2))
                 + light3Color * kd * fragcolor * cosine_convert(dot(N, L3));
    vec3 specular = light1Color * ks * cosine_convert(dot(N, H1))
                  + light2Color * ks * cosine_convert(dot(N, H2))
                  + light3Color * ks * cosine_convert(dot(N, H3));
          
    vec3 flat_method = ambient + diffuse + specular;
    
    gl_FragColor = vec4(flat_method, 1.0);
}
`

