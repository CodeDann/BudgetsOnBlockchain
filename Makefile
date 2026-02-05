compile: 
	@cd blockchain && echo --- Compiling contracts --- && npx hardhat compile

test: compile 
	@cd blockchain && echo --- Testing contracts --- && npx hardhat test

deploy: test
	@cd blockchain && echo --- Cleaning up old deployments --- && if [ -d "ignition/deployments/chain-31337" ]; then rm -r ignition/deployments/chain-31337; fi && echo --- Deploying contract to localhost --- && npx hardhat ignition deploy ignition/modules/Deployer.js --network localhost

start-node:
	@cd blockchain && echo --- Starting installing dependencies --- && npm install && echo --- Starting local node --- && npx hardhat node --hostname 0.0.0.0 --port 8545

start-backend: 
	@cd backend && echo --- Starting backend server --- && npx hardhat run src/server.js --network localhost

start-frontend:
	@cd frontend && echo --- Starting installing dependencies --- && npm install && echo --- Starting frontend --- && npm run dev