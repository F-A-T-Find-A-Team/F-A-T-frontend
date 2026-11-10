'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { authApi, clearAccessToken } from '@/app/lib/api';

export default function SideBar() {
    const pathname = usePathname();
    const router = useRouter();
    const sideOpsList = [
        { name: '탐색', href: '/search' },
        { name: '프로젝트 생성', href: '/pjcreate' },
        { name: '채팅', href: '/chat' },
        { name: '마이페이지', href: '/mypage' },
    ];

    const logout = async () => {
        await authApi.logout().catch(() => undefined);
        clearAccessToken();
        router.replace('/login');
    };

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

            <div className='sideBar-my'>
                <div className='sideBar-myprofile'>

                </div>

                <div className='sideBar-myinfo'>
                    <h5>hwjeong</h5>
                    <span>1107 · FE</span>
                </div>
                <button type="button" className="sideBar-logout" onClick={logout}>로그아웃</button>
            </div>
        </aside>
    );
}