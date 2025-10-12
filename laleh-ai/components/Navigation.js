import Link from 'next/link';
import { useState } from 'react';

const NAV_ITEMS = [
	{ label: 'Home', href: '/' },
	{
		label: 'About',
		submenu: [
			{ label: 'Dr. Laleh Bakhtiar', href: '/dr-laleh-bakhtiar' },
			{ label: 'Dr. Abolghassem Bakhtiar', href: '/abol-toos' },
			{ label: 'Helen Jeffreys Bakhtiar', href: '/helen-toos' },
			{ label: 'Dr. Cyrus Bakhtiar', href: '/cyrus-toos' },
		],
	},
	{ label: 'Laleh AI', href: '/laleh-ai' },
	{ label: 'Books', href: '/books' },
	{ label: 'Laleh Knowledge Lake', href: '/laleh-knowledge-lake' },
	{ label: 'Institute', href: '/institute' },
	{ label: 'Contact', href: '/contact' },
	{
		label: 'Donate',
		href: 'https://donorbox.org/donations-to-the-institute-of-traditional-psychoethics-and-guidance?default_interval=o',
		external: true,
	},
];

export default function Navigation() {
	const [openMenu, setOpenMenu] = useState(null);
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

	const handleOpen = (key) => setOpenMenu(key);
	const handleClose = () => setOpenMenu(null);
	const toggleMenu = (key) => setOpenMenu((current) => (current === key ? null : key));
	const handleMouseLeave = (event, key) => {
		const nextTarget = event.relatedTarget;
		if (nextTarget && event.currentTarget.contains(nextTarget)) {
			return;
		}
		if (openMenu === key) {
			setOpenMenu(null);
		}
	};
	const toggleMobileMenu = () =>
		setMobileMenuOpen((current) => {
			const next = !current;
			if (!next) {
				handleClose();
			}
			return next;
		});
	const closeAllMenus = () => {
		handleClose();
		setMobileMenuOpen(false);
	};

	return (
		<header className="site-header">
			<div className="site-header__inner">
				<div className="site-header__logo">
					<Link href="/" aria-label="Laleh Bakhtiar Home">
						<img
							src="/uploads/1/2/5/2/125200189/published/laleh-logo%EF%B9%961634332399.png"
							alt="Laleh Bakhtiar"
							/>
						</Link>
					</div>

					<button
						type="button"
						className="site-header__toggle"
						onClick={toggleMobileMenu}
						aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
						aria-expanded={mobileMenuOpen}
						aria-controls="primary-navigation"
					>
						<span />
						<span />
						<span />
					</button>

					<nav
						className={`site-header__nav${mobileMenuOpen ? ' is-open' : ''}`}
						aria-label="Main navigation"
						id="primary-navigation"
					>
						<ul className="site-header__menu">
							{NAV_ITEMS.map((item) => {
								const hasSubmenu = Boolean(item.submenu?.length);
								const isOpen = openMenu === item.label;

								return (
									<li
										key={item.label}
										className={`site-header__menu-item${hasSubmenu ? ' has-submenu' : ''}${
											isOpen ? ' is-open' : ''
										}`}
										onMouseEnter={() => hasSubmenu && !mobileMenuOpen && handleOpen(item.label)}
										onMouseLeave={(event) =>
											hasSubmenu && !mobileMenuOpen && handleMouseLeave(event, item.label)
										}
									>
										{hasSubmenu ? (
											<button
												type="button"
												className="site-header__link"
												aria-haspopup="true"
												aria-expanded={isOpen}
												onClick={() => toggleMenu(item.label)}
												onFocus={() => handleOpen(item.label)}
											>
												{item.label}
											</button>
										) : item.external ? (
											<a
												className="site-header__link"
												href={item.href}
												target="_blank"
												rel="noreferrer"
												onClick={closeAllMenus}
											>
												{item.label}
											</a>
										) : (
											<Link className="site-header__link" href={item.href} onClick={closeAllMenus}>
												{item.label}
											</Link>
										)}

										{hasSubmenu && (
										<ul className="site-header__submenu" role="menu">
											{item.submenu.map((subitem) => (
												<li key={subitem.label} role="none">
													<Link
														className="site-header__submenu-link"
														href={subitem.href}
														role="menuitem"
														onClick={closeAllMenus}
													>
														{subitem.label}
													</Link>
												</li>
											))}
										</ul>
									)}
								</li>
							);
						})}
					</ul>
				</nav>
			</div>
		</header>
	);
}
