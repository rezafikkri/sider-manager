import SimpleConfigurationsSider from './SimpleConfigurationsSider';

export default function SimpleConfigurationsApp() {
  return (
    <>
      <header>
        <nav className="p-3 w-40 border-e border-indigo-950/30 min-h-screen sticky top-0">
          <ul className="[&_a]:px-3 [&_a]:py-1.5 [&_a]:my-2 [&_a]:block [&_a]:rounded-lg text-sm">
            <li><a href="" className="bg-indigo-950 font-medium">Sider</a></li>
            <li><a href="" className="opacity-80">ML Manager</a></li>
            <li><a href="" className="opacity-80">Press Room</a></li>
            <li><a href="" className="opacity-80">Graphic Menu</a></li>
          </ul>
        </nav>
      </header>
      <main className="py-5 px-3 min-h-full flex-1">
        <SimpleConfigurationsSider />
      </main>
    </>
  );
}
