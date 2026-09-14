import { Motion } from '@/components/Motion';
import { About } from '@/components/sections/About';
import { Contact } from '@/components/sections/Contact';
import { Faq } from '@/components/sections/Faq';
import { Figures } from '@/components/sections/Figures';
import { Founders } from '@/components/sections/Founders';
import { Hero } from '@/components/sections/Hero';
import { Impact } from '@/components/sections/Impact';
import { Industries } from '@/components/sections/Industries';
import { Process } from '@/components/sections/Process';
import { Ribbon } from '@/components/sections/Ribbon';
import { Services } from '@/components/sections/Services';
import { Statement } from '@/components/sections/Statement';
import { Testimonials } from '@/components/sections/Testimonials';
import { Why } from '@/components/sections/Why';

/** The page, in order. Thirteen sections plus the ribbon band. */
export function PageSections() {
  return (
    <main id="top">
      <Motion />
      <Hero />
      <Figures />
      <About />
      <Services />
      <Ribbon />
      <Statement />
      <Impact />
      <Process />
      <Why />
      <Industries />
      <Testimonials />
      <Founders />
      <Faq />
      <Contact />
    </main>
  );
}
