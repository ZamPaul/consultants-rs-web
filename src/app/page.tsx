import { PageSections } from '@/components/sections';
import { SiteFooter } from '@/components/SiteFooter';
import { SiteHeader } from '@/components/SiteHeader';

export default function Home() {
  return (
    <>
      <div id="prog" aria-hidden="true" />
      <SiteHeader />
      <PageSections />
      <SiteFooter />
    </>
  );
}
