start-node:
	npx hardhat node

compile: 
	@echo --- Compiling contracts ---
	npx hardhat compile

test: compile 
	@echo --- Testing contracts ---
	npx hardhat test

deploy: test
	@if [ -d "ignition/deployments/chain-31337" ]; then rm -r ignition/deployments/chain-31337; fi
	@echo --- Deploying contract to localhost --- 
	@npx hardhat ignition deploy ignition/modules/Deployer.js --network localhost

deploy-regulator: test
	@if [ -d "ignition/deployments/chain-3" ]; then rm -r ignition/deployments/chain-3; fi
	@echo --- Deploying contract to  --- 
	@npx hardhat ignition deploy ignition/modules/RegulatorDeploy.js --network localhost

run: 
	@npx hardhat run scripts/server.js --network localhost

