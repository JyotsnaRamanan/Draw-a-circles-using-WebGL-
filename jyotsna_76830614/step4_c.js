
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

var flag = false;
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
    ball.color = vec4(Math.random(),Math.random(),Math.random(), 1.0);
    
    //random velocity
    ball.velocity = vec2(0.0, 0.0);
    //ball.velocity[0] *= 0.0;
    //ball.velocity[1] *= 0.01;    
    
    return ball;
}

// change the velocity direction if the ball hits the boundary  
function collision_boundary(ball) 
{

  if(ball.vertices[0][0] >=1 ||    ball.vertices[1][0] >=1 ||    ball.vertices[2][0] >=1 ||    ball.vertices[3][0] >=1 ||    ball.vertices[4][0] >=1 ||    ball.vertices[5][0] >=1 ){
        return [true,true];
    }else if (    ball.vertices[0][1] >=1 ||    ball.vertices[1][1] >=1 ||    ball.vertices[2][1] >=1 ||    ball.vertices[3][1] >=1 ||    ball.vertices[4][1] >=1 ||    ball.vertices[5][1] >=1 ) {
        return [true,false];
    }
    else if (ball.vertices[0][0]<=-1 ||    ball.vertices[1][0]<=-1 ||    ball.vertices[2][0]<=-1 ||    ball.vertices[3][0]<=-1 ||    ball.vertices[4][0]<=-1 ||    ball.vertices[5][0]<=-1 ){
        return [true,true];
    }

    else if(ball.vertices[0][1]<=-1 ||    ball.vertices[1][1]<=-1 ||    ball.vertices[2][1]<=-1 ||    ball.vertices[3][1]<=-1 ||    ball.vertices[4][1]<=-1 ||    ball.vertices[5][1]<=-1){
        return [true,false];
    }
    
return [false,false];
}


// update the position or size of the balls
function update_balls()
{

	//console.log("in update");
	//change the size of a new ball if pressing the left button
    if(flag)
    {
        g_balls[g_curballnum-1].radius += 0.01;
        if(g_balls[g_curballnum-1].radius >= g_maxradius){
            flag = false;
        }
        for(var i = g_dat_radius.length-1; i>g_dat_radius.length-7; --i){
          g_dat_radius[i]= g_balls[g_curballnum-1].radius;   
        }
        
        gl.bindBuffer(gl.ARRAY_BUFFER, g_vbo_radius);
        gl.bufferSubData(gl.ARRAY_BUFFER, 0, flatten(g_dat_radius));       
    }
	//or advect the ball according to the ball's velocity
	for (i=0;i<g_curballnum;i++){
		//console.log("before");
		//console.log(g_balls[i]);

		g_balls[i].center[0] += (g_balls[i].velocity[0]*0.9);
		g_balls[i].center[1] += (g_balls[i].velocity[1]*0.9);
		
		
		g_balls[i].vertices[0] = vec2(g_balls[i].center[0] - g_balls[i].radius, g_balls[i].center[1] - g_balls[i].radius);
		g_balls[i].vertices[1] = vec2(g_balls[i].center[0] + g_balls[i].radius, g_balls[i].center[1] - g_balls[i].radius);
		g_balls[i].vertices[2] = vec2(g_balls[i].center[0] + g_balls[i].radius, g_balls[i].center[1] + g_balls[i].radius);
		g_balls[i].vertices[3] = vec2(g_balls[i].center[0] - g_balls[i].radius, g_balls[i].center[1] + g_balls[i].radius);
		g_balls[i].vertices[4] = vec2(g_balls[i].center[0] - g_balls[i].radius, g_balls[i].center[1] - g_balls[i].radius);
		g_balls[i].vertices[5] = vec2(g_balls[i].center[0] + g_balls[i].radius, g_balls[i].center[1] + g_balls[i].radius);  

        collisionDetection = collision_boundary(g_balls[i]);
        if(collisionDetection[0]){

            if (collisionDetection[1]){
                g_balls[i].velocity[0] = g_balls[i].velocity[0]*-1  ;  
            }else{
                g_balls[i].velocity[1] = g_balls[i].velocity[1]*-1 ; 
            }
            
            

        }

		//console.log("after");
		//console.log(g_balls[i]);
	}
	
	
	
	//ball.center = ball.center + ball.velocity * 100;
	//console.log(ball[0].center);
	//ball.vertices = [];

	
	//call collision_boundary


	g_dat_centers   = [];
	g_dat_points = [];

	for (var b = 0; b < g_curballnum; b++) {
        var ball = g_balls[b];
        for (var i = 0; i < 6; i++) {
            g_dat_points.push(ball.vertices[i]);
            //g_dat_colors.push(ball.color);
            g_dat_centers.push(ball.center);
            //g_dat_radius.push(ball.radius);            
        }
    }   
	
	    //update VBOs
	gl.bindBuffer(gl.ARRAY_BUFFER, g_vbo_centers);
	gl.bufferSubData(gl.ARRAY_BUFFER, 0, flatten(g_dat_centers));  
	
	gl.bindBuffer(gl.ARRAY_BUFFER, g_vbo_points);
    gl.bufferSubData(gl.ARRAY_BUFFER, 0, flatten(g_dat_points));
    
	
}

window.onload = function init()
{
    var canvas = document.getElementById("gl-canvas");
    //numofBalls = 10;
    gl = WebGLUtils.setupWebGL(canvas);
    if (!gl) { 
        alert( "WebGL isn't available" ); 
    }
        
    //initialize the array of balls     
    g_balls = [];    
  /*  
    //create an initial ball
    var ball = new_ball(0, 0, g_minradius);
    var ball1 = new_ball(0.9, 0, g_minradius);
    var ball2 = new_ball(0, 0.9, g_minradius);
    var ball3 = new_ball(0.5, 0.5, g_minradius);

    g_balls.push(ball);
    g_balls.push(ball1);
    g_balls.push(ball2);
    g_balls.push(ball3);*/

   /* for (var i = numofBalls; i >= 0; i--) {
        ball = new_ball(Math.random(),Math.random(),g_minradius);
        g_balls.push(ball);
    };*/



    g_curballnum = g_balls.length; 

    //initialize the data arrays
    g_dat_points    = [];
    g_dat_colors    = [];
    g_dat_centers   = [];
    g_dat_radius    = [];    
    
	//console.log(ball);
	
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

    //var interval;
   canvas.addEventListener("mousedown", function(e){
    var event = e || window.event;
    var x = event.clientX;
    var y = event.clientY;
    //document.getElementById("client").innerHTML = "Client: (" +event.clientX + "," + event.clientY+ ")";

   var client_x_r = event.clientX - this.offsetLeft;
   var client_y_r = event.clientY - this.offsetTop;

   var clip_x = -1 +2 * client_x_r/this.width;
   var clip_y = -1 +2 * (this.height - client_y_r)/this.height;
   //console.log("hello");
   //console.log(clip_x,clip_y);

    ball = new_ball(clip_x, clip_y, g_minradius);
    g_balls.push(ball);
    g_curballnum = g_balls.length;
    console.log(g_balls);
     for (var i = 0; i < 6; i++) {
            g_dat_points.push(ball.vertices[i]);
            g_dat_colors.push(ball.color);
            g_dat_centers.push(ball.center);
            g_dat_radius.push(ball.radius);            
        }
   
    gl.bindBuffer(gl.ARRAY_BUFFER, g_vbo_points); 
    gl.bufferSubData(gl.ARRAY_BUFFER, 0, flatten(g_dat_points));

    gl.bindBuffer(gl.ARRAY_BUFFER, g_vbo_colors); 
    gl.bufferSubData(gl.ARRAY_BUFFER, 0, flatten(g_dat_colors));    


    gl.bindBuffer(gl.ARRAY_BUFFER, g_vbo_centers);
    gl.bufferSubData(gl.ARRAY_BUFFER, 0, flatten(g_dat_centers));    
    
    gl.bindBuffer(gl.ARRAY_BUFFER, g_vbo_radius);
    gl.bufferSubData(gl.ARRAY_BUFFER, 0, flatten(g_dat_radius));    
    
    flag = true;


   });

        //create a new ball under the current mouse position if pressing the left button  
     //   startTime = new Date().getTime();

        
        //create a new ball here with scaleX(e.clientX)+"   "+scaleY(e.clientY) and minRadius
        //Render the ball here

       // interval = setInterval(function(){
            
          /*   console.log(scaleX(e.clientX)+"   "+scaleY(e.clientY)+"     "+ (   (new Date().getTime())-startTime ) /3000  );
             timeRadius =  (new Date().getTime())-startTime ) /3000
             if g_maxradius <= timeRadius {
                //ball radius = timeRadius
             }else{
                //ball radius = g_maxradius
             }

             // animframe

        }, 100);


    } );*/
    
    canvas.addEventListener("mouseup", function(e){
        // finish the expansion of the new ball if the left button is released
        //clearInterval(interval);
        flag = false;


    });

};
/*
function performWhileMouseDown(){
   
}

function scaleX(OldValue){
    NewValue = (((OldValue - 0) * (1 - (-1)) / (512 - 0)) + (-1));
    return NewValue;
}

function scaleY(OldValue){
   NewValue = (((OldValue - 0) * (1 - (-1)) / (512 - 0)) + (-1));
    return NewValue;}*/


function render() 
{  
	//console.log("in render");
    //setTimeout(function()
	//{
	
	gl.clear( gl.COLOR_BUFFER_BIT );        
    gl.drawArrays( gl.TRIANGLES, 0, 6*g_curballnum); 
	update_balls();
	requestAnimFrame(render);
	
	//}, 100);
}