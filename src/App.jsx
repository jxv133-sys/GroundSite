import React, { useEffect, useMemo, useState } from "react";
import BackgroundCanvas from "./components/BackgroundCanvas.jsx";

const TABS = [
  { id: "home", label: "Home" },
  { id: "modpacks", label: "Modpacks" },
  { id: "media", label: "Media" }
];

const getHash = () => {
  const raw = window.location.hash.replace("#", "");
  return TABS.some((tab) => tab.id === raw) ? raw : "home";
};

export default function App() {
  const [activeTab, setActiveTab] = useState(getHash());
  const [mediaItems, setMediaItems] = useState([]);

  useEffect(() => {
    const onHashChange = () => setActiveTab(getHash());
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  useEffect(() => {
    if (activeTab !== "media") return;
    fetch("/media/media.json")
      .then((resp) => resp.json())
      .then((items) => setMediaItems(items))
      .catch(() => setMediaItems([]));
  }, [activeTab]);

  const content = useMemo(() => {
    if (activeTab === "modpacks") {
      return (
        <section className="panel">
          <h1>Modpack Downloads</h1>
          <p className="muted">
            Drop your zip files into <strong>public/downloads</strong> and keep
            the file names exactly as <strong>modpack1.zip</strong> and
            <strong>modpack2.zip</strong>.
          </p>

          <div className="grid" style={{ marginTop: "28px" }}>
            <div className="card download-card">
              <h2>Modpack 1 (forge - 1.20.1)</h2>
              <p className="muted">Somthing is wrong with the world...</p>
              <a href="/downloads/modpack1.zip" download>
                Download Modpack 1
              </a>
            </div>
            <div className="card download-card">
              <h2>Modpack 2 (forge - 1.20.1)</h2>
              <p className="muted">GroundFarm modpack, RPG based. Create mod and farmer delights! Lots of structures.</p>
              <a href="/downloads/modpack2.zip" download>
                Download Modpack 2
              </a>
            </div>
          </div>
        </section>
      );
    }

    if (activeTab === "media") {
      return (
        <section className="panel">
          <h1>Media Library</h1>
          <p className="muted">
            I will upload media from projects here!
          </p>

          <div className="media-grid" style={{ marginTop: "28px" }}>
            {mediaItems.length === 0 && (
              <p className="muted">Add items to media.json to show uploads.</p>
            )}
            {mediaItems.map((item) => {
              const ext = item.src.split(".").pop().toLowerCase();
              const isVideo = ["mp4", "webm", "ogg", "mov"].includes(ext);
              return (
                <div className="media-card" key={item.src}>
                  <div className="media-frame">
                    {isVideo ? (
                      <video
                        src={`/${item.src}`}
                        controls
                        playsInline
                        preload="metadata"
                        onError={(event) => {
                          const target = event.currentTarget;
                          target.setAttribute("data-error", "true");
                        }}
                      />
                    ) : (
                      <img
                        src={`/${item.src}`}
                        alt={item.title || "Media item"}
                      />
                    )}
                  </div>
                  <div className="media-body">
                    <strong>{item.title || "Untitled"}</strong>
                    <p className="muted">
                      {item.caption || "Add a caption in media.json"}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      );
    }

    return (
      <section className="hero">
        <div>
          <h1>
            Hello, I am <span className="highlight">[Your Name]</span>.
          </h1>
          <p>
            Hi im jonah! I enjoy playing modded minecraft, the finals, factorio and other games!
          </p>
          <div className="stats">
            <div className="stat">
              <h3>Home Base</h3>
              <p className="muted">Pennsylvania</p>
            </div>
            <div className="stat">
              <h3>Projects</h3>
              <ul className="muted-list">
                <li>Homelab projects</li>
                <li>Docker containers</li>
                <li>Minecraft servers</li>
                <li>Server health monitor</li>
                <li>Video editing (for fun)</li>
                <li>Basics of Blender</li>
              </ul>
              <p className="muted" style={{ marginTop: "12px" }}>
                Planned projects:
              </p>
              <ul className="muted-list">
                <li>Switch from Beziel to Uptime Kuma</li>
                <li>Jellyfin media server</li>
                <li>Yacht for docker containers</li>
                <li>Local VPN Headscale</li>
                <li>minecraft-docker-manager</li>
              </ul>
            </div>
            <div className="stat">
              <h3>Contact</h3>
              <p className="muted">jxv133@gmail.com</p>
            </div>
          </div>
        </div>
        <div className="card">
          <h2>Whats this site for?</h2>
          <p className="muted">
            Portfolio, modpack downloads for modded servers I host, and project archive!
          </p>
        </div>
      </section>
    );
  }, [activeTab, mediaItems]);

  return (
    <div className="app">
      <BackgroundCanvas />
      <header>
        <nav>
          <div className="logo">GroundSite</div>
          <div className="tabs">
            {TABS.map((tab) => (
              <a
                key={tab.id}
                href={`#${tab.id}`}
                className={activeTab === tab.id ? "active" : ""}
              >
                {tab.label}
              </a>
            ))}
          </div>
        </nav>
      </header>

      <main>
        {content}
      </main>
    </div>
  );
}
