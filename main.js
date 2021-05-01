const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particlesArray;
let veloX =1;
let veloY =1;
let maxColor= 16777214;
let minColor= 0;
let rango;

// Get mouse position
let mouse = {
    x: null,
    y: null,
    radius: (canvas.height/80) * (canvas.width/80)
}

window.addEventListener('pointermove' , function(event){
    mouse.x = event.x;
    mouse.y = event.y;
/*    console.log(mouse.x + '<--X');
    console.log(mouse.y + '<--Y');*/
    } 
);
// Create particle

class Particle{
    constructor(x, y, directionX, directionY, size, color){
        this.x = x;
        this.y = y;
        this.directionX = directionX;
        this.directionY = directionY;
        this.size = size;
        this.color = color;
    }
    // Method to draw particles
    draw(){
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size,0,Math.PI * 2, false);
        ctx.fillStyle =this.color;//ctx.fillStyle = '#bfff00';
        //ctx.fillStyle = '#' + (Math.floor(Math.random()*16777215).toString(16));
        ctx.fill();
    }
    // Check position of particle and mouse , move and draw particle
    update(){
        // Check if particle is inside canvas limits
        if (this.x > canvas.width || this.x < 0 ) {
            this.directionX = -this.directionX ;
        }
        if (this.y > canvas.height || this.y < 0 ) {
            this.directionY = -this.directionY;
        }

        // Check collision mouse position/ particle position
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let distance = Math.sqrt( dx*dx + dy*dy );
        if(distance< mouse.radius + this.size){
            if(mouse.x < this.x && this.x < canvas.width - this.size * 10){
                this.x += 10;
            }
            if(mouse.x > this.x && this.x > this.size * 10){
                this.x -= 10;
            }
            if(mouse.y > this.y && this.y < canvas.height - this.size * 10){
                this.y +=10;
            }
            if(mouse.y > this.y && this.y > this.size * 10){
                this.y -= 10;
            }
        }
        // Move particle
        this.x += this.directionX/veloX;
        this.y += this.directionY/veloY;
        // Draw particle
        this.draw();

    }
}

// Create particle array
function init(hiColor,lowColor){
    let maxColor= hiColor;
    let minColor= lowColor;
    let rango = maxColor - minColor;
    //console.log(rango);

    particlesArray = [];
    let numberOfParticles = (canvas.height * canvas.width  ) /9000;
    for(let i = 0; i <numberOfParticles; i++){
        let size = (Math.random() * 8) + 1;
        let x = (Math.random() * ((innerWidth - size * 2) - (size * 2)) + size *2 );
        let y = (Math.random() * ((innerHeight - size * 2) - (size * 2)) + size *2 );
        let directionX = (Math.random() * 5) - 2.5;
        let directionY = (Math.random() * 5) - 2.5;
        let color = '#' + (Math.floor((Math.random()*rango) + minColor).toString(16));
        console.log("----->" + color);

        particlesArray.push(new Particle (x, y, directionX, directionY, size, color));
    }
}
// Animation loop
function animate(){
    requestAnimationFrame(animate);
    ctx.clearRect(0,0,innerWidth, innerHeight);

    for(let i  = 0 ; i < particlesArray.length; i++){
        particlesArray[i].update();

    }
    connect();
}

//let values = [];
function getRandomRgb() {
    var num = Math.round(0xffffff * Math.random());
    var r = num >> 16;
    var g = num >> 8 & 255;
    var b = num & 255;
    return 'rgba(' + r + ', ' + g + ', ' + b + ',';
}

// Check if particles are close to draw a line
function connect(){
    
    let opacityValue = 1;
    for(let a = 0; a < particlesArray.length; a++){
        for(let b = a; b < particlesArray.length; b++){
            let distance = (( particlesArray[a].x -particlesArray[b].x) * ( particlesArray[a].x -particlesArray[b].x))
                           +(( particlesArray[a].y -particlesArray[b].y) * ( particlesArray[a].y -particlesArray[b].y));
            if(distance < (canvas.width / 10) * (canvas.height / 10)){
                opacityValue = 1 - (distance/20000 * 2 );
                //values.push(opacityValue);
                ctx.strokeStyle = 'rgba(140, 85, 31,'+ opacityValue + ')';
                //ctx.strokeStyle = getRandomRgb() + opacityValue + ')';
                //ctx.strokeStyle = 'rgba('+a*3+','+b*5+','+ a*20 +','+ opacityValue + ')';
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                ctx.stroke();
            }
        }
    }
}
// Resize event
window.addEventListener('resize', 
    function(){
        canvas.width = innerWidth;
        canvas.height = innerHeight;
        mouse.radius = ((canvas.width/80) * (canvas.height/80) );
        init(maxColor,minColor);
    })
window.addEventListener('pointerout', 
    function(){
        mouse.x = undefined;
        mouse.y = undefined;

})
// remove mouse position periodically
setInterval(function(){
    mouse.x = undefined;
    mouse.y= undefined;
}, 1000)

//controls
function update_veloX(value,label){
    veloX = value;
    document.getElementById(label).value=value;
    
}
function update_veloY(value,label){
    veloY = value;
    document.getElementById(label).value=value;
    
}

function update_minColor(value,label){
    minColor = value;
    let hexc = '#'+ (Math.floor(minColor).toString(16));
    document.getElementById(label).value=value;
    document.documentElement.style.setProperty('--min-color',hexc );
    console.log(hexc,value,minColor);
    
}
function update_maxColor(value,label){
    maxColor = value;
    document.getElementById(label).value=value;
    
}
function update_color(value,label){
    maxColor = value;
    minColor = value;
    init(maxColor,minColor);
    document.getElementById(label).value=value;
    document.getElementById("minColor").value=value;
    document.getElementById("maxColor").value=value;
    
}

function pop(){
    init(maxColor,minColor);
}

init(16777216,0);
animate();


























