import { AppProps, type AppType } from "next/app";
import { trpc } from "../utils/trpc";
import { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import "../styles/globals.css";

const MyApp: AppType<{ session: Session | null }> = ({
	Component,
	pageProps: { session, ...pageProps },
}: AppProps) => {
	return (
		<SessionProvider session={session}>
			<Component {...pageProps}></Component>
		</SessionProvider>
	);
};

export default trpc.withTRPC(MyApp);
