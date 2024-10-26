export default function MainApp() {
  return (
    <>
      <h1 className="text-xl font-black">This is Initializations</h1>
      <img alt="logo" className="logo" src="" />
      <div className="creator">Powered by electron-vite</div>
      <div className="text">
        Build an Electron app with <span className="react">React</span>
      </div>
      <p className="tip">
        Please try pressing <code>F12</code> to open the devTool
      </p>
      <div className="actions">
        <div className="action">
          <a href="https://electron-vite.org/" target="_blank" rel="noreferrer">
            Documentation
          </a>
        </div>
      </div>
    </>
  );
}
