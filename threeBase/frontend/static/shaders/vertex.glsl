uniform float time;
varying vec2 vUv;
varying vec3 vPosition;
varying vec3 vNormal;
uniform sampler2D sky;

float PI = 3.141592653589793238;

void main(){
    vUv = uv;
    vNormal = normal;

    vec4 mvPosition = modelViewMatrix * vec4( position, 1.);
    gl_Position = projectionMatrix * mvPosition;
}