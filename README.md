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

[STEP] Unfortunately, in 2012, if you wipped out your top-of-the-line iPhone, Yr would still have looked something like this...

[STEP] ...though with a little bit of work, you could opt for the desktop version instead

[STEP] The mobile version had a lot going for it:
  - it was light on bandwidth
  - it was very simple, so it worked well on different sized screens
  - but it was also light on features

[STEP] The desktop version, on the other hand
  - is heavy on features and content
  - but also heavy on bandwidth
  - and not responsive to screen size at all

Although mobile represented only 1/3 of traffic at that time, it was obvious that Yr needed a better mobile web experience

The plan going forward was to make Yr "responsive", starting with a mobile site optimized for the devices of the day, eventually growing to replace the traditional "desktop" version

### architecture
In 2013, I joined the team as a front-end developer and designer in order to help build this responsive vision of the future

At that time, the team was 3 developers strong, and the application looked something like this...

[STEP] ...a giant blob of data lying under a layer of XML, with several view render layers handling requests for mobile pages, desktop pages, app embedded views, svgs, pdfs, and more!

It was a (largely) reliable system that had proven itself over several years...

[STEP] ...but it was also very scary to update or change!
  - had very few tests of any kind (email-driven-development: users would email error reports and regressions)
  - 2 week delay to verify releases

[STEP] Naturally, in our eagerness to "do things right", we decided to start from scratch...

[STEP] ...so the first thing we did was pull out all the place name data into it's own service. This represented some 80% of the existing code base, and was where we made our first serious mistake: it was too difficult to replace the existing implementation in our monolith, so both systems were destined to drift out of sync (though we didn't realize it at the time)

[STEP] The next step was to build a REST API and new view renderer for the markup I was designing

After spending some time with a workflow that consisted of me sending static markup changes to my colleague to implement, it became clear this just wasn't going work...

[STEP] ...so after a lot of prodding, and a skunkworks prototype, we split the API and view renderer into separate projects, and the front-end department became responsible for the render stack

### universal
Since late 2014 we have been doing the whole thing in JavaScript with Node.js. At that time, it wouldn't have been totally crazy to opt for client-only rendering, but from the very beginning our goal has been to render on the server on first request, with subsequent requests handled directly by the client

We feel this pattern best matches our content while providing an optimal experience for all our users

Specifically, it's...

[STEP] ...cacheable. Most of the forecast data we get from Met expires hourly, so the cost of that server render can be spread over many requests. It's also...

[STEP] ...resilient. The browser is hostile territory, and bad things happen all the time, so being able to show content when things are blowing up is an advantage. And it's...

[STEP] ...accessible. Not all devices are created equal (in 2015 we had visits from 11,996 different ones), and server-side rendering allows us to deliver content to as many of them as possible. And lastly, it's...

[STEP] ...progressive. Delivering a decent baseline experience allows us to add additional features, and improve that experience, if a device supports it

[STEP] Basically, it's CRAP! It might not be a hip acronym like SPA, AMP, or PWA, but let's be honest, most of us love crap. We eat crap, we watch crap, and we spend a lot of time looking at crap on our phones. But seriously, this model is so CRAP it's awesome

### express
As a developer, this universal JavaScript thing is fantastic because it really minimizes the costs associated with context switching, while at the same time giving you full control over your content

At the time, I thought this was such an amazing idea, and I was so excited, that I ended up porting Express.js to run in the browser (I'll just let that sink in a little...)

So whether it's initializing an application...

[STEP] ...or adding middleware...

[STEP] ...or adding request param validation...

[STEP] ...or handling a request...

...it works the same on the server as it does in the browser

The initial trigger is different, of course (the HTTP pipeline in Node, and the History API in the browser), but the logic abstractions are the same: get an url, route it to a logic handler, munge some data, and render

[STEP] Sometimes we do have to do a little of this...

[STEP]...but overall we are able to share 80% of our code between the two environments...

[STEP]...and that probably leads to something like 42% less thinking

That's wonderful for us as developers, but it's also CRAP for our users (remembering of course that CRAP is awesome). 

By representing state as URLs, and by using anchor tags to link between sections, disabling JavaScript, or using a device that doesn't pass our mustard test, just works

<!-- ### caveats
Of course, it's not *all* sunsets and rainbows

It may be the same language, and we can impose similar abstractions, but the server and browser environments do have different concerns

[STEP] On the server, we are mostly concerned with the total number of concurrent requests we can handle while responding as quickly as possible

[STEP] On the client 
 -->
- plan
  - 641 different screen resolutions
- universal
  - many concurrent short sessions vs. single long session (updated)
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
