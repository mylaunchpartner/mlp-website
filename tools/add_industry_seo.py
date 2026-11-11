import re
D = {
 'waste-management': dict(
  h2='SEO for dumpster rental <span class="mlp-grad-text">and junk removal companies.</span>',
  intro='When someone needs a dumpster, they search, call the first two or three companies and book whoever answers. SEO puts you in those first results for every town your trucks cover, without paying for every click.',
  cards=[('Service-area pages','A page for every city and town you serve, so you show up for "dumpster rental [city]" across your whole territory.'),
         ('Size &amp; pricing pages','Pages for each dumpster size and job type (roll-off, construction, cleanouts) that answer what people search before they call.'),
         ('Google Maps &amp; reviews','A tuned Google Business Profile and automatic review requests after every pickup, so you climb the map pack.'),
         ('Local content','Articles on permits, what fits in a 20-yard and how to prep a cleanout, written for the questions your customers type.')],
  faq=[('Do you do SEO for dumpster rental and junk removal companies?','Yes. We build service-area pages for every city you cover, dumpster size and job-type pages, Google Business Profile work and local content, and you only pay performance fees when your searches reach page 1.'),
       ('Should a dumpster company do SEO or Google Ads?','Both, ideally. Ads bring calls this week. SEO builds rankings you don\'t pay for per click, so over time it lowers what each booked job costs you.')]),
 'fitness-coaches': dict(
  h2='SEO for <span class="mlp-grad-text">online fitness coaches.</span>',
  intro='Your future clients search for answers long before they buy a program. SEO puts your name on the results they find, so leads arrive already trusting you instead of only from the posts you push every day.',
  cards=[('Program &amp; offer pages','Pages built around how people search for coaching: online fat loss coach, strength coaching for women, postpartum training and more.'),
         ('Answer-first content','Articles that answer the questions your audience asks, each pointing to your free challenge or application.'),
         ('Technical setup','Fast, mobile-first pages on GoHighLevel, Kajabi or WordPress, with the markup that helps Google and AI search tools describe you.'),
         ('Authority &amp; mentions','Podcast, guest and directory links that tell Google you\'re a real expert, not another anonymous program.')],
  faq=[('Do online fitness coaches need SEO if they already post on social media?','Social posts disappear in a day. A page that ranks keeps bringing in leads for months, from people who are actively searching for what you sell.'),
       ('Can you do SEO on Kajabi or GoHighLevel?','Yes. We work inside the platform you already use and tell you in your $1 audit if anything about it is holding your rankings back.')]),
 'gyms-fitness-studios': dict(
  h2='SEO for <span class="mlp-grad-text">gyms and fitness studios.</span>',
  intro='"Gym near me" and "pilates studio [city]" are some of the highest-intent searches in fitness. SEO puts your studio in the map pack and the top results for your neighborhood, so new members find you before the big chains.',
  cards=[('Google Maps &amp; reviews','A fully built Google Business Profile with classes, photos and steady review requests from members, so you rank in the map pack.'),
         ('Class &amp; location pages','A page for each class type and neighborhood you draw from: HIIT, yoga, personal training and more.'),
         ('Intro-offer pages','Pages built to turn a search into a booked trial class or intro offer, not just a visit.'),
         ('Local content','Articles on what to expect at a first class, beginner guides and local events that bring nearby searchers to you.')],
  faq=[('Do you do SEO for gyms and fitness studios?','Yes. We handle Google Business Profile and reviews, class and neighborhood pages, intro-offer pages and local content, and you only pay performance fees when your searches reach page 1.'),
       ('How do gyms show up in "gym near me" searches?','Mostly through the Google Maps pack: a complete Business Profile, steady recent reviews and a website that clearly says where you are and what you offer. We work on all three.')]),
 'in-person-retreats': dict(
  h2='SEO for <span class="mlp-grad-text">retreat hosts and retreat centers.</span>',
  intro='People plan retreats months ahead and search a lot before they book: by type, by place and by season. SEO puts your retreats in front of them while they\'re still deciding, instead of only when you\'re paying for ads.',
  cards=[('Retreat &amp; destination pages','A page for each retreat, theme and location (wellness retreat Sedona, women\'s retreat Costa Rica) built to rank and convert.'),
         ('Planning content','Articles on what to pack, what to expect and how to choose a retreat, each pointing to your upcoming dates.'),
         ('Event markup','Structured data for dates, prices and availability, so Google can show your retreats with rich details.'),
         ('Authority &amp; listings','Retreat directories, partner venues and press mentions that tell Google you\'re an established host.')],
  faq=[('Do you do SEO for retreat hosts?','Yes. We build retreat and destination pages, planning content and event markup, and get you listed on the directories retreat-goers use. You only pay performance fees when your searches reach page 1.'),
       ('How far ahead should a retreat start SEO?','As early as possible. Rankings take weeks to months, and people start searching for retreats months before the dates, so pages for next season\'s retreats should go up now.')]),
 'payment-processors': dict(
  h2='SEO for <span class="mlp-grad-text">payment processors and ISOs.</span>',
  intro='Merchants search for processing by industry and by problem: high-risk merchant account, CBD payment processing, lower credit card fees. SEO puts your offer in those results, so merchants come to you already looking to switch.',
  cards=[('Industry pages','A page for every vertical you board, built around how those merchants search for processing.'),
         ('Problem-first content','Articles on chargebacks, reserves, rate comparisons and terminated accounts, the questions merchants ask before they switch.'),
         ('Agent &amp; ISO recruiting pages','Pages that rank for agent program and residual searches, if you\'re growing a sales team too.'),
         ('Trust &amp; authority','Directory listings, reviews and industry links that matter in a category where merchants are wary.')],
  faq=[('Do you do SEO for payment processors and merchant services companies?','Yes. We build industry and high-risk vertical pages, problem-first content, agent recruiting pages and authority links, and you only pay performance fees when your searches reach page 1.'),
       ('Can SEO work for high-risk merchant accounts?','Yes. High-risk merchants search for specific answers, like processing for their industry, and few processors have good pages for them. That makes those searches easier to win than general ones.')]),
 'ruo-peptides-and-chemicals': dict(
  h2='SEO for <span class="mlp-grad-text">research peptide and chemical suppliers.</span>',
  intro='Ad platforms restrict research-use-only products, which makes organic search one of the few channels you can grow on. We build SEO that ranks for research buyers while keeping every page inside compliance lines.',
  cards=[('Compliant product pages','Product and category pages written for researchers, with research-use-only language and no health or dosing claims.'),
         ('Technical SEO for stores','Fast WooCommerce or Shopify pages, clean category structure and product markup.'),
         ('Research content','Educational articles on purity testing, COAs, storage and handling, the topics research buyers search.'),
         ('Authority without risk','Links and listings from sources that won\'t put your merchant account or domain at risk.')],
  faq=[('Can research peptide companies do SEO?','Yes, and it\'s one of the few channels you can grow on, since most ad platforms restrict research-use-only products. Every page we write stays inside research-use-only language with no health or dosing claims.'),
       ('Will SEO content put my merchant account at risk?','Not when it\'s written correctly. We keep product and blog content compliant with research-use-only rules, the same standards processors check for when they review your site.')]),
}

TPL = '''
  <!-- ═══════════ SEO ═══════════ -->
  <section class="mlp-section mlp-process mlp-seo-ind" id="mlp-seo-ind">
    <div class="mlp-wrap">
      <div class="mlp-head mlp-reveal">
        <span class="mlp-eyebrow">SEO</span>
        <h2>{h2}</h2>
        <p>{intro}</p>
      </div>
      <div class="mlp-proc-grid">
{cards}
      </div>
      <div class="mlp-svc-band mlp-reveal" style="margin-top:28px">
        <div>
          <h4>See where you rank today for $1</h4>
          <p>Our $1 SEO audit shows your current Google positions, who's beating you and what to fix first. If we take on your SEO, you only pay performance fees when your searches hit page 1. <a href="/seo">How our SEO works</a>.</p>
        </div>
        <a href="/audit" class="mlp-btn mlp-btn-white">Get my $1 SEO audit <svg><use href="#mlp-i-arrow"/></svg></a>
      </div>
    </div>
  </section>
'''
CARD = '''        <div class="mlp-proc mlp-glass mlp-reveal" style="--d:{d}s">
          <div class="mlp-proc-n mlp-grad-text">0{n}</div>
          <h3>{t}</h3>
          <p>{p}</p>
        </div>'''
FAQ = '''        <details>
          <summary>{q}<span><svg><use href="#mlp-i-plus"/></svg></span></summary>
          <p>{a}</p>
        </details>
'''
for slug, d in D.items():
    p = 'pages/specialty/%s.html' % slug
    s = open(p).read()
    if 'id="mlp-seo-ind"' in s: print('skip', slug); continue
    cards = '\n'.join(CARD.format(d='%.2f' % (i*0.06), n=i+1, t=t, p=pp) for i, (t, pp) in enumerate(d['cards']))
    sec = TPL.format(h2=d['h2'], intro=d['intro'], cards=cards)
    i = s.index('<!-- ═══════════ FIT')
    s = s[:i] + sec.lstrip('\n') + '\n  ' + s[i:]
    j = s.rindex('</div>\n    </div>\n  </section>')
    s = s[:j] + ''.join(FAQ.format(q=q, a=a) for q, a in d['faq']) + '      ' + s[j:]
    open(p, 'w').write(s)
    print('ok', slug, s.count('<details>'))
