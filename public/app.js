// Define buttons
const startButtonFactorial = document.getElementById('factorialButton');
const startButtonExpensive = document.getElementById('expensiveButton');
const startButtonPrime = document.getElementById('primeButton');

// Define result field
const resultDiv = document.getElementById('result');

// Define inputs
const factorialInput = document.getElementById('factorialInput');
const expensiveInput = document.getElementById('expensiveInput');
const primeInput = document.getElementById('primeInput');

// WebGL setup for shaders
const canvas = document.getElementById('webglCanvas');
const gl = canvas.getContext('webgl');

// Handle error with WebGL
if (!gl)
{
    console.error("WebGL is not supported in your browser.");
}

// Define first WebGL shader
const vertexShaderSource = `
    attribute vec2 a_position;
    void main() {
        gl_Position = vec4(a_position, 0.0, 1.0);
    }
`;

// Define second WebGL shader
const fragmentShaderSource = `
    precision mediump float;
    uniform float u_time;
    void main() {
        float r = sin(u_time) * 0.5 + 0.5;
        float g = cos(u_time) * 0.5 + 0.5;
        float b = sin(u_time * 0.5) * 0.5 + 0.5;
        gl_FragColor = vec4(r, g, b, 1.0);
    }
`;

function compileShader(source, type)
{
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS))
    {
        console.error("ERROR compiling shader!", gl.getShaderInfoLog(shader));
        return null;
    }
    return shader;
}

const vertexShader = compileShader(vertexShaderSource, gl.VERTEX_SHADER);
const fragmentShader = compileShader(fragmentShaderSource, gl.FRAGMENT_SHADER);

const program = gl.createProgram();
gl.attachShader(program, vertexShader);
gl.attachShader(program, fragmentShader);
gl.linkProgram(program);
gl.useProgram(program);

const vertices = new Float32Array
([
    -1.0, -1.0,
     1.0, -1.0,
     0.0,  1.0,
]);

const positionBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

const positionLocation = gl.getAttribLocation(program, 'a_position');
gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
gl.enableVertexAttribArray(positionLocation);

const timeLocation = gl.getUniformLocation(program, 'u_time');

function render(time)
{
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.uniform1f(timeLocation, time * 0.001);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    
    requestAnimationFrame(render);
}

requestAnimationFrame(render);

// WebSocket client-side
const socket = new WebSocket('ws://localhost:3000');

socket.addEventListener('open', function (_event)
{
    console.log('Connected to WebSocket');
});

socket.addEventListener('message', function (event)
{
    console.log('Message from server:', event.data);
});

// Find the factorial of the number task
startButtonFactorial.addEventListener('click', () =>
{
    const value = parseInt(factorialInput.value);

    if (isNaN(value) || value < 0)
    {
        resultDiv.innerHTML = 'Please enter a valid positive number for factorial.';
        return;
    }

    fetch(`/start-task?task=factorial&value=${value}`)
        .then(response => response.json())
        .then(data => {
            resultDiv.innerHTML = `Factorial of ${value} is: ${data.result}`;
        })
        .catch(error => {
            resultDiv.innerHTML = 'Error: ' + error.message;
        });
});

// Calculate square root sum task
startButtonExpensive.addEventListener('click', () =>
{
    const value = parseInt(expensiveInput.value);

    if (isNaN(value) || value < 0)
    {
        resultDiv.innerHTML = 'Please enter a valid positive number for the calculation of the square root sum.';
        return;
    }

    fetch(`/start-task?task=expensive&value=${value}`)
        .then(response => response.json())
        .then(data => {
            resultDiv.innerHTML = `Square root sum task result for value ${value}: ${data.result}`;
        })
        .catch(error => {
            resultDiv.innerHTML = 'Error: ' + error.message;
        });
});

// Generate prime numbers task
startButtonPrime.addEventListener('click', () =>
{
    const value = parseInt(primeInput.value);

    if (isNaN(value) || value <= 1)
    {
        resultDiv.innerHTML = 'Please enter a valid positive number greater than 1 for prime numbers.';
        return;
    }
    
    fetch(`/start-task?task=prime&value=${value}`)
        .then(response => response.json())
        .then(data => {
            resultDiv.innerHTML = `Prime numbers up to ${value}: ${data.result.join(', ')}`;
        })
        .catch(error => {
            resultDiv.innerHTML = 'Error: ' + error.message;
        });
});
