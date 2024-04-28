compile: 
	@cd backend && echo --- Compiling contracts --- && npx hardhat compile

test: compile 
	@cd backend && echo --- Testing contracts --- && npx hardhat test

deploy: test
	@cd backend && echo --- Cleaning up old deployments --- && if [ -d "ignition/deployments/chain-31337" ]; then rm -r ignition/deployments/chain-31337; fi && echo --- Deploying contract to localhost --- && npx hardhat ignition deploy ignition/modules/Deployer.js --network localhost

start-node:
	@cd backend && echo --- Starting installing dependencies --- && npm install && echo --- Starting local node --- && npx hardhat node

start-backend: 
	@cd backend && echo --- Starting backend server --- && npx hardhat run src/server.js --network localhost

start-frontend:
	@cd frontend && echo --- Starting installing dependencies --- && npm install && echo --- Starting frontend --- && npm run dev