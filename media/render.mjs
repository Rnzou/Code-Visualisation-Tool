// summaryInfo includes debugInfoArrays[i], debugInfoPointerArrays[i] ,debugInfoNumbers[i], threadsInfoA[i]

fetch('http://localhost:3000/')
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        let summaryInfo = data.summaryInfo;
        loadCodeFromFile('temp.c');
        updates(summaryInfo);
    })
    .catch(error => {
        console.error("Failed to fetch data:", error);
    });

    
function updates(summaryInfo) {

    const LinkedList = [];
    const deletedbegin = [];
    const deletedend = [];
    const Trees = [];
    const slider = document.getElementById('arraySlider');
    const sliderValueDisplay = document.getElementById('sliderValue');
    let MeetFunctionForwardList = 0;
    let MeetFunctionBackList = 0;
    let MeetFunctionForwardTree = 0;
    let MeetFunctionBackTree = 0;
    let InsertLeftOn = false;
    let InsertLeftAddress = 0;
    let InsertRightOn = false;
    let InsertRightAddress = 0;
    let InsertLeftOnBack = false;
    let InsertLeftAddressBack = 0;
    let InsertRightOnBack = false;
    let InsertRightAddressBack = 0;
    slider.max = summaryInfo.length - 1;
    
    
    updateChangesForward(summaryInfo[slider.value], slider.value);

    document.getElementById('revStepIn').addEventListener('click', function() {
        slider.value--;
        updateChangesBack(summaryInfo[slider.value], slider.value);
    });

    document.getElementById('StepIn').addEventListener('click', function() {
        slider.value++;
        updateChangesForward(summaryInfo[slider.value], slider.value);
    });

    document.getElementById('revNext').addEventListener('click', function() {
        slider.value--;
        updateChangesBack(summaryInfo[slider.value], slider.value);
        while(summaryInfo[slider.value][3].func !== 'main'){
            slider.value--;
            updateChangesBack(summaryInfo[slider.value], slider.value);
        } 
    });

    document.getElementById('Next').addEventListener('click', function() {
        slider.value++;
        updateChangesForward(summaryInfo[slider.value], slider.value);
        while(summaryInfo[slider.value][3].func !== 'main'){
            slider.value++;
            updateChangesForward(summaryInfo[slider.value], slider.value);
        } 
    });
    

    function updateChangesForward(data, val) {

      console.log(data);

      if(data[3].func === 'createNode' && InsertLeftOn === false && InsertRightOn === false) {
        MeetFunctionForwardTree++;
        if(MeetFunctionForwardTree === 2) {
            Trees.push({
                value : data[4][0].value,
                address : data[4][1].value,
                left : null,
                right : null
            });            
        }
      } else if(data[3].func === 'createNode' && InsertLeftOn === true) {
        MeetFunctionForwardTree++;
        if(MeetFunctionForwardTree === 7) {
            let InsertedTree = findNodeByAddress(Trees, InsertLeftAddress);
            InsertedTree.left = {
                value : data[4][0].value,
                address : data[4][1].value,
                left : null,
                right : null
            };
            InsertLeftOn = !InsertLeftOn;
        }
      } else if(data[3].func === 'createNode' && InsertRightOn === true) {
        MeetFunctionForwardTree++;
        if(MeetFunctionForwardTree === 7) {
            let InsertedTree = findNodeByAddress(Trees, InsertRightAddress);
            InsertedTree.right = {
                value : data[4][0].value,
                address : data[4][1].value,
                left : null,
                right : null
            };
            InsertRightOn = !InsertRightOn;
        }
      }else if(data[3].func === 'insertLeft') {
        MeetFunctionForwardTree++;
        if(MeetFunctionForwardTree === 1) {
            InsertLeftAddress = data[4][0].value;
            InsertLeftOn = !InsertLeftOn;
        }
      } else if(data[3].func === 'insertRight') {
        MeetFunctionForwardTree++;
        if(MeetFunctionForwardTree === 1) {
            InsertRightAddress = data[4][0].value;
            InsertRightOn = !InsertRightOn;
        }
      } else {
        MeetFunctionForwardTree = 0;
      }

      if(data[3].func === 'insertatbegin') {
        MeetFunctionForwardList++;
        if(MeetFunctionForwardList === 3) {
            LinkedList.unshift(Number(data[4][0].value));
            drawList(LinkedList);
        }
      } else if(data[3].func === 'insertatend') {
        MeetFunctionForwardList++;
        if(MeetFunctionForwardList === 3) {
            LinkedList.push(Number(data[4][0].value));
            drawList(LinkedList);
        }
      } else if(data[3].func === 'deleteatbegin') {
        MeetFunctionForwardList++;
        if(MeetFunctionForwardList === 1) {
            deletedbegin.push(LinkedList.shift());
            drawList(LinkedList);
        }
      } else if(data[3].func === 'deleteatend') {
        MeetFunctionForwardList++;
        if(MeetFunctionForwardList === 1) {
            deletedend.push(LinkedList.pop());
            drawList(LinkedList);
        }
      } else {
        MeetFunctionForwardList = 0;
      }

      drawArrays(data[0]);
      drawPointerArrays(data[1]);
      drawNumbers(data[2]);
      drawArrows(data[3].line - 1);
      drawtrees(Trees);
      sliderValueDisplay.textContent = val + '/' + slider.max;

    }

    function updateChangesBack(data, val) {

        console.log(data);

        if(data[3].func === 'createNode' && InsertLeftOnBack === false && InsertRightOnBack === false) {
            MeetFunctionBackTree++;
            if(MeetFunctionBackTree === 1) {
                Trees.pop();            
            }
          } else if(data[3].func === 'createNode' && InsertLeftOnBack === true) {
            MeetFunctionBackTree++;
            if(MeetFunctionBackTree === 3) {
                let InsertedTree = findNodeByAddress(Trees, InsertLeftAddressBack);
                InsertedTree.left = null;
                InsertLeftOnBack = !InsertLeftOnBack;
            }
          } else if(data[3].func === 'createNode' && InsertRightOnBack === true) {
            MeetFunctionBackTree++;
            if(MeetFunctionBackTree === 3) {
                let InsertedTree = findNodeByAddress(Trees, InsertRightAddressBack);
                InsertedTree.right = null;
                InsertRightOnBack = !InsertRightOnBack;
            }
          }else if(data[3].func === 'insertLeft') {
            MeetFunctionBackTree++;
            if(MeetFunctionBackTree === 1) {
                InsertLeftAddressBack = data[4][0].value;
                InsertLeftOnBack = !InsertLeftOnBack;
            }
          } else if(data[3].func === 'insertRight') {
            MeetFunctionBackTree++;
            if(MeetFunctionBackTree === 1) {
                InsertRightAddressBack = data[4][0].value;
                InsertRightOnBack = !InsertRightOnBack;
            }
          } else {
            MeetFunctionBackTree = 0;
          }
        
        if(data[3].func === 'insertatbegin') {
          MeetFunctionBackList++;
          if(MeetFunctionBackList === 3) {
              LinkedList.shift();
              drawList(LinkedList);
          }
        } else if(data[3].func === 'insertatend') {
          MeetFunctionBackList++;
          if(MeetFunctionBackList === 1) {
              LinkedList.pop();
              drawList(LinkedList);
          }
        } else if(data[3].func === 'deleteatbegin') {
          MeetFunctionBackList++;
          if(MeetFunctionBackList === 1) {
              LinkedList.unshift(deletedbegin.pop());
              drawList(LinkedList);
          }
        } else if(data[3].func === 'deleteatend') {
          MeetFunctionBackList++;
          if(MeetFunctionBackList === 1) {
              LinkedList.push(deletedend.pop());
              drawList(LinkedList);
          }
        } else {
            MeetFunctionBackList = 0;
        }
  
        drawArrays(data[0]);
        drawPointerArrays(data[1]);
        drawNumbers(data[2]);
        drawArrows(data[3].line - 1);
        drawtrees(Trees);
        sliderValueDisplay.textContent = val + '/' + slider.max;
  
      }
}
          
let p1, p2, p3, p4, p6;

function drawNumbers(numbers) {

    if (p1) {
        p1.remove();  
    }

    const sketch = function(p) {
        let draws = [];

        p.setup = function() {
            let lengthofCanvas = numbers.length * 190;
            p.createCanvas(lengthofCanvas, 110);  
            p.frameRate(10);
            addNumber();
        };

        p.draw = function() {
            p.textAlign(p.CENTER, p.CENTER);

            draws.forEach(num => {
                p.textSize(36);
                let textWidth = p.textWidth(num.value) + 10;

                let rectWidth = p.max(textWidth, 100);
                let rectHeight = 50;

                p.fill(255);
                p.stroke(0);
                p.rect(num.x - rectWidth / 2, num.y - rectHeight / 2, rectWidth, rectHeight);

                p.fill(0);
                p.text(num.value, num.x, num.y + 5);

                p.textSize(16);
                p.text(`Name: ${num.name} Type: ${num.type}`, num.x, num.y + 40);
            });
        };

        function addNumber() {
            let startX = 100;  
            let y = p.height / 2 - 25;
        
            numbers.forEach((element, index) => {
                let x = startX + index * 150;
                draws.push({ name: element.name, type: element.type, value: element.value, x: x, y: y });
            });
        };
    };

    p1 = new p5(sketch, 'animation-container1');
}

function drawArrays(dataArrays) {

    if (p2) {
        p2.remove();  
    }

    const sketch = function(p) {
        const barWidth = 60;

        p.setup = function () {
            let maxNumBars = dataArrays.reduce((max, item) => Math.max(max, item.value.length), 0);
            let canvasHeight = dataArrays.length * 200;
            let canvasWidth = maxNumBars * barWidth;
            if(canvasWidth < 180) {canvasWidth = 180;};
            p.createCanvas(canvasWidth, canvasHeight);
            p.noLoop();
        };

        p.draw = function () {
            let chartHeight = p.height / dataArrays.length;
            dataArrays.forEach((item, index) => {
                drawBarChart(p, item.value, item.name, item.type, 0, chartHeight * index, p.width, chartHeight);
            });
        };

        function drawBarChart(p, data, name, type, x, y, w, h) {
            let headerHeight = 40;
            p.fill(0);
            p.noStroke();
            p.textSize(16);
            p.textAlign(p.LEFT, p.TOP);
            p.text(`Name: ${name} Type: ${type}`, x + 10, y + 10);
        
            const isAllQuestionMarks = data.every(val => val === '?');
        
            let maxDataValue = isAllQuestionMarks ? 1 : Math.max(...data.map(Number));
            for (let i = 0; i < data.length; i++) {
                let normalizedHeight = p.map(isAllQuestionMarks ? 1 : data[i], 0, maxDataValue, 0, h - headerHeight - 20);
                p.fill(isAllQuestionMarks ? '#ccc' : 255);  
                p.stroke(0);
                let barY = y + headerHeight + (h - headerHeight - normalizedHeight);
                p.rect(x + i * barWidth, barY, barWidth - 5, normalizedHeight);
        
                p.fill(0);
                p.textSize(16);
                p.textAlign(p.CENTER, p.BOTTOM);
                p.text(isAllQuestionMarks ? '?' : data[i], x + i * barWidth + barWidth / 2, y + h - 5);
            };
        }
        
        
    };

    p2 = new p5(sketch, 'animation-container2');
}

function drawPointerArrays(dataset) {

    if (p3) {
        p3.remove();  
    }

    const sketch = function(p) {  
        let maxHeight = 0;
        let maxWidth = 0;
        let baseHeightPerItem = 220; 
        let baseWidthPerValue = 160; 

        p.setup = function() {
            for (let data of dataset) {
                let currentWidth = data.value.length * baseWidthPerValue + 10;
                maxWidth = p.max(maxWidth, currentWidth);
                maxHeight += baseHeightPerItem + data.value.length * 20; 
            }

            p.createCanvas(maxWidth, maxHeight);
            p.noLoop();
        };

        p.draw = function() {
            p.textSize(16);
        
            let yOffset = 20; 
            for (let data of dataset) {
                p.text("Name: " + data.name, 10, yOffset);
                p.text("Type: " + data.type, 10, yOffset + 20);
        
                let fruits = [];
                if (Array.isArray(data.value) && data.value.length > 0) {
                    fruits = data.value.map(item => {
                        let addressMatch = item.match(/0x[0-9a-f]+/i);
                        let nameMatch = item.match(/"([^"]+)"/);
                        let address = addressMatch ? addressMatch[0] : "Unknown";
                        let name = nameMatch ? nameMatch[1] : "Unknown";
                        return { address, name };
                    });
                }
        
                let x = 10;
                let y = yOffset + 40;
                let w = 50; 
                let h = 100; 
        
                for (let fruit of fruits) {
                    p.fill(255);
                    p.rect(x, y, w, h);
                    p.fill(0);
                    p.text(fruit.name, x, y + h + 20);
                    p.text(fruit.address, x, y + h + 40);
                    x += 160; 
                }
        
                yOffset += baseHeightPerItem + fruits.length * 20; // Adjust yOffset based on actual number of items
            }
        };
        
    };

    p3 = new p5(sketch, 'animation-container3');

}

// Global variable to hold the p5 instance

// Function to start the visualization
function drawList(values = []) {
    if (p4) {
        p4.remove();  // Remove the previous sketch if it exists
    }

    const sketch = function(p) {
        let head = null;
        let nodesPerRow = 4;
        let nodeSpacing = 100;
        let rowSpacing = 100;

        p.setup = function() {
            let rows = (values.length === 0) ? 1 : Math.ceil(values.length / nodesPerRow);
            p.createCanvas(400, rows * rowSpacing + 50);
            p.frameRate(2); // Adjust frame rate as needed
            if (values.length > 0) {
                setupLinkedList();
            } else {
                p.noLoop(); // Stop the drawing loop if no data
            }
        };

        p.draw = function() {
            p.background(220);
            if (!head) {
                p.fill(0);
                p.textAlign(p.CENTER, p.CENTER);
                p.text("No data available", p.width / 2, p.height / 2);
                return; // Skip drawing if no head node
            }
        
            let current = head;
            let count = 0;
            while (current !== null) {
                if (count === 3) {
                    current.showend(); // Special display logic for every fourth node
                    current = current.next;
                    count = 0; // Reset count after showing the fourth node
                } else {
                    current.show();
                    current = current.next;
                    count++;
                }
            }
        };

        function setupLinkedList() {

            if (values.length === 0) {
                return; // Exit if there are no values to process
            }

            let x = 50;
            let y = 50;
            head = new Node(values[0], x, y, p);
            let current = head;

            for (let i = 1; i < values.length; i++) {
                if (i % nodesPerRow === 0) {
                    y += rowSpacing; // Move to the next row
                    x = 50; // Reset x position for the new row
                } else {
                    x += nodeSpacing;
                }
                let newNode = new Node(values[i], x, y, p);
                current.next = newNode;
                current = newNode;
            }
        };

        // Node class definition adapted to use p object for drawing
        class Node {
            constructor(value, x, y, p) {
                this.value = value;
                this.next = null;
                this.x = x;
                this.y = y;
                this.p = p;
            }

            show() {
                this.drawNode(false);
            }

            showend() {
                this.drawNode(true);
            }


            drawNode(isEnd) {
                let p = this.p;
                p.stroke(0);
                p.fill(255);
                p.ellipse(this.x, this.y, 50, 50);
                p.noStroke();
                p.fill(0);
                p.textAlign(p.CENTER, p.CENTER);
                p.text(this.value, this.x, this.y);
                if (this.next && !isEnd) {
                    p.stroke(0);
                    this.drawLineWithArrow(this.x + 25, this.y, this.next.x - 25, this.next.y);
                } else if (this.next) {
                    p.stroke(0);
                    this.drawLineWithArrow(this.x - 25, this.y, this.next.x + 25, this.next.y);
                }
            }

            drawLineWithArrow(x1, y1, x2, y2) {
                let p = this.p;
                p.line(x1, y1, x2, y2);
                let angle = p.atan2(y2 - y1, x2 - x1);
                let arrowSize = 8;
                p.push();
                p.translate(x2, y2);
                p.rotate(angle);
                p.beginShape();
                p.vertex(0, 0);
                p.vertex(-arrowSize, arrowSize / 2);
                p.vertex(-arrowSize, -arrowSize / 2);
                p.endShape(p.CLOSE);
                p.pop();
            }
        }
    };

    p4 = new p5(sketch, 'animation-container4');
}

function drawtrees(treesData) {

    if (p6) {
        p6.remove();  
    }

    function sketch(p) {
      let roots = [];
      let maxTreeWidth = 0;
      let totalWidth = 0;

      p.setup = function() {
        if (!treesData || !treesData.length) {
            console.log('No valid trees data available');
            p.createCanvas(400, 400);
            return;
        }

        treesData.forEach((treeData, index) => {
            if (treeData && (treeData.value || treeData.left || treeData.right)) {
                let depth = maxDepth(treeData);
                let treeWidth = 160 * depth;
                roots[index] = buildTree(treeData, totalWidth + treeWidth / 2, 50, depth * 50);
                totalWidth += treeWidth;
                maxTreeWidth = Math.max(maxTreeWidth, 120 * depth);
            } else {
                roots[index] = null;
            }
        });

        p.createCanvas(totalWidth, maxTreeWidth);
      };
  
      p.draw = function() {
        roots.forEach(root => {
            if (root) {
                p.translate(root.x - p.width / 2, 20); // Center the tree horizontally
                root.visit();
                p.translate(root.x - p.width / 1.5, 20); // Reset translation for next tree
            }
        });
      };
  
      function buildTree(nodeData, x, y, spacing, depth = 0) {
        let node = new TreeNode(nodeData.value, x, y, spacing, depth);
        let newY = y + 100;
        let newSpacing = spacing / 2;
  
        if (nodeData.left) {
          let childX = x - newSpacing;
          let childNode = buildTree(nodeData.left, childX, newY, newSpacing, depth + 1);
          node.left = childNode;
        }
        if (nodeData.right) {
          let childX = x + newSpacing;
          let childNode = buildTree(nodeData.right, childX, newY, newSpacing, depth + 1);
          node.right = childNode;
        }
        return node;
      }

      function maxDepth(node) {
        if (!node) {
          return 0; 
        } else {
          let leftDepth = node.left ? maxDepth(node.left) : 0;
          let rightDepth = node.right ? maxDepth(node.right) : 0;
          
          return Math.max(leftDepth, rightDepth) + 1;
        }
      }
  
      class TreeNode {
        constructor(value, x, y, spacing, depth) {
          this.value = value;
          this.x = x;
          this.y = y;
          this.spacing = spacing;
          this.depth = depth;
          this.left = null;
          this.right = null;
        }
  
        visit() {
          if (this.left) {
            p.stroke(0);
            p.line(this.x, this.y, this.left.x, this.left.y);
            this.left.visit();
          }
          if (this.right) {
            p.stroke(0);
            p.line(this.x, this.y, this.right.x, this.right.y);
            this.right.visit();
          }
          p.stroke(0);
          p.fill(255);
          p.ellipse(this.x, this.y, 40, 40);
          p.textAlign(p.CENTER, p.CENTER);
          p.fill(0);
          p.noStroke();
          p.text(this.value, this.x, this.y);
        }
      }
    }

    p6 = new p5(sketch, 'animation-container6');
}

async function loadCodeFromFile(filePath) {
    try {
        const url = `http://localhost:3000/uploads/${filePath}`;
        const response = await fetch(url);
        const text = await response.text();
        const codeLines = text.split('\n'); 

        const codeBlock = document.getElementById('codeBlock');
        codeBlock.innerHTML = ''; 

        codeLines.forEach((line, index) => {
            const lineElement = document.createElement('div');
            lineElement.id = `code-line-${index}`;
            lineElement.innerHTML = `<span class="arrow"> </span><span class="lineno">${index + 1}: </span><span class="code">${line}</span><br>`;
            codeBlock.appendChild(lineElement);
        });
        
    } catch (error) {
        console.error('Failed to load the code file from server:', error);
    }
};

function pointArrowToLine(lineID) {
    const arrows = document.querySelectorAll('.arrow');
    arrows.forEach(arrow => arrow.textContent = ' '); 
    const targetLine = document.getElementById(lineID);
    if (targetLine) {
        targetLine.querySelector('.arrow').textContent = '→';
        targetLine.scrollIntoView({ behavior: 'smooth', block: 'center' }); // 自动滚动到该行
    }
};

function drawArrows(lineIndex) {
    const codeLines = document.querySelectorAll('.code');
    pointArrowToLine(`code-line-${lineIndex}`);
};


function findNodeByAddress(nodes, targetAddress) {
    function searchNode(node) {
        if (node === null) {
            return null; 
        }
        if (node.address === targetAddress) {
            return node; 
        }
        let result = searchNode(node.left);
        if (result) {
            return result; 
        }
        return searchNode(node.right);
    }

    for (let node of nodes) {
        let result = searchNode(node);
        if (result) {
            return result; 
        }
    }
    return null; 
}



