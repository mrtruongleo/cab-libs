1. fetch cosmos chain data (set chain name in fetchCosmosChain.ts file)
   npm run cosmos chain_name

2. Join all chain data
   npm run joinChain
3. Join defi data
   npm run joinDefi
4. Fetch coinlist
   npm run updateCoinlist

# crontab

git add coinlist.json

crontab -e
0 0-23/4 \* \* \* /root/update-coinlist/update.sh
