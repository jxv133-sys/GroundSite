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
              <h2>Modpack 1</h2>
              <p className="muted">[Description placeholder for Modpack 1]</p>
              <a href="/downloads/modpack1.zip" download>
                Download Modpack 1
              </a>
            </div>
            <div className="card download-card">
              <h2>Modpack 2</h2>
              <p className="muted">[Description placeholder for Modpack 2]</p>
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
            Upload images or videos into <strong>public/media</strong> and list
            them in <strong>public/media/media.json</strong>.
          </p>

          <div className="media-grid" style={{ marginTop: "28px" }}>
            {mediaItems.length === 0 && (
              <p className="muted">Add items to media.json to show uploads.</p>
            )}
            {mediaItems.map((item) => {
              const ext = item.src.split(".").pop().toLowerCase();
              const isVideo = ["mp4", "webm", "ogg"].includes(ext);
              return (
                <div className="media-card" key={item.src}>
                  {isVideo ? (
                    <video src={`/${item.src}`} controls />
                  ) : (
                    <img src={`/${item.src}`} alt={item.title || "Media item"} />
                  )}
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
            [About me placeholder] Add a quick intro here. Mention what you
            build, what you love playing, or any community goals you have.
          </p>
          <div className="stats">
            <div className="stat">
              <h3>Home Base</h3>
              <p className="muted">[City / Region]</p>
            </div>
            <div className="stat">
              <h3>Main Projects</h3>
              <p className="muted">[Placeholder list of projects]</p>
            </div>
            <div className="stat">
              <h3>Contact</h3>
              <p className="muted">[Email / Discord / Link]</p>
            </div>
          </div>
        </div>
        <div className="card">
          <h2>Interactive Background</h2>
          <p className="muted">
            Subtle particles float behind the content for a calm, reactive vibe.
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
          Update placeholders once your About Me copy and modpack notes are
          ready.
        </p>
      </main>
    </div>
  );
}
