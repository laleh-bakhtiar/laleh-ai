import { useRouter } from 'next/router';
import { useEffect } from 'react';

function isInternalLink(href) {
	if (!href) return false;
	if (href.startsWith('http://') || href.startsWith('https://') || href.startsWith('mailto:') || href.startsWith('tel:')) {
		return false;
	}
	return href.startsWith('/');
}

export function useLegacyNavigation() {
	const router = useRouter();

	useEffect(() => {
		if (typeof window === 'undefined') return;
		const header = document.querySelector('.cento-header');
		if (!header) return;

		const body = document.body;

		const submenuItems = Array.from(header.querySelectorAll('li.wsite-menu-item-wrap, li.wsite-menu-subitem-wrap'));
		submenuItems.forEach((li) => {
			const submenu = li.querySelector(':scope > .wsite-menu-wrap');
			if (submenu && !li.classList.contains('has-submenu')) {
				li.classList.add('has-submenu');
				if (!li.querySelector(':scope > span.icon-caret')) {
					const caret = document.createElement('span');
					caret.className = 'icon-caret';
					li.appendChild(caret);
				}
			}
		});

		const hamburger = header.querySelector('label.hamburger');
		const handleHamburger = (event) => {
			event.preventDefault();
			body.classList.toggle('nav-open');
		};
		hamburger?.addEventListener('click', handleHamburger);

		const closeMobileNav = () => {
			body.classList.remove('nav-open');
		};

		const handleCaretClick = (event) => {
			const li = event.currentTarget.closest('li.has-submenu');
			if (!li) return;
			event.preventDefault();
			const submenu = li.querySelector(':scope > .wsite-menu-wrap');
			if (submenu) {
				submenu.classList.toggle('open');
			}
		};

		const caretListeners = [];
		const mobileCarets = header.querySelectorAll('.mobile-nav li.has-submenu > span.icon-caret');
		mobileCarets.forEach((caret) => {
			caret.addEventListener('click', handleCaretClick);
			caretListeners.push(caret);
		});

		const desktopListeners = [];
		const desktopItems = header.querySelectorAll('.desktop-nav li.has-submenu');
		desktopItems.forEach((item) => {
			const submenu = item.querySelector(':scope > .wsite-menu-wrap');
			if (!submenu) return;
			const show = () => submenu.style.setProperty('display', 'block');
			const hide = () => submenu.style.setProperty('display', 'none');
			item.addEventListener('mouseenter', show);
			item.addEventListener('mouseleave', hide);
			desktopListeners.push({ item, show, hide });
		});

		const handleLinkClick = (event) => {
			const anchor = event.currentTarget;
			const href = anchor.getAttribute('href');
			if (!isInternalLink(href)) return;
			event.preventDefault();
			closeMobileNav();
			router.push(href);
		};

		const anchorListeners = [];
		const anchors = header.querySelectorAll('a[href]');
		anchors.forEach((anchor) => {
			anchor.addEventListener('click', handleLinkClick);
			anchorListeners.push(anchor);
		});

		const handleRouteChange = () => {
			closeMobileNav();
		};
		router.events.on('routeChangeComplete', handleRouteChange);

		return () => {
			hamburger?.removeEventListener('click', handleHamburger);
			caretListeners.forEach((caret) => caret.removeEventListener('click', handleCaretClick));
			desktopListeners.forEach(({ item, show, hide }) => {
				item.removeEventListener('mouseenter', show);
				item.removeEventListener('mouseleave', hide);
			});
			anchorListeners.forEach((anchor) => anchor.removeEventListener('click', handleLinkClick));
			router.events.off('routeChangeComplete', handleRouteChange);
		};
	}, [router, router.asPath]); // re-run after each navigation
}
