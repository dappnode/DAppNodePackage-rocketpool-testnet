#!/bin/bash

#############
# VARIABLES #
#############
ERROR="[ ERROR-rocketpool ]"
WARN="[ WARN-rocketpool ]"
INFO="[ INFO-rocketpool ]"

## exit if $NETWORK is not set
if [ -z "${NETWORK}" ]; then
    echo "NETWORK is not set"
    exit 1
fi

case $NETWORK in
"mainnet")
    echo "Mainnet network"

    # Assign proper value to _DAPPNODE_GLOBAL_EXECUTION_CLIENT_MAINNET.
    case $_DAPPNODE_GLOBAL_EXECUTION_CLIENT_MAINNET in
    "geth.dnp.dappnode.eth")
        _EXECUTION_LAYER_HTTP="http://geth.dappnode:8545"
        _EXECUTION_LAYER_WS="ws://geth.dappnode:8546"
        ;;
    "nethermind.public.dappnode.eth")
        _EXECUTION_LAYER_HTTP="http://nethermind.public.dappnode:8545"
        _EXECUTION_LAYER_WS="ws://nethermind.public.dappnode:8546"
        ;;
    "besu.public.dappnode.eth")
        _EXECUTION_LAYER_HTTP="http://besu.public.dappnode:8545"
        _EXECUTION_LAYER_WS="ws://besu.public.dappnode:8546"
        ;;
    "erigon.dnp.dappnode.eth")
        _EXECUTION_LAYER_HTTP="http://erigon.dappnode:8545"
        _EXECUTION_LAYER_WS="ws://erigon.dappnode:8545"
        ;;
    *)
        echo "Unknown value or unsupported for _DAPPNODE_GLOBAL_EXECUTION_CLIENT_MAINNET Please confirm that the value is correct"
        exit 1
        ;;
    esac
    
    # Assign proper value to _DAPPNODE_GLOBAL_CONSENSUS_CLIENT_PRATER.
    case "$_DAPPNODE_GLOBAL_CONSENSUS_CLIENT_MAINNET" in
    "prysm.dnp.dappnode.eth")
      _BEACON_NODE_API_3500="http://beacon-chain.prysm.dappnode:3500"
      _BEACON_NODE_API_4000="http://beacon-chain.prysm.dappnode:4000"
      _BEACON_NODE_CLIENT="prysm"
      ;;
    "teku.dnp.dappnode.eth")
      _BEACON_NODE_API_3500="http://beacon-chain.teku.dappnode:3500"
      _BEACON_NODE_API_4000="http://beacon-chain.teku.dappnode:4000"
      _BEACON_NODE_CLIENT="teku"
      ;;
    "lighthouse.dnp.dappnode.eth")
      _BEACON_NODE_API_3500="http://beacon-chain.lighthouse.dappnode:3500"
      _BEACON_NODE_API_4000="http://beacon-chain.lighthouse.dappnode:4000"
      _BEACON_NODE_CLIENT="lighthouse"
      ;;
    "nimbus.dnp.dappnode.eth")
      _BEACON_NODE_API_3500="http://beacon-validator.nimbus.dappnode:4500"
      _BEACON_NODE_API_4000="http://beacon-validator.nimbus.dappnode:4500"
      _BEACON_NODE_CLIENT="nimbus"
      ;;
    "lodestar.dnp.dappnode.eth")
      _BEACON_NODE_API_3500="http://beacon-chain.lodestar.dappnode:3500"
      _BEACON_NODE_API_4000="http://beacon-chain.lodestar.dappnode:4000"
      _BEACON_NODE_CLIENT="lodestar"
      ;;
    *)
      echo "Unknown value or unsupported for _DAPPNODE_GLOBAL_CONSENSUS_CLIENT_MAINNET Please confirm that the value is correct"
      exit 1
      ;;
    esac

    ;;
"prater")
    echo "Prater network"

    # https://github.com/dappnode/DAppNodePackage-SSV-Shifu/blob/775dfbc2190b8c3bc7384a2e4c62d83892071001/build/entrypoint.sh#L3
    # Assign proper value to _DAPPNODE_GLOBAL_EXECUTION_CLIENT_PRATER.
    case $_DAPPNODE_GLOBAL_EXECUTION_CLIENT_PRATER in
    "goerli-geth.dnp.dappnode.eth")
        _EXECUTION_LAYER_HTTP="http://goerli-geth.dappnode:8545"
        _EXECUTION_LAYER_WS="ws://goerli-geth.dappnode:8546"
        ;;
    "goerli-nethermind.dnp.dappnode.eth")
        _EXECUTION_LAYER_HTTP="http://goerli-nethermind.dappnode:8545"
        _EXECUTION_LAYER_WS="ws://goerli-nethermind.dappnode:8546"
        ;;
    "goerli-besu.dnp.dappnode.eth")
        _EXECUTION_LAYER_HTTP="http://goerli-besu.dappnode:8545"
        _EXECUTION_LAYER_WS="ws://goerli-besu.dappnode:8546"
        ;;
    "goerli-erigon.dnp.dappnode.eth")
        _EXECUTION_LAYER_HTTP="http://goerli-erigon.dappnode:8545"
        _EXECUTION_LAYER_WS="ws://goerli-erigon.dappnode:8545"
        ;;
    *)
        echo "Unknown value or unsupported for _DAPPNODE_GLOBAL_EXECUTION_CLIENT_PRATER Please confirm that the value is correct"
        exit 1
        ;;
    esac

    # Assign proper value to _DAPPNODE_GLOBAL_CONSENSUS_CLIENT_PRATER.
    case "$_DAPPNODE_GLOBAL_CONSENSUS_CLIENT_PRATER" in
    "prysm-prater.dnp.dappnode.eth")
      _BEACON_NODE_API_3500="http://beacon-chain.prysm-prater.dappnode:3500"
      _BEACON_NODE_API_4000="http://beacon-chain.prysm-prater.dappnode:4000"
      _BEACON_NODE_CLIENT="prysm"
      ;;
    "teku-prater.dnp.dappnode.eth")
      _BEACON_NODE_API_3500="http://beacon-chain.teku-prater.dappnode:3500"
      _BEACON_NODE_API_4000="http://beacon-chain.teku-prater.dappnode:4000"
      _BEACON_NODE_CLIENT="teku"
      ;;
    "lighthouse-prater.dnp.dappnode.eth")
      _BEACON_NODE_API_3500="http://beacon-chain.lighthouse-prater.dappnode:3500"
      _BEACON_NODE_API_4000="http://beacon-chain.lighthouse-prater.dappnode:4000"
      _BEACON_NODE_CLIENT="lighthouse"
      ;;
    "nimbus-prater.dnp.dappnode.eth")
      _BEACON_NODE_API_3500="http://beacon-validator.nimbus-prater.dappnode:4500"
      _BEACON_NODE_API_4000="http://beacon-validator.nimbus-prater.dappnode:4500"
      _BEACON_NODE_CLIENT="nimbus"
      ;;
    "lodestar-prater.dnp.dappnode.eth")
      _BEACON_NODE_API_3500="http://beacon-chain.lodestar-prater.dappnode:3500"
      _BEACON_NODE_API_4000="http://beacon-chain.lodestar-prater.dappnode:4000"
      _BEACON_NODE_CLIENT="lodestar"
      ;;
    *)
      echo "Unknown value or unsupported for _DAPPNODE_GLOBAL_CONSENSUS_CLIENT_PRATER Please confirm that the value is correct"
      exit 1
      ;;
    esac

    ;;
*)
    echo "Unknown value or unsupported for NETWORK Please confirm that the value is correct"
    exit 1
    ;;
esac

export EXECUTION_LAYER_HTTP=$_EXECUTION_LAYER_HTTP
export EXECUTION_LAYER_WS=$_EXECUTION_LAYER_WS

export BEACON_NODE_API_3500=$_BEACON_NODE_API_3500
export BEACON_NODE_API_4000=$_BEACON_NODE_API_4000
export BEACON_NODE_CLIENT=$_BEACON_NODE_CLIENT

# For testing porpuses, uncomment the above lines and comment the following ones
# BEACON_NODE_CLIENT="prysm"

# EXECUTION_LAYER_HTTP="http://goerli-geth.dappnode:8545"
# EXECUTION_LAYER_WS="ws://goerli-geth.dappnode:8546"

# BEACON_NODE_API_3500="http://beacon-chain.prysm-prater.dappnode:3500"
# BEACON_NODE_API_4000="http://beacon-chain.prysm-prater.dappnode:4000"

NETWORK="${NETWORK}" \
BEACON_NODE_CLIENT="${BEACON_NODE_CLIENT}" \
EXECUTION_LAYER_HTTP="${EXECUTION_LAYER_HTTP}" \
EXECUTION_LAYER_WS="${EXECUTION_LAYER_WS}" \
BEACON_NODE_API_3500="${BEACON_NODE_API_3500}" \
BCJSONRPCURL="${BEACON_NODE_API_4000}" \
envsubst < /app/rocketpool/user-settings_template.yml > /app/rocketpool/user-settings.yml

# Create data and rewards-trees folders
mkdir -p /rocketpool/data/rewards-trees

# Run Rocketpool service
# Check if the file /rocketpool/data/rocketpool.db exists
if [ -f "/rocketpool/data/wallet" ]; then
    echo "${INFO} Wallet already created"
fi
if [ ! -f /rocketpool/data/password ]; then
    echo "${INFO} set-password"
    /usr/local/bin/rocketpoold --settings /app/rocketpool/user-settings.yml api wallet set-password "${WALLET_PASSWORD}"
fi
echo "${INFO} Initializing Rocketpool service"
exec /usr/local/bin/rocketpoold --settings /app/rocketpool/user-settings.yml node

# Loop to wait until the Rocketpool service is up and running
# while true; do
#     if [[ $(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/version) == "200" ]]; then
#         echo "Rocketpool service is up and running"
#         break
#     fi
#     echo "Waiting for Rocketpool service to be up and running"
#     sleep 5
# done
