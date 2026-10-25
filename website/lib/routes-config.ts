// for page navigation & to sort on leftbar

export type EachRoute = {
  title: string;
  href: string;
  noLink?: true;
  items?: EachRoute[];
};

export const ROUTES: EachRoute[] = [
  {
    title: 'Start',
    href: '',
    noLink: true,
    items: [
      { title: 'Getting Started', href: '/getting-started' },
      { title: 'Installation', href: '/installation' },
    ],
  },
  {
    title: 'Guides',
    href: '/guides',
    noLink: true,
    items: [
      { title: 'Popover', href: '/popover' },
      { title: 'Bottom Sheet', href: '/sheet' },
      { title: 'Multi-select', href: '/multi-select' },
      { title: 'Animation', href: '/animation' },
      { title: 'Search', href: '/search' },
      { title: 'Customization', href: '/customization' },
    ],
  },
  {
    title: 'API',
    href: '/api',
    noLink: true,
    items: [
      { title: 'Dropdown', href: '/dropdown' },
      { title: 'DropdownProvider', href: '/dropdown-provider' },
      { title: 'useDropdown', href: '/use-dropdown' },
    ],
  },
];

type Page = { title: string; href: string };

function getRecurrsiveAllLinks(node: EachRoute) {
  const ans: Page[] = [];
  if (!node.noLink) {
    ans.push({ title: node.title, href: node.href });
  }
  node.items?.forEach((subNode) => {
    const temp = { ...subNode, href: `${node.href}${subNode.href}` };
    ans.push(...getRecurrsiveAllLinks(temp));
  });
  return ans;
}

export const page_routes = ROUTES.map((it) => getRecurrsiveAllLinks(it)).flat();
