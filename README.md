# Laurier Course Notifier (WIP)

## Purpose
Scrapes a WLU class endpoint and sends an email through mailgun if the available seats in a course changes

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
