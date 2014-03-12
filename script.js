var time = 0;
var MAXWORDCOUNT = 20;
var textArray = new Array();
var propArray = new Array();
var completedTextArray = new Array();
var canvas,context,textCanvas,textContext;
var stringBuffer = "";
var dataInitialized = false;
$(document).ready(function(){
	initializeMap();
	initializeData();
	
	setInterval("draw()", 40);
	setInterval("updateInfoBoard()", 250);
});

//gets the json object list of available bg images
function initializeData()
{
	var canvasWidth = canvas.width;
	var req = $.getJSON("phpLib.php?task=getText&arg1=words6.txt",function(data){
	    for (var i = 0; i < data.length; i++) {
	    	textArray.push(data[i]);
			var startPosY = -(Math.random()*400);
			var textWidth = context.measureText(data[i]).width*2;
			var startPosX = (Math.random()*canvasWidth*0.5);
			if(startPosX>(canvasWidth/2-textWidth))
				var startPosX = canvasWidth*0.5-textWidth;
			if(startPosX<=0)
				startPosX = 5;
			var speed = Math.random()*10+5;
			var posAndSpeed = [startPosX,startPosY,speed];
			var tempArray = new Array(2);
			var foundArray = [false,false,0]; //completed,startsWith,startLocation
			tempArray[0] = posAndSpeed;
			tempArray[1] = foundArray;
			propArray.push(tempArray);
	    }
	    dataInitialized = true;		
	});
}


function initializeMap() {
	 canvas = document.getElementById("mainCanvas");
	 context = canvas.getContext("2d");
	 context.scale(2,2);
	 //context.fillStyle = "#0000ff";
	context.font = "10pt Georgia,  Sans-Serif";

	textCanvas = document.getElementById("textCanvas");
	textContext = textCanvas.getContext("2d");
	textContext.scale(1,2);
	textContext.font = "15pt Georgia,  Sans-Serif";
}
window.onload = initializeMap;

function draw() {
	if(!dataInitialized)
		return;
	var wordCount = 0;
	context.clearRect(0,0,canvas.width,canvas.height);

	for (var i=0; i<particles.length; i++)
	{
		var particle = particles[i];
		particle.update(40);
		particle.draw(context);
	}


	for(var i=0;(i<textArray.length) && (wordCount<MAXWORDCOUNT);i++)
	{
		var text = textArray[i];
		var beginFrom = 0;
		var beginOffset = 0;
		if(propArray[i][1][0])
		{
			context.fillStyle = "#00ff00";
			context.fillText(text, propArray[i][0][0]/2, propArray[i][0][1]/2);	
		}
		else if(propArray[i][1][1])
		{
			context.fillStyle = "#ff0000";
			context.fillText(stringBuffer, propArray[i][0][0]/2, propArray[i][0][1]/2);	
			beginFrom = stringBuffer.length;
			beginOffset = context.measureText(stringBuffer).width;
			context.fillStyle = "#000000";
			context.fillText(text.substring(beginFrom), propArray[i][0][0]/2 + beginOffset, propArray[i][0][1]/2);
		}
		else
		{
			context.fillStyle = "#000000";
			context.fillText(text, propArray[i][0][0]/2 , propArray[i][0][1]/2);
		}
		propArray[i][0][1] += propArray[i][0][2]/2; 
		wordCount++;
	}
	updateWords();
}

function updateWords(){
	var canvasHeight = canvas.height;
	for(var i=0;i<textArray.length;i++){
		if(propArray[i][1][0]){
			var x = propArray[i][0][0] + (context.measureText(textArray[i]).width);
			//createExplosion(x,propArray[i][0][1], "#525252");
			//createExplosion(x,propArray[i][0][1], "#FFA318");
			createExplosion(x,propArray[i][0][1], "#ff0000");
			createExplosion(x,propArray[i][0][1], "#00ff00");
			createExplosion(x,propArray[i][0][1], "#0000ff");

			completedTextArray.push([textArray.splice(i,1),propArray.splice(i,1)]);
		}
		else{
			var textPosY = propArray[i][0][1];
			if((canvasHeight/2)<textPosY)
			{
				//propArray[i][0][1] = -(Math.random()*400);
				propArray[i][0][1] = -20;
			}
		}
	}
}


document.onkeypress= function(event) {
	var key_press = String.fromCharCode(event.keyCode);
	var key_code = event.keyCode;
	checkWords(stringBuffer,String.fromCharCode(key_code));
	stringBuffer +=String.fromCharCode(key_code);
	textContext.clearRect(0,0,textCanvas.width,textCanvas.height);
	textContext.fillText(stringBuffer,0,textCanvas.height/6);
}

function checkWords(word,newChar)
{
	var hitNewWord = false;
	var hitNewChar = false;
	var wordCompleted = false;
	var newWord = word+newChar;
	for(var i=0;i<textArray.length;i++)
	{
		if(!propArray[i][1][0])
		{
			var currentText = textArray[i];
			if(currentText == newWord)
			{
				propArray[i][1][0] = true;
				propArray[i][1][1] = false;
				wordCompleted = true;
				hitNewWord = true;
			}
			else if(currentText.startsWith(newWord))
			{
				hitNewWord = true;
				propArray[i][1][1] = true;
				propArray[i][1][2] = newWord.length;
			}
			else if(!hitNewWord && currentText.startsWith(newChar) && stringBuffer.length == 0)
			{
				hitNewChar = true;
				propArray[i][1][1] = true;
				propArray[i][1][2] = newChar.length;			
			}
			else
			{
				propArray[i][1][1] = false;
				propArray[i][1][2] = 0		
			}
		}
	}
	if(!hitNewWord)
	{
		stringBuffer = "";
	}
	else if(hitNewWord && !hitNewChar)
	{
		return newWord;
	}
	else if(hitNewChar)
	{
		return newChar;
	}
	else 
	{
		"";
	}
}


if (typeof String.prototype.startsWith != 'function') {
  String.prototype.startsWith = function (str){
    return this.slice(0, str.length) == str;
  };
}

$(function(){
    /*
     * this swallows backspace keys on any non-input element.
     * stops backspace -> back
     */
    var rx = /INPUT|SELECT|TEXTAREA/i;

    $(document).bind("keydown keypress", function(e){
        if( e.which == 8 ){ // 8 == backspace
            if(!rx.test(e.target.tagName) || e.target.disabled || e.target.readOnly ){
                e.preventDefault();
            }
        }
    });
});

function updateInfoBoard()
{
	time += 250;
	var text = "Completed: "+completedTextArray.length+"\n";
	text += "Remaining: "+textArray.length+"\n";
	text += "Time: "+Math.round(time/1000) +" seconds\n";
	document.getElementById("statArea").value = text;
}

/*
 * A single explosion particle
 */
function Particle ()
{
	this.scale = 1.0;
	this.x = 0;
	this.y = 0;
	this.radius = 20;
	this.color = "#000";
	this.velocityX = 0;
	this.velocityY = 0;
	this.scaleSpeed = 0.5;

	this.update = function(ms)
	{
		// shrinking
		this.scale -= this.scaleSpeed * ms / 1000.0;

		if (this.scale <= 0)
		{
			this.scale = 0;
		}
		// moving away from explosion center
		this.x += this.velocityX * ms/1000.0;
		this.y += this.velocityY * ms/1000.0;
	};

	this.draw = function(context)
	{
		// translating the 2D context to the particle coordinates
		context.save();
		context.translate(this.x, this.y);
		context.scale(this.scale, this.scale);

		// drawing a filled circle in the particle's local space
		context.beginPath();
		context.arc(0, 0, this.radius, 0, Math.PI*2, true);
		context.closePath();

		context.fillStyle = this.color;
		context.fill();

		context.restore();
	};
}

/*
 * Advanced Explosion effect
 * Each particle has a different size, move speed and scale speed.
 * 
 * Parameters:
 * 	x, y - explosion center
 * 	color - particles' color
 */
function createExplosion(x, y, color)
{
	var minSize = 3;
	var maxSize = 5;
	var count = 10;
	var minSpeed = 60.0;
	var maxSpeed = 200.0;
	var minScaleSpeed = 1.0;
	var maxScaleSpeed = 3.0;

	for (var angle=0; angle<360; angle += Math.round(360/count))
	{
		var particle = new Particle();

		particle.x = x/2;
		particle.y = y/2;

		particle.radius = randomFloat(minSize, maxSize);

		particle.color = color;

		particle.scaleSpeed = randomFloat(minScaleSpeed, maxScaleSpeed);

		var speed = randomFloat(minSpeed, maxSpeed);

		particle.velocityX = speed * Math.cos(angle * Math.PI / 180.0);
		particle.velocityY = speed * Math.sin(angle * Math.PI / 180.0);

		particles.push(particle);
	}
}
var particles = [];
function randomFloat (min, max)
{
	return min + Math.random()*(max-min);
}

// code that is executed each time you press the "BOOM!" button

