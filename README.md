xkcd.com wrapper
```js
/*
 * Example One
 */
const xkcd = require("xkcd-wrapper");
xkcd.getLatest()
    .then(obj => {
        console.log(xkcd.msg("Latest XKCD post: {link}", obj));
        /*
         * all placeholders that can be used with xkcd.msg()
         *   {link}
         *   {num}
         *   {title}
         *   {safeTitle}
         *   {date}
         *   {alt}
         *   {imgUrl}
         */
    })
    .catch(err => {
        console.log(err);
    });
```
```js
/*
 * Example Two
 */
const xkcd = require("xkcd-wrapper");
xkcd.getPost(369) // Args: Post number
    .then(obj => {
        console.log(obj.link);
    })
    .catch(err => {
        console.log(err);
    });
```
```js
/*
 * Example Three
 */
const xkcd = require("xkcd-wrapper");
xkcd.events.on("newPost", (obj) => {
    console.log(JSON.stringify(obj));
});
xkcd.subscribe(3600, "./xkcdWrapperData.json"); // Args: New post check interval in seconds, Data file path
```
Have any issues, questions or suggestions? [Join my Discord server](https://discord.com/invite/dcAwVFj2Pf) or [open a Github issue](https://github.com/James-Bennett-295/npm-xkcd-wrapper/issues/new).
