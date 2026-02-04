const current = window.location.pathname.split("/").pop() || "index.html";
const tabs = document.querySelectorAll("nav a");

tabs.forEach((tab) => {
  const href = tab.getAttribute("href");
  if (href === current) {
    tab.classList.add("active");
  }
});

const canvas = document.querySelector("#bits-canvas");
if (canvas) {
  const ctx = canvas.getContext("2d");
  let width = 0;
  let height = 0;
  const bits = [];
  const bitCount = 46;

  const resize = () => {
    width = canvas.clientWidth;
    height = canvas.clientHeight;
    canvas.width = width * devicePixelRatio;
    canvas.height = height * devicePixelRatio;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(devicePixelRatio, devicePixelRatio);
  };

  const seedBits = () => {
    bits.length = 0;
    for (let i = 0; i < bitCount; i += 1) {
      bits.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: 2 + Math.random() * 4,
        drift: Math.random() * 0.7 + 0.2,
        hue: 180 + Math.random() * 80,
      });
    }
  };

  const draw = () => {
    ctx.clearRect(0, 0, width, height);
    bits.forEach((bit) => {
      ctx.beginPath();
      ctx.fillStyle = `hsla(${bit.hue}, 70%, 65%, 0.8)`;
      ctx.arc(bit.x, bit.y, bit.size, 0, Math.PI * 2);
      ctx.fill();
    });
  };

  const animate = () => {
    bits.forEach((bit) => {
      bit.y += bit.drift;
      if (bit.y > height + 10) bit.y = -10;
    });
    draw();
    requestAnimationFrame(animate);
  };

  resize();
  seedBits();
  animate();

  window.addEventListener("resize", () => {
    resize();
    seedBits();
  });

  const field = document.querySelector(".bits-field");
  if (field && window.anime) {
    field.addEventListener("mousemove", (event) => {
      const rect = field.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      anime({
        targets: bits,
        x: () => x + (Math.random() - 0.5) * 180,
        y: () => y + (Math.random() - 0.5) * 180,
        duration: 1400,
        easing: "easeOutExpo",
      });
    });
  }
}

const mediaGrid = document.querySelector("#media-grid");
if (mediaGrid) {
  fetch("media/media.json")
    .then((resp) => resp.json())
    .then((items) => {
      items.forEach((item) => {
        const card = document.createElement("div");
        card.className = "media-card";

        const ext = item.src.split(".").pop().toLowerCase();
        const isVideo = ["mp4", "webm", "ogg"].includes(ext);
        const media = document.createElement(isVideo ? "video" : "img");

        if (isVideo) {
          media.src = item.src;
          media.controls = true;
        } else {
          media.src = item.src;
          media.alt = item.title || "Media item";
        }

        const body = document.createElement("div");
        body.className = "media-body";
        body.innerHTML = `
          <strong>${item.title || "Untitled"}</strong>
          <p class="muted">${item.caption || "Add a caption in media.json"}</p>
        `;

        card.appendChild(media);
        card.appendChild(body);
        mediaGrid.appendChild(card);
      });
    })
    .catch(() => {
      mediaGrid.innerHTML = "<p class=\"muted\">Add items to media/media.json to display your uploads.</p>";
    });
}
