# Jeff Wedding Invitation RSVP

Open `index.html` in a browser to view the H5-style wedding invitation.

## Before sending to friends

Edit the visible invite details in `index.html`:

- Couple name in the cover title
- Display date
- Time
- Venue
- Google Maps link

Edit the RSVP and countdown settings in `app.js`:

```js
const WEDDING = {
  couple: "Mr Jefferey & Ms Ying Shya",
  date: "Tuesday, 15 September 2026",
  venue: "No 18 Jalan Gamelan 3, Bandar Bukit Raja",
  eventDate: "2026-09-15T19:30:00+08:00",
  hostWhatsAppNumber: "60132321896",
};
```

Use your WhatsApp number in international format without `+`, spaces, or dashes.
For Malaysia, it usually starts with `60`.

## How RSVP collection works

When a guest submits the form, WhatsApp opens with a ready message containing:

- Guest name
- Number of people coming
- Wedding date
- Venue
- Optional blessing/message

The guest still needs to press send in WhatsApp. This keeps the invite simple and works without a server or paid database.

The host list at the bottom stores test responses only on the current device. It is useful for checking the form and downloading a CSV, but replies from other phones will arrive in your WhatsApp chat.

## Publish With GitHub Pages

1. Open GitHub Desktop.
2. Choose `File` > `Add local repository`.
3. Select this folder: `C:\Users\60182\Documents\jeff wedding invitation card`.
4. Click `Publish repository`.
5. Keep it public unless you already know how to publish private GitHub Pages.
6. On GitHub.com, open the repository settings.
7. Go to `Pages`.
8. Under `Build and deployment`, choose `Deploy from a branch`.
9. Select branch `main` and folder `/root`.
10. Save.

After GitHub finishes publishing, your invite link will look similar to:

```text
https://YOUR-GITHUB-NAME.github.io/REPOSITORY-NAME/
```
