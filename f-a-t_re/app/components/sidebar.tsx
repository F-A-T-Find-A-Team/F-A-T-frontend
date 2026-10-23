'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function SideBar() {
    const pathname = usePathname();
    const sideOpsList = [
        { name: '탐색', href: '/search' },
        { name: '프로젝트 생성', href: '/pjcreate' },
        { name: '채팅', href: '/chat' },
        { name: '마이페이지', href: '/mypage' },
    ];

    return (
        <aside className="sideBar-container">
            <h1 className="sideBar-brand">F.A.T.</h1>
            <nav className="sideBar-nav" aria-label="주요 메뉴">
                {sideOpsList.map((item) => (
                    <div className='sideBar-linkBox' key={item.href}>
                        <div className='sideBar-circle'></div>
                        <Link
                            key={item.href}
                            className={`sideBar-link${pathname === item.href ? ' active' : ''}`}
                            href={item.href}
                            aria-current={pathname === item.href ? 'page' : undefined}
                        >
                            {item.name}
                        </Link>
                    </div>
                ))}
            </nav>
        </aside>
    );
}