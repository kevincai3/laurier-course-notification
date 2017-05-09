# Laurier Course Notifier (in Permanent MVP stage)

## Purpose
Scrapes a WLU class endpoint and sends an email through mailgun if the available seats in a course changes

## Important Information
I needed to get into this course at WLU but it was full. Basically this script notifies me the moment it's free so I can join. There is a bunch of leaky abstractions and hacks to quickly get it out and running (the longer it took the less likely it is for a person to drop). So the script ended up working and I got into the class (woohoo (๑˃̵ᴗ˂̵)و), but it means that I'm not going to work on the script anymore. I might rewrite this into a web service that anyone can join, but that will be a ways off in the future. As such, I'll leave this public to serve as an example of how it might be done.

## Known Issues
- Can randomly stop working (suggested to run a process monitor to restart if it stops).

## Current Status
- [x] Initial testing works (runs on my machine)
- [x] Works on Digital Ocean
- [ ] Proper tests have been written
- [x] Has been working for a week

## Roadmap
- [ ] Change config file to yaml
- [ ] Better documentation
- [ ] Multiple course endpoints
- [ ] Better logging
