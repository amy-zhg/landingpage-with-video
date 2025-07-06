# Next Slide, Please

My end goal is to never have to hear those words again.

To do this, I'm exploiting the `/preview?slide=` endpoint and query for Google Slides, allowing you to summon any slide from a doc that you have access to. With that, we can have a primary user load up a presentation, and generate a code for users who need the "remove". Then, using Socket.io, we can let other users connect and advance the slide number on their end, giving everyone a "next slide" button who needs it.

## To-do:

- [x] display slide based on slide number
- [x] allow users to advance slide remotely
- [x] let primary insert any Google Slides presentation they own
- [x] generate a code for primary user to share with secondary users
- [x] allow secondary users to advance the slide in ONLY the presentation they have the code for
- [x] make it look nice (inside & out!)
- [x] smooth out slide loading (maybe pre-load the next slide?)

## Notes: 

- To smooth transitions, the app pre-loads the next slide in the background, meaning that autoplay videos and animations will start playing before the slide is actually visible.
- I'm considering adding a cooldown timer between clicks of the "next" button, to prevent accidentally skipping slides. Not sure if this is needed though, need to do more testing first.