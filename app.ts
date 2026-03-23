interface Asset {
  uniqueName: string;
  blockchain: string;
  name: string;
}

let allAssets: Asset[] = [];

const fetchAssets = async () => {
  const response = await fetch(
    "https://api.dfx.swiss/v1/asset"
  );
  const data = await response.json();
  allAssets = data;

  const blockchains = [...new Set(allAssets.map(a => a.blockchain))];
  
  const select = document.getElementById("filter") as HTMLSelectElement;
  blockchains.forEach(blockchain => {
    const option = document.createElement("option");
    option.value = blockchain;
    option.textContent = blockchain;
    select.appendChild(option);
  });

  document.getElementById("total-assets")!.textContent = 
    String(allAssets.length);
  document.getElementById("total-blockchains")!.textContent = 
    String(blockchains.length);
  document.getElementById("status")!.textContent = "Live";

  render();
};

const render = () => {
  const search = (document.getElementById("search") as HTMLInputElement)
    .value.toLowerCase();
  const filter = (document.getElementById("filter") as HTMLSelectElement)
    .value;

  const filtered = allAssets.filter(asset => {
    const matchesSearch = asset.uniqueName.toLowerCase().includes(search);
    const matchesFilter = filter === "all" || asset.blockchain === filter;
    return matchesSearch && matchesFilter;
  });

  const grid = document.getElementById("grid")!;
  grid.innerHTML = filtered.map(asset => `
    <div class="asset-card">
      <div class="asset-name">${asset.uniqueName}</div>
      <div class="asset-blockchain">${asset.blockchain}</div>
    </div>
  `).join("");
};

const simulate = async () => {
  const amount = parseFloat(
    (document.getElementById("sim-amount") as HTMLInputElement).value
  );
  const coin = (document.getElementById("sim-coin") as HTMLSelectElement).value;

  if (!amount || amount <= 0) {
    document.getElementById("sim-result")!.innerHTML = "";
    return;
  }

  const response = await fetch(
    `https://api.coingecko.com/api/v3/simple/price?ids=${coin}&vs_currencies=eur`
  );
  const data = await response.json();
  const price = data[coin].eur;

  const dfxFee = 0.0149; // 1.49% DFX Standard-Gebühr
  const amountAfterFee = amount * (1 - dfxFee);
  const crypto = (amountAfterFee / price).toFixed(6);
  const feeAmount = (amount * dfxFee).toFixed(2);

  document.getElementById("sim-result")!.innerHTML = `
    Du bekommst: <span>${crypto} ${coin.toUpperCase()}</span><br>
    <small style="color:#666">DFX Gebühr: €${feeAmount} (1.49%) · Preis: €${price.toLocaleString()} per ${coin.toUpperCase()}</small>
  `;
};

(window as any).simulate = simulate;
npx tsc app.ts --target es6 --moduleResolution node --esModuleInterop true

fetchAssets();