# Moonpost ✉︎☾

Whimsical, themed invitations for dates and events that you **send by text**.
The recipient taps the link, breaks the wax seal, RSVPs, adds the event to
their calendar, and texts their answer back to you.

![Link preview](og.png)

## How it works

1. **Build it.** Pick an occasion (dinner date, picnic, stargazing, sabbat
   gathering…), fill in the basics, choose a look, and add only the details
   that matter.
2. **Seal it.** Moonpost packs the whole invitation into the link itself.
   There's no server, database or account.
3. **Text it.** Tap **💬 Text it** to open Messages with the link ready to go,
   or copy/share it anywhere.
4. **They open it.** They see a themed envelope, tap the seal, and read the card.
5. **They answer.** *Yes*, *Maybe — another time?*, or *Sadly, I can't*. A yes
   gets a little celebration, answers to any questions you asked, and
   **Add to calendar** buttons (Apple/iPhone, Google, Outlook, .ics).
   Their reply opens as a pre-written text addressed to you.

## Themes

**Wheel of the Year (automatic).** By default the invitation follows the
Wheel of the Year. Your event date picks the closest sabbat, and there's a
Southern Hemisphere toggle:

| Season | Roughly | Feel |
|---|---|---|
| Imbolc | Jan 11 – Feb 24 | candlelight, first snowdrops |
| Ostara | Feb 25 – Apr 10 | pastel blooms, rabbits & eggs |
| Beltane | Apr 11 – May 26 | bonfires & flowers |
| Litha | May 27 – Jul 11 | golden midsummer sun |
| Lughnasadh | Jul 12 – Aug 27 | first harvest, wheat & bread |
| Mabon | Aug 28 – Oct 11 | falling leaves & gratitude |
| Samhain | Oct 12 – Nov 25 | the veil grows thin |
| Yule | Nov 26 – Jan 10 | evergreen, snow & the returning sun |

If the event lands *on* a sabbat, the card says so ("✨ It falls on Samhain
itself ✨"). Every card also shows the **moon phase** for that night and the
month's traditional moon name (e.g. "🌕 Beneath the full Hunter's Moon").

**Occasion themes.** You can also pick an occasion theme instead: Candlelit
Dinner, Starlit Night, Garden Picnic, Wild Adventure, Celebration, Cozy Night
In, Enchanted Forest, Seaside, and Night at the Show.

Each theme has its own colors, fonts, floating particles, wax seal, greeting,
"yes" button wording and sign-off.

## Detail modules

Add any of these to an invitation. Each one has quick-pick suggestions, or you
can write your own:

👗 What to wear · 🎨 Color palette · 🎒 What to bring · 🍽️ Food & drink ·
💸 Cost · 🚗 Getting there · 🅿️ Parking · 🌦️ Weather & terrain ·
🥾 Activity level · ✨ The vibe · 🎁 Surprise level · 👯 Who's coming ·
🐾 Kids & pets · ♿ Accessibility · 🔗 Link (tickets, menu, playlist) ·
📝 Good to know · ⏳ Please reply by

You can also add **custom fields** (pick an emoji, a label and a value, like
"🔑 Secret password: Moonbeam") and **questions for them** (allergies, drink of
choice, song request, pickup spot, or your own). Their answers come back in
the reply text.

## Running it

It's plain HTML, CSS and JavaScript modules, with no build step.

```sh
npm start        # serves at http://localhost:8080
npm test         # runs the unit tests (Node 18+)
```

(Any static server works, e.g. `python3 -m http.server`. Opening
`index.html` directly as a file won't work, because browsers block JS
modules over `file://`.)

## Putting it online (free)

The included workflow tests the app and publishes it to **GitHub Pages**
whenever `main` changes:

1. Merge this into `main`.
2. In the repo, go to **Settings → Pages → Build and deployment** and set
   **Source** to **GitHub Actions**.
3. Your app will be live at `https://ddraigfawr13.github.io/Date-Request-App/`.

Links you send only work from the deployed site, since the invitation is
opened on whatever address made it. Build invitations from the live URL, not
localhost.

## Privacy notes

- The invitation lives in the part of the URL after `#`, which browsers never
  send to a server. Anyone *with the link* can read it, though, so share
  it like you would the text itself.
- If you add your phone number for text-back RSVPs, it's inside the link too.
- RSVPs aren't collected anywhere. They arrive as a normal text message to you.

## Project layout

```
index.html          page shell (builder + invitation views)
css/styles.css      all styling, including envelope & particle animations
js/app.js           routes between builder and invitation (#i=…)
js/builder.js       the sender's form, live preview and "seal & send"
js/invite.js        the recipient's envelope, RSVP and replies
js/render.js        renders the invitation card (shared by both views)
js/themes.js        all themes, Wheel of the Year logic and moon phases
js/modules.js       detail modules, questions and occasion templates
js/calendar.js      .ics / Google / Outlook calendar links
js/codec.js         packs the invitation into the link (compressed)
tests/              unit tests (node --test)
```

### Adding your own theme or occasion

- **Theme:** add an entry to `THEMES` in `js/themes.js`. Set `group:
  'occasion'` and it shows up in the picker automatically.
- **Occasion template:** add an entry to `TEMPLATES` in `js/modules.js` with
  the theme and the details it should pre-fill.
- **Detail module:** add an entry to `MODULES` in `js/modules.js`.

## Ideas for later

- A tiny backend (e.g. a Cloudflare Worker) for short links, per-invite link
  previews, and an RSVP dashboard that tracks who said yes.
- Photo or GIF header on the card.
- Multi-guest invitations with a headcount.
- Month-specific flourishes (birth flowers, birthstones) layered on the
  seasonal theme.
