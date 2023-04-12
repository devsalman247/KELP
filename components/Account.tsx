import { useState } from "react";
import { useWeb3Modal } from "@web3modal/react";
import { useAccount, useConnect, useEnsName } from "wagmi";
import { disconnect } from "@wagmi/core";
import Dropdown from "react-bootstrap/Dropdown";
import { Modal } from "react-bootstrap";
import Button from "./Button";
import Image from "next/image";
import metamask from "../public/ConnectWallet/metamask.svg";
import walletconnect from "../public/ConnectWallet/walletconnect.svg";
import { shortenHex } from "../utils/util";
import { KELP_TOKEN_ADDRESS, KELP_TOKEN_SYMBOL, KELP_TOKEN_DECIMAL, KELP_TOKEN_IMAGE } from "../utils/constants";

type DropDownToggleProps = {
	className?: string;
};

export default function HomePage({ className }: DropDownToggleProps) {
	const [loading, setLoading] = useState(false);
	const { open } = useWeb3Modal();
	const { address, isConnected } = useAccount();
	const { connect, connectors, error, pendingConnector } = useConnect({
		onError(error) {
			console.log("Error", error);
		},
	});
	const [showModal, setShowModal] = useState(false);
	const [disableSignup, setDisableSignup] = useState(false);

	const openModal = () => setShowModal(true);
	const closeModal = () => setShowModal(false);

	const { data, isError, isLoading } = useEnsName();

	const onClose = async () => {
		setLoading(true);
		await disconnect();
		setLoading(false);
	};

	const addKelpToWallet = async () => {
		if (!window.ethereum) {
			return;
		}

		await window.ethereum.request({
			method: "wallet_watchAsset",
			params: {
				type: "ERC20",
				options: {
					address: KELP_TOKEN_ADDRESS,
					symbol: KELP_TOKEN_SYMBOL,
					decimals: KELP_TOKEN_DECIMAL,
					image: KELP_TOKEN_IMAGE,
				},
			},
		});
	};

	return (
		<>
			{isConnected && address ? (
				<Dropdown>
					<Dropdown.Toggle
						className={`toggle-btn text-green-1 font-helvetica text-lg py-2 rounded-lg btn-header ${className}`}
						id="dropdown-basic">
						{data || `${shortenHex(address, 4)}`}
					</Dropdown.Toggle>

					<Dropdown.Menu>
						<Dropdown.Item onClick={addKelpToWallet}>Import Kelp to wallet</Dropdown.Item>
						<Dropdown.Item onClick={onClose}>{loading ? "Disconnecting" : "Disconnect"}</Dropdown.Item>
					</Dropdown.Menu>
				</Dropdown>
			) : (
				<>
					<Button
						id="connect-wallet"
						className="bg-green-1 hover:bg-green-2 text-white font-helvetica text-lg py-2 xxxs:px-3 xxs:px-11 border-2 border-secondary rounded-lg"
						variant="primary"
						onClick={openModal}
						disabled={loading}>
						{loading ? "Loading..." : "Connect Wallet"}
					</Button>
					<Modal
						show={showModal}
						style={{ opacity: 1 }}
						animation={false}
						onHide={closeModal}
						dialogClassName="metaModal"
						centered>
						<div className="modal-header">
							<div className="modal-title h4">Connect Wallet</div>
							<button type="button" className="btn-close" aria-label="Close" onClick={() => closeModal()}></button>
						</div>
						<div className="modal-body p-0">
							<div
								className={`${disableSignup ? "disabled" : ""}`}
								onClick={async () => {
									closeModal();
									// connect({ connector: connectors[0] });
									await open();
								}}>
								<div className="walletLogo">
									<Image className={`${disableSignup ? "disabled" : ""}`} src={metamask} alt="" />
								</div>
								<div className="fs-24 fw-700 mb-4 text-center">MetaMask</div>
								<div className="fs-16 fw-400 mb-4 text-center">Connect to your MetaMask Wallet</div>
							</div>
							<hr />
							<div
								className={`${disableSignup ? "disabled" : ""}`}
								onClick={async () => {
									closeModal();
									// connect({ connector: connectors[1], chainId: 56 });
									await open();
								}}>
								<div className="walletLogo">
									<Image className={`${disableSignup ? "disabled" : ""}`} src={walletconnect} alt="" />
								</div>
								<div className="fs-24 fw-700 mb-4 text-center">WalletConnect</div>
								<div className="fs-16 fw-400 mb-4 text-center">Connect using WalletConnect</div>
							</div>
						</div>
					</Modal>
				</>
			)}
		</>
	);
}
