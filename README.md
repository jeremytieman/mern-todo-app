This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app). It is a todo app created using React, Express, and MongoDB.
There are three components, MongoDB, the Express backend, and the React frontend.

## Backend

To run the backend in development, change to the backend directory and run:

`nodemon server`

To run in production, change to the backend directory and run:

`NODE_ENV=production node server.js`

## Frontend

Change to the frontend directory, and follow the below steps.

### Available Scripts

In the project directory, you can run:

#### `yarn start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

#### `yarn test`

Launches the test runner in the interactive watch mode.<br />
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

#### `yarn build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

#### `yarn eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

### Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

#### Code Splitting

This section has moved here: https://facebook.github.io/create-react-app/docs/code-splitting

#### Analyzing the Bundle Size

This section has moved here: https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size

#### Making a Progressive Web App

This section has moved here: https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app

#### Advanced Configuration

This section has moved here: https://facebook.github.io/create-react-app/docs/advanced-configuration

#### Deployment

This section has moved here: https://facebook.github.io/create-react-app/docs/deployment

#### `yarn build` fails to minify

This section has moved here: https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify

## Docker Deploy

The project contains Dockerfiles to create backend and frontend containers. In order to set up the entire system, two Docker elements must be set up first.
First, for the MondoDB Docker image, you must set up two volumes for Mongo to store its data:

`docker volume create mongodata`
`docker volume create mongoconfig`

Next, the system should reside within its own network:

`docker network create --subnet=192.168.0.0/16 todo`

### MongoDB

Pull down the Docker MongoDB image:

`docker pull mongodb`

Next, launch the container:

`docker run -it -v mongoconfig:/data/configdb -v mongodata:/data/db --name todo-mongodb --net todo --ip 192.168.0.100 -d mongo`

Once the container is running, connected to the container:

`docker exec -it mongodb bash`

Once connected to the container, run `mongo` and create the database `use todos` then type `exit`.
At this point, the MongoDB container is fully set up.

### Backend

In order to build the backend Docker image:

`docker build -t todo-backend-image .`

Should you wish to change the port the service runs on, you can pass a port argument during the build step:

`docker build -t todo-backend-image --build-arg port_arg=5000`

To run the container, you'll have to provide the URL to the MongoDB container:

`docker run -it -p 4000:4000 --name todo-backend --net todo --add-host=mongo:192.168.0.100 -e MONGO_URL=mongodb://mongo:27017/todos -d todo-backend-image`

### Frontend

In order to build the frontend Docker image, you must build the frontend first:

`npm run build` or `yarn build`

Should you wish to change the API url, you can set the REACT_APP_API_URL environment variable while building the frontend. On *nix:

`REACT_APP_API_URL=http://192.168.0.1:4000 npm run build`

On Windows:

`set REACT_APP_API_URL=http://192.168.0.1:4000&&npm run build`

Now you can build the frontend Docker image:

`docker build -t todo-frontend-image .`

To run the container:

`docker run -it -p 8000:80 --name todo-frontend --net todo -d todo-frontend-image`

At this point, the entire application is up and running. You can open a web browser and navigate to http://localhost:8000/ and see the site.

## Docker Compose

Rather than attempt to build all the Docker containers individually, you can simply run:

`docker-compose build`

To launch all the containers, you can simply run:

`docker-compose up -d`

This will create all necessary Docker resources and start the containers. In order to stop the containers, run:

`docker-compose down`
