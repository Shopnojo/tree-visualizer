// get visualization container
const container = document.getElementById("visualization");

// create SVG
const svg = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "svg"
);

svg.setAttribute("width", "100%");
svg.setAttribute("height", "100%");

// add to page
container.appendChild(svg);

const input = document.getElementById("valueInput");

const insertBtn = document.getElementById("insertBtn");
const deleteBtn = document.getElementById("deleteBtn");
const searchBtn = document.getElementById("searchBtn");
const resetBtn = document.getElementById("resetBtn");

const bstBtn = document.querySelector(".tree-btn:nth-child(1)");
const avlBtn = document.querySelector(".tree-btn:nth-child(2)");


function getNodePositions(root) {

    let positions = [];
    let xIndex = 0;

    function inorder(node, depth, parent = null) {
        if (!node) return;

        inorder(node.left, depth + 1, node);

        const currentNode = {
            value: node.value,
            x: xIndex * 80 + 50,
            y: depth * 80 + 50,
            parent: parent
        };

        positions.push(currentNode);

        node._layout = currentNode; // store reference for edge drawing

        xIndex++;

        inorder(node.right, depth + 1, node);
    }

    inorder(root, 0);

    return positions;
}



function renderTree() {

    svg.innerHTML = "";

    const nodes = getNodePositions(tree.root);

    /* ========= DRAW EDGES FIRST ========= */

    function drawEdges(node) {

        if (!node) return;

        if (node.left) {
            drawLine(node._layout, node.left._layout);
            drawEdges(node.left);
        }

        if (node.right) {
            drawLine(node._layout, node.right._layout);
            drawEdges(node.right);
        }
    }

    drawEdges(tree.root);


    /* ========= DRAW NODES ========= */

    nodes.forEach(node => {

        const group = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "g"
        );

        const circle = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "circle"
        );

        circle.setAttribute("cx", node.x);
        circle.setAttribute("cy", node.y);
        circle.setAttribute("r", 20);
        circle.setAttribute("fill", "white");

        const text = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "text"
        );

        text.setAttribute("x", node.x);
        text.setAttribute("y", node.y + 5);
        text.setAttribute("text-anchor", "middle");
        text.setAttribute("fill", "black");
        text.textContent = node.value;

        group.appendChild(circle);
        group.appendChild(text);

        svg.appendChild(group);
    });
}

function drawLine(parent, child) {

    const line = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "line"
    );

    line.setAttribute("x1", parent.x);
    line.setAttribute("y1", parent.y);
    line.setAttribute("x2", child.x);
    line.setAttribute("y2", child.y);
    line.setAttribute("stroke", "white");

    svg.appendChild(line);
}

insertBtn.addEventListener("click", () => {

    const value = parseInt(input.value);

    if (isNaN(value)) return;

    tree.insert(value);

    renderTree();

    input.value = "";
});

resetBtn.addEventListener("click", () => {

    tree.clear();

    renderTree();
});

deleteBtn.addEventListener("click", () => {
    alert("Delete not implemented yet 😄");
});

searchBtn.addEventListener("click", () => {

    const value = parseInt(input.value);

    if (isNaN(value)) return;

    const result = tree.search(value);

    console.log(result ? "Found" : "Not found");
});

bstBtn.addEventListener("click", () => {
    bstBtn.classList.add("active");
    avlBtn.classList.remove("active");

    currentMode = "BST";
    tree = new BST();
    renderTree();
});

avlBtn.addEventListener("click", () => {
    avlBtn.classList.add("active");
    bstBtn.classList.remove("active");

    currentMode = "AVL";
    tree = new AVL();
    renderTree();
});


let currentMode = "BST";
let tree = new BST();


tree.insert(50);
tree.insert(30);
tree.insert(70);
tree.insert(10);

console.log(tree.inorder());   // [10, 30, 50, 70]
console.log(tree.preorder());  // [50, 30, 10, 70]
console.log(tree.postorder()); // [10, 30, 70, 50]

renderTree();