// const canvas = document.getElementById("particles-bg");

// if (canvas) {
//     const ctx = canvas.getContext("2d");

//     function resize() {
//         canvas.width = window.innerWidth;
//         canvas.height = window.innerHeight;
//     }

//     resize();
//     window.addEventListener("resize", resize);

//     const particles = [];

//     class Particle {
//         constructor() {
//             this.x = Math.random() * canvas.width;
//             this.y = Math.random() * canvas.height;

//             this.size = Math.random() * 2 + 1;

//             this.speedX = (Math.random() - 0.5) * 0.4;
//             this.speedY = (Math.random() - 0.5) * 0.4;
//         }

//         update() {
//             this.x += this.speedX;
//             this.y += this.speedY;

//             if (this.x < 0) this.x = canvas.width;
//             if (this.x > canvas.width) this.x = 0;

//             if (this.y < 0) this.y = canvas.height;
//             if (this.y > canvas.height) this.y = 0;
//         }

//         draw() {
//             ctx.beginPath();
//             ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
//             ctx.fillStyle = "rgba(255,255,255,0.7)";
//             ctx.fill();
//         }
//     }

//     for (let i = 0; i < 100; i++) {
//         particles.push(new Particle());
//     }

//     function connect() {
//         for (let a = 0; a < particles.length; a++) {
//             for (let b = a; b < particles.length; b++) {

//                 const dx = particles[a].x - particles[b].x;
//                 const dy = particles[a].y - particles[b].y;

//                 const distance = Math.sqrt(dx * dx + dy * dy);

//                 if (distance < 120) {

//                     ctx.beginPath();
//                     ctx.strokeStyle = `rgba(255,255,255,${
//                         0.3 - distance / 800
//                     })`;

//                     ctx.lineWidth = 1;

//                     ctx.moveTo(
//                         particles[a].x,
//                         particles[a].y
//                     );

//                     ctx.lineTo(
//                         particles[b].x,
//                         particles[b].y
//                     );

//                     ctx.stroke();
//                 }
//             }
//         }
//     }

//     function animate() {
//         ctx.clearRect(
//             0,
//             0,
//             canvas.width,
//             canvas.height
//         );

//         particles.forEach(p => {
//             p.update();
//             p.draw();
//         });

//         connect();

//         requestAnimationFrame(animate);
//     }

//     animate();
// }

const canvas = document.getElementById("particles-bg");

if (canvas) {
    const ctx = canvas.getContext("2d");

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    resize();
    window.addEventListener("resize", resize);

    const particles = [];

    // Responsive particle count
    const particleCount =
        window.innerWidth < 480 ? 25 :
        window.innerWidth < 768 ? 40 :
        window.innerWidth < 1024 ? 70 :
        150;

    // Responsive connection distance
    const maxDistance =
        window.innerWidth < 768 ? 80 : 120;

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;

            this.size = Math.random() * 2 + 1;

            this.speedX = (Math.random() - 0.5) * 0.4;
            this.speedY = (Math.random() - 0.5) * 0.4;
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;

            if (this.x < 0) this.x = canvas.width;
            if (this.x > canvas.width) this.x = 0;

            if (this.y < 0) this.y = canvas.height;
            if (this.y > canvas.height) this.y = 0;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(
                this.x,
                this.y,
                this.size,
                0,
                Math.PI * 2
            );

            ctx.fillStyle = "rgba(255,255,255,0.7)";
            ctx.fill();
        }
    }

    // Create particles
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }

    function connect() {
        for (let a = 0; a < particles.length; a++) {
            for (let b = a + 1; b < particles.length; b++) {

                const dx = particles[a].x - particles[b].x;
                const dy = particles[a].y - particles[b].y;

                const distance = Math.sqrt(
                    dx * dx + dy * dy
                );

                if (distance < maxDistance) {

                    const opacity =
                        (maxDistance - distance) /
                        maxDistance *
                        0.3;

                    ctx.beginPath();

                    ctx.strokeStyle =
                        `rgba(255,255,255,${opacity})`;

                    ctx.lineWidth = 1;

                    ctx.moveTo(
                        particles[a].x,
                        particles[a].y
                    );

                    ctx.lineTo(
                        particles[b].x,
                        particles[b].y
                    );

                    ctx.stroke();
                }
            }
        }
    }

    function animate() {
        ctx.clearRect(
            0,
            0,
            canvas.width,
            canvas.height
        );

        particles.forEach((particle) => {
            particle.update();
            particle.draw();
        });

        connect();

        requestAnimationFrame(animate);
    }

    animate();
}