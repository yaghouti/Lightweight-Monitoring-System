# Lightweight Monitoring System
This is a system to track changes on websites and inform users via their emails.

# Requirements
Nodejs, Mongodb

# Installation
> npm i

# Run
> npm start

# Guide
Use Postman Collection in `docs/Postman` to:

> 1. Create user group
> It creates a user group with provided name and emails.
> 2. Get user groups
> It returns a list of all user groups.
> 3. Get user groups by name
> It returns the specified group.
> 4. Create tracker
> It creates a tracker to keep track of a url.
> 5. Get trackers
> It returns a list of all trackers.
> 6. Get trackers by url
> It returns the specified tracker.
> 7. Get tracking data
> It returns a list of all tracking data.
> 8. Get tracking data by url
> It returns a list of all tracking data for the specified url.