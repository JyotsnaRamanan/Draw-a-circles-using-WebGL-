
var gl;

// the maximum number of balls
var g_maxballnum = 100;

// the number of balls
var g_curballnum = 0;

// the ball array 
var g_balls;

// the data arrays uploaded to VBOs
var g_dat_points;
var g_dat_colors;
var g_dat_centers;
var g_dat_radius;

// the vertex buffer objects (VBOs)
var g_vbo_points;
var g_vbo_bufcolors;
var g_vbo_bufcenters;
var g_vbo_radius;

// the program object
var g_program;

// the minimal and maximal radius 
var g_minradius = 0.05;
var g_maxradius = 0.5;

// creat a new 2D ball where the center is (x, y) and the radius
function new_ball(x, y, radius) 
{
    var ball = new Object();
    
    ball.center = vec2(x, y);
    ball.radius = radius;
    
    ball.vertices = [];
    
    ball.vertices[0] = vec2(ball.center[0] - ball.radius, ball.center[1] - ball.radius);
    ball.vertices[1] = vec2(ball.center[0] + ball.radius, ball.center[1] - ball.radius);
    ball.vertices[2] = vec2(ball.center[0] + ball.radius, ball.center[1] + ball.radius);
    ball.vertices[3] = vec2(ball.center[0] - ball.radius, ball.center[1] + ball.radius);
    ball.vertices[4] = vec2(ball.center[0] - ball.radius, ball.center[1] - ball.radius);
    ball.vertices[5] = vec2(ball.center[0] + ball.radius, ball.center[1] + ball.radius);    

    //random color
    ball.color = vec4(0.0, 1.0, 0.0, 1.0);
    
    //random velocity
    ball.velocity = normalize(vec2(Math.random() - 0.5, Math.random() - 0.5));
    ball.velocity[0] *= 0.01;
    ball.velocity[1] *= 0.01;    
    
    return ball;
}

// change the velocity direction if the ball hits the boundary  
function collision_boundary(ball) 
{
    return false;
}


// update the position or size of the balls
function update_balls()
{
	//change the size of a new ball if pressing the left button

	//or advect the ball according to the ball's velocity

	//call collision_boundary

    //update VBOs
}

window.onload = function init()
{
    var canvas = document.getElementById("gl-canvas");
    
    gl = WebGLUtils.setupWebGL(canvas);
    if (!gl) { 
        alert( "WebGL isn't available" ); 
    }
        
    //initialize the array of balls     
    g_balls = [];    
    
    //create an initial ball
    var ball = new_ball(0, 0, 0.9);
    g_balls.push(ball);
    g_curballnum = g_balls.length; 

    //initialize the data arrays
    g_dat_points    = [];
    g_dat_colors    = [];
    g_dat_centers   = [];
    g_dat_radius    = [];    
    
    //fill the data arrays
    for (var b = 0; b < g_curballnum; b++) {
        var ball = g_balls[b];
        for (var i = 0; i < 6; i++) {
            g_dat_points.push(ball.vertices[i]);
            g_dat_colors.push(ball.color);
            g_dat_centers.push(ball.center);
            g_dat_radius.push(ball.radius);            
        }
    }   
    
    //  Configure WebGL
    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 0.8, 0.8, 0.8, 1.0 );
    
    // Enable blending
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    
    //  Load shaders and initialize attribute buffers    
    g_program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(g_program);
    
    // Create VBOs and load the data into the VBOs
    g_vbo_points = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, g_vbo_points);
    gl.bufferData(gl.ARRAY_BUFFER, g_maxballnum*6*2*4, gl.STATIC_DRAW);      
    gl.bufferSubData(gl.ARRAY_BUFFER, 0, flatten(g_dat_points));
    
    g_vbo_colors = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, g_vbo_colors); 
    gl.bufferData(gl.ARRAY_BUFFER, g_maxballnum*6*3*4, gl.STATIC_DRAW);  
    gl.bufferSubData(gl.ARRAY_BUFFER, 0, flatten(g_dat_colors));    
    
    g_vbo_centers = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, g_vbo_centers);
    gl.bufferData(gl.ARRAY_BUFFER, g_maxballnum*6*2*4, gl.STATIC_DRAW);
    gl.bufferSubData(gl.ARRAY_BUFFER, 0, flatten(g_dat_centers));    
    
    g_vbo_radius = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, g_vbo_radius);
    gl.bufferData(gl.ARRAY_BUFFER, g_maxballnum*6*4, gl.STATIC_DRAW);
    gl.bufferSubData(gl.ARRAY_BUFFER, 0, flatten(g_dat_radius));    
    
    // Associate out shader variables with our data buffer    
    var vPosition = gl.getAttribLocation(g_program, "vPosition");
    gl.bindBuffer(gl.ARRAY_BUFFER, g_vbo_points);      
    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

    var vColor = gl.getAttribLocation(g_program, "vColor");
    gl.bindBuffer(gl.ARRAY_BUFFER, g_vbo_colors);
    gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vColor);

    var vCenter = gl.getAttribLocation(g_program, "vCenter");
    gl.bindBuffer(gl.ARRAY_BUFFER, g_vbo_centers);
    gl.vertexAttribPointer(vCenter, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vCenter );

    var vRadius = gl.getAttribLocation(g_program, "vRadius");
    gl.bindBuffer(gl.ARRAY_BUFFER, g_vbo_radius);
    gl.vertexAttribPointer(vRadius, 1, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vRadius);

    render();
    
    canvas.addEventListener("mousedown", function(e){
        //create a new ball under the current mouse position if pressing the left button  
    } );
    
    canvas.addEventListener("mouseup", function(e){
        // finish the expansion of the new ball if the left button is released
    });

};



function render() 
{  
    gl.clear( gl.COLOR_BUFFER_BIT );        
    gl.drawArrays( gl.TRIANGLES, 0, 6*g_curballnum);            
 }