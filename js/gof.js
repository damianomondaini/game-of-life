var colNb = prompt("Grid columns");
var rowNb = prompt("Grid rows");
var gridArray = generateBlankGridArray();
var globalCounter = 0;

function generateTable() {
    var grid = "<div id='grid' style='grid-template-columns: repeat(" + colNb + ", 1fr); grid-template-rows: repeat(" + rowNb + ", 1fr);'>";
    
    var counterX = 0;
    var counterY = 0;

    for (let i = 0; i < colNb * rowNb; i++) {
        grid += "<div class='cell empty-cell' data-x='" + counterX + "' data-y='" + counterY + "'></div>";

        if (counterX === rowNb - 1) {
            counterX = 0;
            counterY++;
        }
        else {
            counterX ++;
        }
    }

    grid += "</div>";

    $('#grid-wrapper').html(grid);
}

function changeCellStatus(cell) {
    if ($(cell).hasClass('empty-cell')) {
        $(cell).removeClass('empty-cell');
        $(cell).addClass('filled-cell');
    } else {
        $(cell).removeClass('filled-cell');
        $(cell).addClass('empty-cell');
    }
}

function generateBlankGridArray() {
    var gridArray = [];

    for (let i = 0; i < rowNb; i++) {
        var row = [];

        for (let j = 0; j < colNb; j++) {
            row.push(0);
        }

        gridArray.push(row);
    }

    return gridArray
}

function updateGridArray(cell) {
    var x = $(cell).attr('data-x');
    var y = $(cell).attr('data-y');
    if (gridArray[y][x] == 0) {
        gridArray[y][x] = 1;
    }
    else {
        gridArray[y][x] = 0;
    }
}

function stepCell(status, neighborsNb) {
    //If no cell
    if (status === 0) {
        //If 3 neighbors create cell
        if (neighborsNb === 3) {
            return 1;
        }
        //Else keep empty
        else {
            return 0;
        }
    }
    //If cell
    else {
        //If less 2 neighbors kill cell
        if (neighborsNb < 2) {
            return 0;
        }
        //If more 3 neighbors kill cell
        else if (neighborsNb > 3) {
            return 0;
        }
        //If 2 or 3 neighbors keep cell
        else {
            return 1;
        }
    }
}

function countNeighbors(currentI, currentJ) {
    var neighbors = 0;
    //Top left
    neighbors += checkStatus(currentI-1, currentJ-1);
    //Top
    neighbors += checkStatus(currentI-1, currentJ);
    //Top right
    neighbors += checkStatus(currentI-1, currentJ+1);
    //Left
    neighbors += checkStatus(currentI, currentJ-1);
    //Right
    neighbors += checkStatus(currentI, currentJ+1);
    //Bottom left
    neighbors += checkStatus(currentI+1, currentJ-1);
    //Bottom
    neighbors += checkStatus(currentI+1, currentJ);
    //Bottom right
    neighbors += checkStatus(currentI+1, currentJ+1);
    return neighbors;
}

function checkStatus(i, j){
    //If i or j not valid count 0 neighbor
    if (i < 0 || i > rowNb - 1 || j < 0 || j > colNb - 1) {
        return 0;
    }
    //Else check if neightbor status
    else {
        //If  neighbor return 1
        if(gridArray[i][j] === 1) {
            return 1
        }
        //If no neighbor return 0
        else {
            return 0;
        }
    }
}

function stepGridArray() {
    var tempGridArray = generateBlankGridArray();
    for (let i = 0; i < gridArray.length; i++) {
        for (let j = 0; j < gridArray[i].length; j++) {
            var status = gridArray[i][j];
            var neighborsNb = countNeighbors(i, j);
            tempGridArray[i][j] = stepCell(status, neighborsNb);
        }
    }
    gridArray = tempGridArray;
}

function drawGridArray() {
    var statusArray = [];

    for (let i = 0; i < gridArray.length; i++) {
        for (let j = 0; j < gridArray[i].length; j++) {
            statusArray.push(gridArray[i][j]);
        }
    }

    var divCounter = 0;
    $('#grid').children().each(function() {
        if (statusArray[divCounter] === 0) {
            $(this).removeClass('filled-cell');
            $(this).addClass('empty-cell');
        }
        else {
            $(this).removeClass('empty-cell');
            $(this).addClass('filled-cell');
        }

        divCounter++;
    });
}

function generateRandomGridArray(chanceToBeACell) {
    var randomeGridArray = [];

    for (let i = 0; i < rowNb; i++) {
        var row = [];

        for (let j = 0; j < colNb; j++) {
            var randomNumber = Math.random();
            if (randomNumber < chanceToBeACell) {
                row.push(1);
            }
            else {
                row.push(0);
            }
        }

        randomeGridArray.push(row);
    }

    gridArray = randomeGridArray;
}

function main() {
    generateTable();
    $('.cell').on('click', function(event) {
        changeCellStatus(this);
        updateGridArray(this);
    });
    $('#start').on('click', function(event) {
        setInterval(function() {
            stepGridArray();
            drawGridArray();
            $('#counter').text(globalCounter);
            globalCounter++;
        }, 250);
    });
    $('#random').on('click', function(event) {
        var chanceToBeACell = prompt('Chance to be a cell');
        generateRandomGridArray(chanceToBeACell);
        drawGridArray();
    });
}

main();