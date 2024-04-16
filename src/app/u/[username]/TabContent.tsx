import { CircularProgress } from "@nextui-org/react";
import React from "react";

interface TabContentProps {
	children: React.ReactNode;
	loading: boolean;
	noData: boolean;
	noDataMessage: string;
}

const TabContent: React.FC<TabContentProps> = ({
	children,
	loading,
	noData,
	noDataMessage,
}) => {
	return (
		<div>
			<div
				className={`flex flex-col gap-y-12 max-w-[1000px] w-full ${
					loading ? "opacity-0" : "opacity-1"
				} transition-opacity duration-200`}
			>
				{children}
			</div>
			{noData ? (
				<h2
					className={`text-center ${
						loading ? "opacity-[30%]" : "opacity-0"
					} transition-opacity duration-200`}
				>
					{noDataMessage}
				</h2>
			) : (
				""
			)}
			<div
				className={`my-10 w-[1000px] flex items-center justify-center ${
					loading ? "opacity-1" : "opacity-0"
				} transition-opacity duration-200`}
			>
				<CircularProgress size="lg" />
			</div>
		</div>
	);
};

export default TabContent;
