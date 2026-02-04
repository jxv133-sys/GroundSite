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

         

          <div className="media-grid" style={{ marginTop: "28px" }}>
            {mediaItems.length === 0 && (
              <p className="muted">Misc projects here!.</p>
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
            Hi, I am <span className="highlight">Jonah V</span>.
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
              <h3>Planned projects:</h3>
              <p className="muted">                
                -Switch from Beziel to Uptime Kuma
                -Jellyfin media server
                -Yacht for docker containers
                -Local VPN Headscale 
                -minecraft-docker-manager </p>
            </div>
            <div className="stat">
              <h3>Contact</h3>
              <p className="muted">jxv133@gmail.com</p>
            </div>
          </div>
        </div>
        <div className="card">
          <h2>Projects</h2>
          <p className="muted">
            Homelab projects: 
            Docker containers
            minecraft servers
            server health moniter
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
        <p className="footer-note">
        </p>
      </main>
    </div>
  );
}
