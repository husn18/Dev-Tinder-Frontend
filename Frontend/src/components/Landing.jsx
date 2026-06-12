import { Link } from 'react-router-dom'

const mockProfiles = [
  {
    name: 'Sarah Chen',
    role: 'Staff Go & Distributed Systems Engineer',
    location: 'San Francisco, CA (Remote)',
    skills: ['Go', 'Kubernetes', 'gRPC', 'Redis', 'Docker'],
    lookingFor: 'Startup Co-Founder',
    bio: 'Ex-Stripe. Building a next-gen developer productivity tool. Looking for a full-stack engineer who is obsessed with UX to join as co-founder.',
    photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
  },
  {
    name: 'Marcus Vance',
    role: 'Senior React Developer',
    location: 'Berlin, Germany',
    skills: ['React', 'TypeScript', 'Next.js', 'Tailwind', 'GraphQL'],
    lookingFor: 'Hackathon Teammate',
    bio: 'Obsessed with animations and clean layouts. Competing in the upcoming global hackathon. Looking for a backend wizard to handle APIs and smart contracts.',
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
  },
  {
    name: 'Elena Rostova',
    role: 'AI / ML Research Engineer',
    location: 'Remote friendly',
    skills: ['Python', 'PyTorch', 'TensorFlow', 'LLMs', 'Transformers'],
    lookingFor: 'Open Source Collaborator',
    bio: 'Working on a local-first voice assistant using lightweight LLMs. Looking for developers to contribute to Node.js bindings and hardware integrations.',
    photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  }
]

const Landing = () => {
  return (
    <div className="app-shell flex flex-col justify-between">
      {/* Hero Section */}
      <section className="mx-auto max-w-7xl px-4 py-16 text-center sm:px-6 sm:py-24 lg:px-8">
        <span className="inline-flex items-center gap-2 rounded-full border border-[#23252a] bg-surface-1 px-3 py-1.5 text-xs font-semibold tracking-[0.4px] text-ink-muted eyebrow">
          <span className="h-2 w-2 rounded-full bg-accent-primary" />
          The Developer Network
        </span>
        <h1 className="mt-8 text-4xl font-semibold tracking-[-1.8px] text-ink sm:text-6xl lg:text-7xl">
          Where builders find their <span className="text-accent-primary">ideal matches</span>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-base text-ink-muted sm:text-lg leading-7">
          Match with pair-programming partners, open-source collaborators, hackathon teammates, startup co-founders, or tech mentors based on tech stack and shared goals.
        </p>
        <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
          <Link
            to="/signup"
            className="rounded-md bg-accent-primary px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-accent-hover focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-accent-primary"
          >
            Create Profile
          </Link>
          <Link
            to="/login"
            className="rounded-md border border-hairline bg-surface-1 px-6 py-2.5 text-sm font-semibold text-ink hover:bg-surface-2 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-accent-primary"
          >
            Sign In
          </Link>
        </div>
      </section>

      {/* Mock Showcase */}
      <section className="border-y border-hairline bg-canvas/40 py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-semibold tracking-[-0.6px] text-ink sm:text-4xl">Meet developers who are building today</h2>
            <p className="mt-4 text-sm text-ink-subtle">Filter profiles by goals, location, experience, and complete tech stacks.</p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {mockProfiles.map((p, idx) => (
              <div
                key={idx}
                className="linear-panel-1 flex flex-col justify-between p-6 transition duration-150 hover:bg-surface-2"
              >
                <div>
                  <div className="flex items-center gap-4">
                    <img
                      src={p.photo}
                      alt={p.name}
                      width={56}
                      height={56}
                      className="h-14 w-14 rounded-lg object-cover border border-hairline"
                    />
                    <div>
                      <h3 className="text-base font-semibold text-ink">{p.name}</h3>
                      <p className="text-xs text-ink-subtle">{p.location}</p>
                    </div>
                  </div>

                  <div className="mt-4">
                    <span className="rounded bg-surface-2 border border-hairline px-2 py-0.5 text-xs text-ink-muted">
                      Looking for: {p.lookingFor}
                    </span>
                  </div>

                  <p className="mt-4 text-sm leading-6 text-ink-muted line-clamp-4">
                    “{p.bio}”
                  </p>
                </div>

                <div className="mt-6 border-t border-hairline pt-4">
                  <p className="text-xs font-semibold tracking-[0.4px] text-ink-subtle uppercase">Tech Stack</p>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {p.skills.map(s => (
                      <span key={s} className="rounded bg-surface-3 px-2 py-0.5 text-xs font-mono text-ink-muted border border-hairline">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Collaboration Goals Section */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div className="text-left">
            <h2 className="text-3xl font-semibold tracking-[-0.6px] text-ink sm:text-4xl">
              Engineered for developer collaboration
            </h2>
            <p className="mt-4 text-base text-ink-muted leading-7">
              Dev-Tinder removes the friction of networking. Instead of sending long cold messages on LinkedIn or searching github issues blindly, find developers who are actively looking for collaboration.
            </p>

            <dl className="mt-10 space-y-6">
              {[
                { title: 'Coding Partners', desc: 'Find builders to pair program with, learn new languages, and review each other\'s PRs.' },
                { title: 'Startup Co-founders', desc: 'Connect with technical co-founders to validate ideas and launch side-projects or startups.' },
                { title: 'Hackathon Teammates', desc: 'Filter by skills to find teammates who complement your stack for local and remote hackathons.' },
                { title: 'Mentorship & Exchange', desc: 'Find experienced mentors who can guide you, or guide junior developers to solidify your own knowledge.' }
              ].map(g => (
                <div key={g.title} className="relative pl-9 text-left">
                  <dt className="text-base font-semibold text-ink">
                    <span className="absolute left-0 top-2 h-2.5 w-2.5 rounded-full bg-accent-primary" />
                    {g.title}
                  </dt>
                  <dd className="mt-1 text-sm text-ink-muted">{g.desc}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="linear-panel-1 p-8 shadow-2xl relative overflow-hidden">
            <div className="flex items-center justify-between border-b border-hairline pb-4 mb-6">
              <div className="flex gap-2">
                <span className="h-3 w-3 rounded-full bg-surface-3 border border-hairline" />
                <span className="h-3 w-3 rounded-full bg-surface-3 border border-hairline" />
                <span className="h-3 w-3 rounded-full bg-surface-3 border border-hairline" />
              </div>
              <span className="text-xs font-mono text-ink-subtle">DevTinderEngine.js</span>
            </div>

            <pre className="font-mono text-xs text-ink-muted overflow-x-auto space-y-1 text-left">
              <code>{`// Querying potential partners`}</code>
              <br />
              <code className="text-[#5e6ad2]">{`const`}</code> <code>{`feed = await User.find({`}</code>
              <br />
              <code>{`  skills: { `}</code><code className="text-[#828fff]">{`$in`}</code><code>{`: [`}</code><code className="text-teal-300">`React`</code><code>{`, `}</code><code className="text-teal-300">`TypeScript`</code><code>{`] },`}</code>
              <br />
              <code>{`  experienceLevel: `}</code><code className="text-teal-300">`Senior`</code><code>{`,`}</code>
              <br />
              <code>{`  lookingFor: `}</code><code className="text-teal-300">`Startup Co-Founder`</code>
              <br />
              <code>{`}).select(`}</code><code className="text-teal-300">`'firstname lastname githubUrl'`</code><code>{`);`}</code>
              <br />
              <br />
              <code>{`if (feed.hasMatch()) {`}</code>
              <br />
              <code className="text-[#5e6ad2]">{`  console`}</code><code>{`.log(`}</code><code className="text-teal-300">`🚀 Direct connection established!`</code><code>{`);`}</code>
              <br />
              <code>{`}`}</code>
            </pre>

            <div className="mt-8 rounded bg-surface-2 border border-hairline p-4 text-center">
              <p className="text-xs font-mono text-accent-primary">STATUS: ACTIVE GENERATOR</p>
            </div>
          </div>
        </div>
      </section>

      {/* Action CTA Block */}
      <section className="border-t border-hairline bg-surface-1 py-16 text-center">
        <h2 className="text-3xl font-semibold tracking-[-0.6px] text-ink sm:text-4xl">Ready to expand your developer network?</h2>
        <p className="mx-auto mt-4 max-w-xl text-sm text-ink-muted">Join thousands of builders who are pairing up, collaborating on github, and launching products.</p>
        <div className="mt-8 flex justify-center">
          <Link
            to="/signup"
            className="rounded-md bg-accent-primary px-8 py-3.5 text-sm font-semibold text-white transition hover:bg-accent-hover shadow-lg shadow-accent-primary/20"
          >
            Create Your Profile Now
          </Link>
        </div>
      </section>
    </div>
  )
}

export default Landing
