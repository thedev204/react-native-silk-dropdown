import Link from 'next/link';
import { PhoneFrame } from '@/components/phone-frame';
import { CopyInstall } from '@/components/copy-install';
import { buttonVariants } from '@/components/ui/button';
import { GITHUB_URL, NPM_URL } from '@/lib/site';

const demos = [
  {
    file: '/videos/single_input.mp4',
    title: 'Searchable popover',
    body: 'Anchored to the trigger. Search stays usable when the keyboard is up.',
  },
  {
    file: '/videos/multi_input.mp4',
    title: 'Multi-select chips',
    body: 'Pick several values with animated chips and an optional maxSelected cap.',
  },
  {
    file: '/videos/sheet_input.mp4',
    title: 'Bottom sheet',
    body: 'Same Dropdown API — switch to a sheet with one prop.',
  },
] as const;

export default function Home() {
  return (
    <>
      <section className="hero">
        <div className="hero__copy">
          <h1 className="hero__title">
            Beautiful dropdowns.
            <br />
            One simple API.
          </h1>
          <p className="hero__lead">
            A smooth, keyboard-safe animated dropdown for React Native. Popover
            or bottom sheet — built for developers who care about design and
            ease of use.
          </p>
          <div className="hero__actions">
            <Link
              href="/docs/getting-started"
              className={buttonVariants({ size: 'lg', className: 'px-6' })}
            >
              Read the docs
            </Link>
            <Link
              href={GITHUB_URL}
              target="_blank"
              rel="noreferrer"
              className={buttonVariants({
                size: 'lg',
                variant: 'outline',
                className: 'px-6',
              })}
            >
              View on GitHub
            </Link>
          </div>
        </div>
        <div className="hero__media">
          <PhoneFrame src="/videos/full.mp4" label="Silk Dropdown overview" />
        </div>
      </section>

      <section className="demo-rows" aria-label="Features">
        {demos.map((demo) => (
          <article key={demo.file} className="demo-row">
            <div className="demo-row__copy">
              <h2>{demo.title}</h2>
              <p>{demo.body}</p>
            </div>
            <div className="demo-row__media">
              <PhoneFrame src={demo.file} label={demo.title} />
            </div>
          </article>
        ))}
      </section>

      <section className="install" aria-labelledby="install-heading">
        <div className="install__header">
          <div className="install__text">
            <h2 id="install-heading">Install in one command</h2>
            <p>
              New Architecture and Reanimated 4. Pure JS — works in Expo Go.
            </p>
          </div>
          <Link
            href="/docs/installation"
            className={buttonVariants({ size: 'lg', className: 'px-6' })}
          >
            Installation
          </Link>
        </div>
        <CopyInstall />
      </section>

      <footer className="site-footer">
        <div>Silk Dropdown · MIT · {new Date().getFullYear()}</div>
        <div className="site-footer__links">
          <Link href="/docs/getting-started">Docs</Link>
          <a href={GITHUB_URL} target="_blank" rel="noreferrer">
            GitHub
          </a>
          <a href={NPM_URL} target="_blank" rel="noreferrer">
            npm
          </a>
        </div>
      </footer>
    </>
  );
}
