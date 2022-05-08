export function CompileShader(gl, source, type) {
    let shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    let successful = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (!successful) {
        throw "Could not compile the shader found at " + source;
    }

    return shader;
}

export function CreateShaderProgram(gl, vertex_shader, fragment_shader) {
    let shader_program = gl.createProgram();

    gl.attachShader(shader_program, vertex_shader);
    gl.attachShader(shader_program, fragment_shader);

    gl.linkProgram(shader_program);

    let successful = gl.getProgramParameter(shader_program, gl.LINK_STATUS);

    if (!successful) {
        throw "Could not link shader program." + gl.getProgramInfoLog(shader_program);
    }

    return shader_program;
}