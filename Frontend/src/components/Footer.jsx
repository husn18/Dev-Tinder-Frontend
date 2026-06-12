const Footer = () => {
  return (
    <footer className="border-t border-hairline bg-canvas/60 py-8 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded bg-accent-primary/20 text-xs font-semibold text-accent-primary">
              DT
            </span>
            <span className="text-sm font-semibold tracking-tight text-ink">Dev-Tinder</span>
          </div>
          <p className="text-xs text-ink-subtle">
            &copy; {new Date().getFullYear()} Dev-Tinder. Matching developers worldwide for collaborative building.
          </p>
          <div className="flex gap-4 text-xs text-ink-subtle">
            <a href="https://github.com" target="_blank" rel="noreferrer" className="hover:text-accent-primary transition">
              GitHub
            </a>
            <span>&bull;</span>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="hover:text-accent-primary transition">
              LinkedIn
            </a>
            <span>&bull;</span>
            <span className="text-ink-subtle/50">v1.1.0</span>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
