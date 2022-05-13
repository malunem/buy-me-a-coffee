const hre = require("hardhat");

async function getBalance(address) {
  const balanceBigInt = await hre.waffle.provider.getBalance(address);

  return hre.ethers.utils.formatEther(balanceBigInt);
}

async function printBalances(addresses) {
  let idx = 0;
  for (const address of addresses) {
    console.log(`Address ${idx} balance: `, await getBalance(address));
    idx ++;
  }
}

async function printMemos(memos) {
  for (const memo of memos) {
    const timestamp = memo.timestamp;
    const tipper = memo.name;
    const tipperAddress = memo.from;
    const message = memo.message;
    console.log(`At ${timestamp}, ${tipper} (${tipperAddress}) said: "${message}"`);
  }
}

async function main() {
  const [owner, tipper, tipper2, tipper3] = await hre.ethers.getSigners();

  const BuyMeACoffee = await hre.ethers.getContractFactory("BuyMeACoffee");
  const buyMeACoffee = await BuyMeACoffee.deploy();

  await buyMeACoffee.deployed();
  console.log("BuyMeACoffee deployed to: ", buyMeACoffee.address);

  const addresses = [owner.address, tipper.address, buyMeACoffee.address];
  console.log("START");

  await printBalances(addresses);

  const tip = {value: hre.ethers.utils.parseEther("1")};
  const tip2 = {value: hre.ethers.utils.parseEther("0.5")};
  const tip3 = {value: hre.ethers.utils.parseEther("1.3")};
  await buyMeACoffee.connect(tipper).buyCoffee("Alice", "You're the best!", tip);
  await buyMeACoffee.connect(tipper2).buyCoffee("Bob", "Amazing!", tip2);
  await buyMeACoffee.connect(tipper3).buyCoffee("Kay", "I love my Proof of Knowledge", tip3);

  console.log("BOUGHT COFFEE");

  await printBalances(addresses);
  await butMeACoffee.connect(owner).withdrawTips();
  
  console.log("WITHDRAW TIPS");
  
  await printBalances(addresses);

  console.log("MEMOS");
  const memos = await buyMeACoffee.getMemos();
  printMemos(memos);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })