### title
Hi, my name is Alex, and I'm here to tell you a story about a little weather service called 'Yr'

### history
[STEP] Yr is a collaboration between Norway's state broadcaster, NRK, (where I work) and it's Meteorological Institute, known as Met (because 'meteorological' is *really* hard to say)
  
Although NRK and Met have collaborated to deliver weather reports to Norwegians since forever, first via radio, then TV, in 2007 they released yr.no on the internets

[STEP] The website quickly became one of the most used in Norway...

[STEP] ...and last summer we had 9 million (unique) visitors per week...

[STEP] ...of which approximately 60% used a mobile device (evenly split between web and native apps)

### geography 
You might be wondering where all these people come from if there are only 5 million people in Norway...

[STEP] ...and the answer to that would be everywhere expect, apparently, Western Sahara

[STEP] Norway accounts for a little under 50% of traffic, with most of the remaining top 10 coming from northern Europe. Strangely, we are big with South African farmers, and though we are *not* so big in Japan...

[STEP] ...we did record 31 sessions from North Korea, so maybe that counts as big in North Korea

### mobile
[STEP] In 2007, if you wipped out your top-of-the-line Nokia N95, Yr would have looked something like this

[STEP] Unfortunately, in 2015, if you wipped out your top-of-the-line iPhone 6, Yr would still have looked something like this...

[STEP] ...though with a little bit of work, you could opt for the desktop version instead

[STEP] The mobile version had a lot going for it:
  - it was light on bandwidth
  - it was very simple, so it worked well on different sized screens
  - but it was also light on features

[STEP] The desktop version, on the other hand
  - is heavy on features and content
  - but also heavy on bandwidth
  - and not responsive to screen size at all

### architecture
In 2013, it was decided that Yr needed a better mobile web experience, and that the most future-proof approach would be to (eventually) move all traffic to a single, responsive site

[STEP] One of the biggest obstacles in our way was the classic, monolithic application, so instead of trying to update things piece by piece... 

[STEP] ...we decided to start from scratch

This was a really satisfying way to start things off, but it was probably a mistake, because soon we were taking care of 2 different systems




  - classic monolith
  - TFS -> GIT
  - break into component parts
  - OOPS! UI render split between platforms
  - Node/universal .js (summer 2014 prototype)
  - OOPS! environments out of sync
- plan
  - www. (responsive)
  - 11,996 devices
  - 641 different screen resolutions
  - native apps (if you're into that kind of thing)
- universal
  - SSR?
    - robust/accessible
    - caching
    - progressive
  - context switching costs
  - simpler mental model
  - aside: open office (Facebook)?
  - conceptually similar, but different concerns
  - many concurrent short sessions vs. single long session (updated)
  - 80% shared code (14/6/80)
- routing
  - express(-client).js
    - history api
  - shared routes/param validation
  - middleware
  - url => state
- data
  - mutable vs. immutable
- render
  - React.js
  - unidirectional flow
  - "React and the economics of dynamic web interfaces": Nicholas Zakas (https://www.nczonline.net/blog/2016/01/react-and-the-economics-of-dynamic-web-interfaces)
    - "it fundamentally changes an equation we've all been working with for years, and an idea can be much more powerful than the technology implementing it"
    - "...the idea of DOM updates being fast ... is important"
    - "The cost of each render remains relatively consistent and is based only on the parts of the page that have changed, so there's little difference between manually re-rendering just the part of the page that has changed and re-rendering the entire page. Those are effectively the same operations"
    - "React has, ironically, allowed us to once again think about writing web applications as a series of pages rather than a monolithic blob of JavaScript code"
    - "it's the same mental model as traditional server-only applications. A page is rendered, some changes are requested, then a page is rendered with those changes"
