// This is for navbar
// JavaScript to add 'active' class to the current page's link
document.addEventListener('DOMContentLoaded', function() {
    var currentPage = window.location.pathname.split("/").pop();
    var navLinks = document.querySelectorAll('.nav-menu a');

    navLinks.forEach(function(link) {
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('active');
        }
    });

    // Fallback for index.html
    if (currentPage === '' || currentPage === 'index.html') {
        document.getElementById('home-link').classList.add('active');
    }
});



// Graph code
const canvas = document.getElementById('graphCanvas');
const ctx = canvas.getContext('2d');
// Set canvas to full width and height of its container
canvas.width = canvas.offsetWidth;
canvas.height = canvas.offsetHeight;
const numNodes = 17;
const nodeRadius = 5;
const nodes = [];
const edges = [];

// Mouse position
let mouseX = 0;
let mouseY = 0;

// Generate random nodes and edges
for (let i = 0; i < numNodes; i++) {
    const angle = Math.random() * Math.PI * 2;
    const radius = Math.random() * (Math.min(canvas.width, canvas.height) / 3);
    nodes.push({
        x: Math.cos(angle) * radius + canvas.width / 2,
        y: Math.sin(angle) * radius + canvas.height / 2,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2
    });
    const targetIndex = Math.floor(Math.random() * numNodes);
    if (i !== targetIndex) {
        edges.push({
            source: i,
            target: targetIndex
        });
    }
}

function checkNodeCollision(node1, node2) {
    const dx = node2.x - node1.x;
    const dy = node2.y - node1.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < nodeRadius * 2) {
        // Collision detected, calculate collision response
        const angle = Math.atan2(dy, dx);
        const sin = Math.sin(angle);
        const cos = Math.cos(angle);

        // Rotate velocities
        const vx1 = node1.vx * cos + node1.vy * sin;
        const vy1 = node1.vy * cos - node1.vx * sin;
        const vx2 = node2.vx * cos + node2.vy * sin;
        const vy2 = node2.vy * cos - node2.vx * sin;

        // Swap the x velocities
        const temp = vx1;
        node1.vx = vx2 * cos - vy1 * sin;
        node1.vy = vy1 * cos + vx2 * sin;
        node2.vx = temp * cos - vy2 * sin;
        node2.vy = vy2 * cos + temp * sin;

        // Move nodes apart to prevent sticking
        const overlap = nodeRadius * 2 - distance;
        node1.x -= overlap * cos / 2;
        node1.y -= overlap * sin / 2;
        node2.x += overlap * cos / 2;
        node2.y += overlap * sin / 2;
    }
}

function drawGraph() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // Draw edges
    ctx.strokeStyle = 'rgba(163, 31, 52, 0.3)';
    ctx.lineWidth = 1;
    edges.forEach(edge => {
        const source = nodes[edge.source];
        const target = nodes[edge.target];
        ctx.beginPath();
        ctx.moveTo(source.x, source.y);
        ctx.lineTo(target.x, target.y);
        ctx.stroke();
    });
    // Draw and update nodes
    ctx.fillStyle = 'rgba(163, 31, 52, 0.8)';
    nodes.forEach((node, index) => {
        ctx.beginPath();
        ctx.arc(node.x, node.y, nodeRadius, 0, 2 * Math.PI);
        ctx.fill();

        // Calculate distance to mouse
        const dx = node.x - mouseX;
        const dy = node.y - mouseY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // If mouse is close, move node away
        if (distance < 50) {
            const angle = Math.atan2(dy, dx);
            const force = (50 - distance) / 50; // Stronger force when closer
            node.vx += Math.cos(angle) * force;
            node.vy += Math.sin(angle) * force;
        }

        // Apply velocity (original movement + cursor interaction)
        node.x += node.vx;
        node.y += node.vy;

        // Check boundaries
        if (node.x <= nodeRadius || node.x >= canvas.width - nodeRadius) {
            node.vx *= -1;
            node.x = Math.max(nodeRadius, Math.min(canvas.width - nodeRadius, node.x));
        }
        if (node.y <= nodeRadius || node.y >= canvas.height - nodeRadius) {
            node.vy *= -1;
            node.y = Math.max(nodeRadius, Math.min(canvas.height - nodeRadius, node.y));
        }

        // Check collisions with other nodes
        for (let i = index + 1; i < nodes.length; i++) {
            checkNodeCollision(node, nodes[i]);
        }

        // Apply slight damping to prevent excessive speed
        node.vx *= 0.99;
        node.vy *= 0.99;

        // Ensure minimum movement speed
        const minSpeed = 0.5;
        const speed = Math.sqrt(node.vx * node.vx + node.vy * node.vy);
        if (speed < minSpeed) {
            const scale = minSpeed / speed;
            node.vx *= scale;
            node.vy *= scale;
        }
    });
    requestAnimationFrame(drawGraph);
}

// Track mouse position
canvas.addEventListener('mousemove', (event) => {
    const rect = canvas.getBoundingClientRect();
    mouseX = event.clientX - rect.left;
    mouseY = event.clientY - rect.top;
});

drawGraph();