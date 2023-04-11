import { useEffect, useState } from "react";
import type { AppProps } from "next/app";
import { EthereumClient, w3mConnectors, w3mProvider } from "@web3modal/ethereum";
import { WalletConnectLegacyConnector } from "wagmi/connectors/walletConnectLegacy";
import { MetaMaskConnector } from "wagmi/connectors/metaMask";
import { Web3Modal } from "@web3modal/react";
import { configureChains, createClient, WagmiConfig } from "wagmi";
import { mainnet, bsc } from "wagmi/chains";
import { publicProvider } from "wagmi/providers/public";
import "../styles/globals.css";

// 1. Get projectID at https://cloud.walletconnect.com
if (!process.env.NEXT_PUBLIC_PROJECT_ID) {
	throw new Error("You need to provide NEXT_PUBLIC_PROJECT_ID env variable");
}

export const projectId = process.env.NEXT_PUBLIC_PROJECT_ID;

//t
// const chains: any = [bsc];
const { provider, chains } = configureChains([mainnet, bsc], [publicProvider()]);
const wagmiClient = createClient({
	autoConnect: true,
	connectors: [
		new MetaMaskConnector({
			chains,
		}),
		new WalletConnectLegacyConnector({
			chains,
			options: {
				qrcode: true,
				rpc: {
					56: "https://bsc-dataseed.binance.org/",
				},
			},
		}),
	],
	provider,
});

// 3. Configure modal ethereum client
// const ethereumClient = new EthereumClient(wagmiClient, chains);

// 4. Wrap your app with WagmiProvider and add <Web3Modal /> compoennt
export default function App({ Component, pageProps }: AppProps) {
	const [ready, setReady] = useState(false);

	useEffect(() => {
		setReady(true);
	}, []);

	return (
		<>
			{ready ? (
				<WagmiConfig client={wagmiClient}>
					<Component {...pageProps} />
				</WagmiConfig>
			) : null}

			{/* <Web3Modal projectId={projectId} ethereumClient={ethereumClient} /> */}
		</>
	);
}
