import { ModalContainer } from "@/components/modals/ModalContainer";
import { ModalProvider } from "@/lib/providers/ModalContext";
import { WalletProvider } from "@/lib/providers/WalletContext";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "flowCred.it - Avaliação de Crédito Descentralizada",
  description: "Plataforma descentralizada de avaliação de crédito com privacidade garantida e controle total sobre seus dados.",
  keywords: ["crédito", "descentralizado", "ZKProofs", "DID", "VC", "VP", "privacidade", "autocustódia"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-black`}
      >
        <ModalProvider>
          <WalletProvider>
            <ModalContainer />
            {children}
          </WalletProvider>
        </ModalProvider>
      </body>
    </html>
  );
}
