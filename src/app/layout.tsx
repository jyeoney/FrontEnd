import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { MSWProvider } from '@/mocks/compoenets/MSWProvider';
import './globals.css';
import { cookies } from 'next/headers';

export const metadata: Metadata = {
  title: 'DevOnOff',
  description: '개발자 온오프라인 스터디 플랫폼',
};

const RootLayout = async ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;
  console.log(accessToken);

  // 사버에서 로그인 상태 확인
  const isSignedIn = Boolean(accessToken);
  console.log(isSignedIn);

  return (
    <html lang="ko" data-theme="pastel">
      <body className="min-h-screen bg-base-100 text-base-content">
        {process.env.NEXT_PUBLIC_API_MOCKING === 'enabled' && <MSWProvider />}
        <div className="flex flex-col min-h-screen">
          <Header initialSignedIn={isSignedIn} />
          <main className="flex-1 container mx-auto px-4 py-8">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
};

export default RootLayout;
