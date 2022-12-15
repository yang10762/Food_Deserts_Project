# Food Desert Finder

This is a collaborative project for CIS5500 at the University of Pennsylvania as part of the MCIT graduate degree program.

Authors:

*Yang Liu*

*Shari Sinclair*

*Shanley Demsich*

*Matthew Cope*



## Build Instructions

### Installing dependencies

In the server directory, run 

`npm install`

For the client, yarn is the preferred build tool.\
It can be installed via npm with 

`npm install --global yarn`

Once installed, navigate to the `client` directory and run `yarn i`

If you do not want to use yarn, the React server can be built with npm,\
though there is a possibility of some features not working correctly.\
In the `client` directory, first, run 

`npm install`

If there is an error, it should be resolved by running

`npm install --legacy-peer-deps`

If issues persist, please try yarn.

### Running the application

To run the application, the Express server and React server must be running at the same time in separate terminal instances.

To start the Express server, navigate to the `server` directory and run `npm start`. The server runs on `localhost:8080`.

To start the React server, navigate to the `client` directory and run `npm start`

Open [http://localhost:3000](http://localhost:3000) to view the application in your browser.
