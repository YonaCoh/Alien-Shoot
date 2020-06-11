var stepsRL = 20; // right to left 
var stepsBtm = 30; // downwards movement
var aliensTotal = 10;
var arrAliens, ship;
var explosion;
var curExp = 0;
var arrExplosions = [];
window.shipCur;
window.direction = "right"; // Alien movement direction


// Init ship and aliens.
document.addEventListener('DOMContentLoaded', function(){
    arrAliens = init();
    ship = arrAliens[1];
    arrAliens = arrAliens[0];
    window.shipCur = ship.getBoundingClientRect();

});
var init = function(){
    var arr = [];
    // shipPosition = [600,580];
    for(var i=1; i<=aliensTotal; i++){
        var currentAlien = document.getElementById('a' + i);
        arr.push(currentAlien);
        
    }
    var ship = document.getElementById('spaceship');
    return [arr, ship];
}


// movement of aliens
var alienLeftRight = setInterval(function(){
    // Check win
    if(arrAliens.length === 0){
        document.querySelector('#win').style.display = 'block';
        clearInterval(alienLeftRight);
        return;
    }
    //Start movement
    for(var i=arrAliens.length-1; i>=0; i--){
        var curAlien = arrAliens[i];
        var aRect = curAlien.getBoundingClientRect();
        window.direction === 'right' ? curAlien.style.left = aRect.left-30 + 'px' : curAlien.style.left = (aRect.left - 70) + 'px'
    }
    if (aRect.left >= 730 && window.direction === 'right'){
        window.direction = 'left';
        stepsRL = -20;
        AliensMoveDown();
    } else if(aRect.left <= 40 && window.direction === 'left'){
        window.direction = 'right';
        stepsRL = 20;
        AliensMoveDown();
    }
    if((shipCur.top <= aRect.top + 70 && shipCur.top >= aRect.top - 30) &&
    (shipCur.left <= aRect.left + 120 && shipCur.left >= aRect.left + 25)){ 
        // if((lRect.top <= aRect.top + 90 && lRect.top >= aRect.top - 30) &&
        // (lRect.left <= aRect.left + 120 && lRect.left >= aRect.left + 25)){ 
        gameOver();
    }
}, 80);
var AliensMoveDown = function(){
    for(var i=arrAliens.length-1; i>=0; i--){
        var curAlien = arrAliens[i];
        var aRect = arrAliens[i].getBoundingClientRect();
        // var style = window.getComputedStyle(curAlien);
        // var top = style.getPropertyValue('top'); 
        // var topSplit = top.split('p');
        // topSplit[0] = parseInt(topSplit[0]) + stepsBtm ;
        curAlien.style.top = aRect.top + stepsBtm + 'px';
    };
    return aRect.top;
};


// Ship movement
document.addEventListener('keydown', shipMovement);
function shipMovement(event){
    if(event.keyCode === 37 && shipCur.left > 20){
        ship.style.left = shipCur.left - 20 + 'px';

    } else if(event.keyCode === 38 && shipCur.top > 20){
        ship.style.top = shipCur.top - 20 + 'px';

    } else if(event.keyCode === 39 && shipCur.left < 1500){
        ship.style.left = shipCur.left + 20 + 'px';

    } else if(event.keyCode === 40 && shipCur.top < 620){
        ship.style.top = shipCur.top + 20 + 'px';
    }
    shipCur = ship.getBoundingClientRect();
    // if((shipCur.top <= aRect.top + 70 && lRect.top >= aRect.top - 30) &&
    // (lRect.left <= aRect.left + 120 && lRect.left >= aRect.left + 25)){ 
    //     gameOver();
};


//Lasers
document.addEventListener('keydown', shipshoots);
function shipshoots(event){

    if (event.keyCode === 32){
        // set up
        var newLaser = document.createElement("div");
        document.body.insertBefore(newLaser, document.getElementById("spaceship")); 
        newLaser.classList.add('laser'); 
        var laserPosition = [shipCur.top - 35, shipCur.left + 35];
        newLaser.style.top = laserPosition[0] + 'px';
        newLaser.style.left =  laserPosition[1] + 'px';
        

        //laser movement
        var laserMovement = setInterval(function(){
            laserPosition[0] -= 4;
            newLaser.style.top = laserPosition[0] + 'px'; 
            var lRect = newLaser.getBoundingClientRect();
            var laserTop = lRect.top;

            if(laserTop < 12){
                newLaser.style.display = 'none';
                clearInterval(laserMovement);
            }
            killAlien(lRect, newLaser, laserMovement);
    }, 10); 
    }
};

// Laser hits alien
function killAlien(lRect, newLaser, laserMovement){
    for(var i=0; i<aliensTotal; i++){
        aRect = arrAliens[i].getBoundingClientRect();
        if((lRect.top <= aRect.top + 90 && lRect.top >= aRect.top - 30) &&
        (lRect.left <= aRect.left + 120 && lRect.left >= aRect.left + 25)){ 
            explode(aRect);
            arrAliens[i].remove();
            aliensTotal --;
            arrAliens.splice(i,1);
            newLaser.style.display = 'none';
            clearInterval(laserMovement);
            break;
        }
    }
};

//Lose
function gameOver(){        
        explosion = document.querySelector('#explosion' + curExp);
        ship.style.display = 'none';
        explosion.style.left = shipCur.left + 'px';
        explosion.style.top = shipCur.top + 'px';
        explosion.style.display = 'block';
        setTimeout(function(){
            explosion.style.display = 'none';
            }, 500);
        clearInterval(alienLeftRight);
}


function explode(elem){
    // if(arrExplosions.length > 0){
    //     arrExplosions[0].style.display = 'none';
    //     arrExplosions.splice(arrExplosions.length-1,1);    
    // }
    curExp < 4 ? curExp ++ : curExp = 1;
    explosion = document.querySelector('#explosion' + curExp);
    arrExplosions.push(explosion);
    explosion.style.left = elem.left + 30 + 'px';
    explosion.style.top = elem.top - 20 + 'px';
    explosion.style.display = 'block';
    for(var i=0; i<arrExplosions.length; i++){
        setTimeout(function(){
            if(arrExplosions.length > 0){
                i > 0 ? i-- : i = 0;
                var cur = arrExplosions[i];
                cur.style.display = 'none';
                arrExplosions.splice(arrExplosions[i],1);
            }
        }, 500);
    }
}